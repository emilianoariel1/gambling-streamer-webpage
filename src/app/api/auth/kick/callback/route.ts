import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeKickCode,
  fetchKickUser,
  parseOAuthState,
  upsertUser,
  createSessionToken,
  setSessionCookie,
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
    return NextResponse.redirect(`${baseUrl}/auth/login?error=oauth_error`);
  }

  // Validate code and state
  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/auth/login?error=missing_params`);
  }

  // Verify state matches
  const storedState = request.cookies.get('oauth_state')?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/auth/login?error=invalid_state`);
  }

  // Parse state to get redirect URL
  const parsedState = parseOAuthState(state);
  const redirectTo = parsedState?.redirectTo || '/';

  try {
    // Exchange code for tokens
    const tokens = await exchangeKickCode(code);

    // Fetch user data
    const kickUser = await fetchKickUser(tokens.access_token);

    // Create or update user in database
    const user = await upsertUser({
      provider: 'kick',
      providerId: String(kickUser.id),
      username: kickUser.username,
      displayName: kickUser.username,
      avatar: kickUser.profile_pic,
      email: kickUser.email || null,
    });

    // Create session token
    const sessionToken = await createSessionToken(user);

    // Set session cookie
    await setSessionCookie(sessionToken);

    // Clear OAuth state cookie and redirect
    const response = NextResponse.redirect(`${baseUrl}${redirectTo}`);
    response.cookies.delete('oauth_state');

    return response;
  } catch (err) {
    console.error('Kick OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_failed`);
  }
}
