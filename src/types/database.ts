// Supabase Database Types
// Auto-generated types for your database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          kick_id: string
          username: string
          display_name: string
          avatar: string | null
          email: string | null
          points: number
          level: number
          is_vip: boolean
          is_moderator: boolean
          is_subscriber: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          kick_id: string
          username: string
          display_name: string
          avatar?: string | null
          email?: string | null
          points?: number
          level?: number
          is_vip?: boolean
          is_moderator?: boolean
          is_subscriber?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          kick_id?: string
          username?: string
          display_name?: string
          avatar?: string | null
          email?: string | null
          points?: number
          level?: number
          is_vip?: boolean
          is_moderator?: boolean
          is_subscriber?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      bonus_hunts: {
        Row: {
          id: string
          name: string
          start_balance: number
          final_balance: number | null
          status: 'open' | 'started' | 'completed'
          created_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: {
          id?: string
          name: string
          start_balance: number
          final_balance?: number | null
          status: 'open' | 'started' | 'completed'
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          start_balance?: number
          final_balance?: number | null
          status?: 'open' | 'started' | 'completed'
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
        }
      }
      bonuses: {
        Row: {
          id: string
          bonus_hunt_id: string
          slot_name: string
          provider: string
          bet_size: number
          result: number | null
          multiplier: number | null
          is_opened: boolean
          opened_at: string | null
          order_index: number
        }
        Insert: {
          id?: string
          bonus_hunt_id: string
          slot_name: string
          provider: string
          bet_size: number
          result?: number | null
          multiplier?: number | null
          is_opened?: boolean
          opened_at?: string | null
          order_index: number
        }
        Update: {
          id?: string
          bonus_hunt_id?: string
          slot_name?: string
          provider?: string
          bet_size?: number
          result?: number | null
          multiplier?: number | null
          is_opened?: boolean
          opened_at?: string | null
          order_index?: number
        }
      }
      giveaways: {
        Row: {
          id: string
          title: string
          description: string
          prize: string
          image_url: string | null
          points_cost: number
          number_of_winners: number
          max_entries: number | null
          starts_at: string
          ends_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          prize: string
          image_url?: string | null
          points_cost?: number
          number_of_winners?: number
          max_entries?: number | null
          starts_at: string
          ends_at: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          prize?: string
          image_url?: string | null
          points_cost?: number
          number_of_winners?: number
          max_entries?: number | null
          starts_at?: string
          ends_at?: string
          is_active?: boolean
          created_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          title: string
          description: string
          prize: string
          tournament_type: 8 | 16
          starts_at: string
          ends_at: string
          is_active: boolean
          winner_id: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          prize: string
          tournament_type: 8 | 16
          starts_at: string
          ends_at: string
          is_active?: boolean
          winner_id?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          prize?: string
          tournament_type?: 8 | 16
          starts_at?: string
          ends_at?: string
          is_active?: boolean
          winner_id?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      leaderboard_monthly: {
        Row: {
          id: string
          user_id: string
          casino_username: string
          year: number
          month: number
          total_wager: number
          total_prize: number
          rank: number | null
        }
        Insert: {
          id?: string
          user_id: string
          casino_username: string
          year: number
          month: number
          total_wager?: number
          total_prize?: number
          rank?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          casino_username?: string
          year?: number
          month?: number
          total_wager?: number
          total_prize?: number
          rank?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
