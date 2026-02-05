import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeKickCode,
  parseOAuthState,
} from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Handle OAuth errors
  if (error) {
    console.error('Kick OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=oauth_error`);
  }

  // Validate code and state
  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=missing_params`);
  }

  // Verify state matches
  const storedState = request.cookies.get('kick_oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=invalid_state`);
  }

  // Get code_verifier from cookie
  const codeVerifier = request.cookies.get('kick_code_verifier')?.value;
  if (!codeVerifier) {
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=missing_verifier`);
  }

  // Parse state to get redirect URL
  const parsedState = parseOAuthState(state);
  const redirectTo = parsedState?.redirectTo || '/';

  try {
    // Exchange code for tokens with PKCE
    const tokens = await exchangeKickCode(code, codeVerifier);
    console.log('✅ Successfully exchanged code for access token');

    // Instead of fetching user data from server (which gets blocked),
    // redirect to a client-side page that will fetch the data from the browser
    const response = NextResponse.redirect(`${baseUrl}/auth/complete?token=${encodeURIComponent(tokens.access_token)}`);
    response.cookies.delete('kick_oauth_state');
    response.cookies.delete('kick_code_verifier');

    // Pass persistent ID if exists
    const persistentId = request.cookies.get('kick_persistent_id')?.value;
    if (persistentId) {
      response.cookies.set('kick_temp_persistent_id', persistentId, {
        httpOnly: false, // Client needs to read this
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300, // 5 minutes
        path: '/',
      });
    }

    return response;
  } catch (err) {
    console.error('❌ Kick OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/?auth=error&message=auth_failed`);
  }
}
