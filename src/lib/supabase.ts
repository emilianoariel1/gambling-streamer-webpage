import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          points: number;
          level: number;
          is_vip: boolean;
          is_moderator: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          avatar_url?: string | null;
          points?: number;
          level?: number;
          is_vip?: boolean;
          is_moderator?: boolean;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          points?: number;
          level?: number;
          is_vip?: boolean;
          is_moderator?: boolean;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      polls: {
        Row: {
          id: string;
          question: string;
          options: string;
          ends_at: string;
          is_active: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          question: string;
          options: string;
          ends_at: string;
          is_active?: boolean;
          created_by: string;
        };
        Update: {
          question?: string;
          options?: string;
          ends_at?: string;
          is_active?: boolean;
        };
      };
      poll_votes: {
        Row: {
          id: string;
          poll_id: string;
          user_id: string;
          option_id: string;
          created_at: string;
        };
        Insert: {
          poll_id: string;
          user_id: string;
          option_id: string;
        };
        Update: never;
      };
      giveaways: {
        Row: {
          id: string;
          title: string;
          description: string;
          prize: string;
          image_url: string | null;
          points_cost: number;
          max_entries: number | null;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          winner_id: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          description: string;
          prize: string;
          image_url?: string | null;
          points_cost: number;
          max_entries?: number | null;
          starts_at: string;
          ends_at: string;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          prize?: string;
          image_url?: string | null;
          points_cost?: number;
          is_active?: boolean;
          winner_id?: string | null;
        };
      };
      giveaway_entries: {
        Row: {
          id: string;
          giveaway_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          giveaway_id: string;
          user_id: string;
        };
        Update: never;
      };
      predictions: {
        Row: {
          id: string;
          title: string;
          description: string;
          options: string;
          locks_at: string;
          resolved_at: string | null;
          is_locked: boolean;
          is_resolved: boolean;
          winning_option_id: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          description: string;
          options: string;
          locks_at: string;
        };
        Update: {
          is_locked?: boolean;
          is_resolved?: boolean;
          resolved_at?: string;
          winning_option_id?: string;
        };
      };
      prediction_bets: {
        Row: {
          id: string;
          prediction_id: string;
          user_id: string;
          option_id: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          prediction_id: string;
          user_id: string;
          option_id: string;
          amount: number;
        };
        Update: never;
      };
      leaderboard: {
        Row: {
          user_id: string;
          points: number;
          wins: number;
          losses: number;
          period: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          points?: number;
          wins?: number;
          losses?: number;
          period: string;
        };
        Update: {
          points?: number;
          wins?: number;
          losses?: number;
        };
      };
    };
  };
}
