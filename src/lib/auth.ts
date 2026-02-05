import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import type { User, AuthSession, OAuthState } from '@/types/auth';
import { supabaseAdmin } from './supabase/server';

// Environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID || '';
const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET || '';
const KICK_REDIRECT_URI = process.env.KICK_REDIRECT_URI || 'http://localhost:3000/api/auth/kick/callback';

// Cookie settings
const COOKIE_NAME = 'auth_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// =============================================
// PKCE HELPERS
// =============================================

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier: string): string {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

// =============================================
// OAUTH STATE MANAGEMENT
// =============================================

export function generateOAuthState(redirectTo?: string): string {
  const state: OAuthState = {
    redirectTo,
    nonce: crypto.randomUUID(),
  };
  return Buffer.from(JSON.stringify(state)).toString('base64url');
}

export function parseOAuthState(state: string): OAuthState | null {
  try {
    return JSON.parse(Buffer.from(state, 'base64url').toString());
  } catch {
    return null;
  }
}

// =============================================
// KICK OAUTH FUNCTIONS
// =============================================

export function getKickAuthUrl(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_id: KICK_CLIENT_ID,
    response_type: 'code',
    redirect_uri: KICK_REDIRECT_URI,
    state,
    scope: 'user:read channel:read',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `https://id.kick.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeKickCode(
  code: string,
  codeVerifier: string
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  console.log('🔄 Exchanging Kick code for token...');
  console.log('Client ID:', KICK_CLIENT_ID);
  console.log('Redirect URI:', KICK_REDIRECT_URI);

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: KICK_CLIENT_ID,
      client_secret: KICK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: KICK_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Kick token exchange error:', response.status, error);
    throw new Error(`Failed to exchange Kick code for token: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('✅ Token exchange successful');
  return data;
}

// NOTE: User data is now fetched from the client-side in /auth/complete
// This avoids server-side CORS and security policy blocks from Kick's API
// See: /app/auth/complete/page.tsx and /api/auth/kick/complete/route.ts

// =============================================
// JWT TOKEN HANDLING
// =============================================

export async function createSessionToken(user: User): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.user as User;
  } catch {
    return null;
  }
}

// =============================================
// COOKIE HANDLING
// =============================================

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// =============================================
// GET CURRENT USER
// =============================================

export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  return verifySessionToken(token);
}

// =============================================
// DATABASE USER MANAGEMENT
// =============================================

export async function upsertUser(userData: {
  kickId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  email: string | null;
  isSubscriber?: boolean;
  isModerator?: boolean;
}): Promise<User> {
  try {
    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('kick_id', userData.kickId)
      .single();

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({
          username: userData.username,
          display_name: userData.displayName,
          avatar: userData.avatar,
          email: userData.email,
          is_subscriber: userData.isSubscriber || false,
          is_moderator: userData.isModerator || false,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('kick_id', userData.kickId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: updatedUser.id,
        username: updatedUser.username,
        displayName: updatedUser.display_name,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
        provider: 'kick',
        providerId: updatedUser.kick_id,
        isVip: updatedUser.is_vip,
        isModerator: updatedUser.is_moderator,
        isSubscriber: updatedUser.is_subscriber,
        isAdmin: updatedUser.is_admin || false,
        points: updatedUser.points,
        createdAt: new Date(updatedUser.created_at),
        updatedAt: new Date(updatedUser.updated_at),
      };
    } else {
      // Create new user
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          kick_id: userData.kickId,
          username: userData.username,
          display_name: userData.displayName,
          avatar: userData.avatar,
          email: userData.email,
          is_subscriber: userData.isSubscriber || false,
          is_moderator: userData.isModerator || false,
          points: 20, // Starting points
          last_login_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.display_name,
        avatar: newUser.avatar,
        email: newUser.email,
        provider: 'kick',
        providerId: newUser.kick_id,
        isVip: newUser.is_vip,
        isModerator: newUser.is_moderator,
        isSubscriber: newUser.is_subscriber,
        isAdmin: newUser.is_admin || false,
        points: newUser.points,
        createdAt: new Date(newUser.created_at),
        updatedAt: new Date(newUser.updated_at),
      };
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    throw new Error('Failed to create or update user');
  }
}
