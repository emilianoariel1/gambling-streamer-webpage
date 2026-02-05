import { NextRequest, NextResponse } from 'next/server';
import { getKickAuthUrl, generateOAuthState, generateCodeVerifier, generateCodeChallenge } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirectTo') || '/';

  // Generate state with redirect info
  const state = generateOAuthState(redirectTo);

  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Create redirect response
  const response = NextResponse.redirect(getKickAuthUrl(state, codeChallenge));

  // Store state and code_verifier in cookies for verification in callback
  response.cookies.set('kick_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  response.cookies.set('kick_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}
