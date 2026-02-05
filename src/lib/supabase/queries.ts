// Common database queries and utilities
import { supabase } from './client';
import { supabaseAdmin } from './server';
import type { Database } from '@/types/database';

type Tables = Database['public']['Tables'];

// =============================================
// USER QUERIES
// =============================================

export async function getUserByKickId(kickId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('kick_id', kickId)
    .single();

  return { data, error };
}

export async function createUser(userData: Tables['users']['Insert']) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert(userData)
    .select()
    .single();

  return { data, error };
}

export async function updateUserPoints(userId: string, points: number) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ points })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// =============================================
// BONUS HUNT QUERIES
// =============================================

export async function getActiveBonusHunt() {
  const { data, error } = await supabase
    .from('bonus_hunts')
    .select(`
      *,
      bonuses (*),
      bonus_hunt_guesses (
        *,
        users (username, avatar)
      )
    `)
    .in('status', ['open', 'started'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

export async function createBonusHuntGuess(
  bonusHuntId: string,
  userId: string,
  guessedBalance: number
) {
  const { data, error } = await supabase
    .from('bonus_hunt_guesses')
    .insert({
      bonus_hunt_id: bonusHuntId,
      user_id: userId,
      guessed_balance: guessedBalance,
    })
    .select()
    .single();

  return { data, error };
}

// =============================================
// GIVEAWAY QUERIES
// =============================================

export async function getActiveGiveaways() {
  const { data, error } = await supabase
    .from('giveaways')
    .select(`
      *,
      giveaway_entries (count)
    `)
    .eq('is_active', true)
    .gt('ends_at', new Date().toISOString())
    .order('ends_at', { ascending: true });

  return { data, error };
}

export async function enterGiveaway(giveawayId: string, userId: string) {
  const { data, error } = await supabase
    .from('giveaway_entries')
    .insert({
      giveaway_id: giveawayId,
      user_id: userId,
    })
    .select()
    .single();

  return { data, error };
}

export async function getUserGiveawayEntry(giveawayId: string, userId: string) {
  const { data, error } = await supabase
    .from('giveaway_entries')
    .select('*')
    .eq('giveaway_id', giveawayId)
    .eq('user_id', userId)
    .single();

  return { data, error };
}

// =============================================
// TOURNAMENT QUERIES
// =============================================

export async function getActiveTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      tournament_participants (count)
    `)
    .eq('is_active', true)
    .order('starts_at', { ascending: true });

  return { data, error };
}

export async function joinTournament(tournamentId: string, userId: string) {
  const { data, error } = await supabase
    .from('tournament_participants')
    .insert({
      tournament_id: tournamentId,
      user_id: userId,
    })
    .select()
    .single();

  return { data, error };
}

// =============================================
// LEADERBOARD QUERIES
// =============================================

export async function getMonthlyLeaderboard(year: number, month: number) {
  const { data, error } = await supabase
    .from('leaderboard_monthly')
    .select(`
      *,
      users (username, avatar)
    `)
    .eq('year', year)
    .eq('month', month)
    .order('rank', { ascending: true });

  return { data, error };
}

// =============================================
// NOTIFICATION QUERIES
// =============================================

export async function getUserNotifications(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();

  return { data, error };
}
