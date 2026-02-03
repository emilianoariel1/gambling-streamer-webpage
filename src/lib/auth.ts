import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User, AuthSession, OAuthState } from '@/types/auth';

// Environment variables (to be set in .env.local)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const KICK_CLIENT_ID = process.env.KICK_CLIENT_ID || '';
const KICK_CLIENT_SECRET = process.env.KICK_CLIENT_SECRET || '';
const KICK_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/kick/callback';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/discord/callback';

// Cookie settings
const COOKIE_NAME = 'auth_session';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

// Generate OAuth URLs
export function getKickAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: KICK_CLIENT_ID,
    redirect_uri: KICK_REDIRECT_URI,
    response_type: 'code',
    scope: 'user:read',
    state,
  });

  // Note: Kick's OAuth URL may change - update this when you get official docs
  return `https://kick.com/oauth/authorize?${params.toString()}`;
}

export function getDiscordAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
    state,
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

// Exchange code for tokens
export async function exchangeKickCode(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const response = await fetch('https://kick.com/oauth/token', {
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
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Kick code for token');
  }

  return response.json();
}

export async function exchangeDiscordCode(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange Discord code for token');
  }

  return response.json();
}

// Fetch user data from providers
export async function fetchKickUser(accessToken: string): Promise<{
  id: string;
  username: string;
  bio: string | null;
  profile_pic: string | null;
  email?: string;
}> {
  // Note: Update this endpoint when you have official Kick API docs
  const response = await fetch('https://kick.com/api/v1/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Kick user');
  }

  return response.json();
}

export async function fetchDiscordUser(accessToken: string): Promise<{
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
}> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user');
  }

  return response.json();
}

// JWT Token handling
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

// Cookie handling
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

// State management for OAuth
export function generateOAuthState(provider: 'kick' | 'discord', redirectTo?: string): string {
  const state: OAuthState = {
    provider,
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

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  return verifySessionToken(token);
}

// Helper to get Discord avatar URL
export function getDiscordAvatarUrl(userId: string, avatarHash: string | null): string | null {
  if (!avatarHash) return null;
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
}

// Create or update user in database (placeholder - implement with your database)
export async function upsertUser(userData: {
  provider: 'kick' | 'discord';
  providerId: string;
  username: string;
  displayName: string;
  avatar: string | null;
  email: string | null;
}): Promise<User> {
  // TODO: Implement with Supabase or your preferred database
  // For now, return a mock user
  const user: User = {
    id: `${userData.provider}_${userData.providerId}`,
    username: userData.username,
    displayName: userData.displayName,
    avatar: userData.avatar,
    email: userData.email,
    provider: userData.provider,
    providerId: userData.providerId,
    isVip: false,
    isModerator: false,
    isSubscriber: false,
    points: 1000, // Starting points
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return user;
}
