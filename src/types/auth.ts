export type AuthProvider = 'kick' | 'discord';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  email: string | null;
  provider: AuthProvider;
  providerId: string;
  isVip: boolean;
  isModerator: boolean;
  isSubscriber: boolean;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface KickUser {
  id: number;
  username: string;
  bio: string | null;
  profile_pic: string | null;
  email?: string;
  is_subscribed?: boolean;
  is_following?: boolean;
}

export interface KickTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
  email?: string;
  verified?: boolean;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface OAuthState {
  provider: AuthProvider;
  redirectTo?: string;
  nonce: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider: AuthProvider) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
