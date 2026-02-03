import { NextRequest, NextResponse } from 'next/server';
import { getDiscordAuthUrl, generateOAuthState } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get('redirectTo') || '/';

  // Generate state with redirect info
  const state = generateOAuthState('discord', redirectTo);

  // Store state in cookie for verification
  const response = NextResponse.redirect(getDiscordAuthUrl(state));
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

  return response;
}
