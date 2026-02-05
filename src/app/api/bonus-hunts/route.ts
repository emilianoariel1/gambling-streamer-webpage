import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data: bonusHunts, error } = await supabaseAdmin
      .from('bonus_hunts')
      .select(`
        *,
        bonuses:bonuses(*),
        guesses:bonus_hunt_guesses(
          *,
          user:users(username, email)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bonus hunts:', error);
      return NextResponse.json({ error: 'Failed to fetch bonus hunts' }, { status: 500 });
    }

    // Transform database format to frontend format
    const transformedBonusHunts = bonusHunts.map((hunt: any) => ({
      id: hunt.id,
      name: hunt.name,
      startBalance: hunt.start_balance,
      currentBalance: hunt.current_balance || hunt.start_balance,
      finalBalance: hunt.final_balance,
      status: hunt.status,
      createdAt: new Date(hunt.created_at),
      startedAt: hunt.started_at ? new Date(hunt.started_at) : undefined,
      completedAt: hunt.completed_at ? new Date(hunt.completed_at) : undefined,
      bonuses: hunt.bonuses?.map((bonus: any) => ({
        id: bonus.id,
        slotName: bonus.slot_name,
        provider: bonus.provider,
        betSize: bonus.bet_size,
        result: bonus.result,
        multiplier: bonus.multiplier,
        isOpened: bonus.is_opened,
        orderIndex: bonus.order_index,
      })) || [],
      guesses: hunt.guesses?.map((guess: any) => ({
        userId: guess.user_id,
        username: guess.user?.username || guess.user?.email || 'Unknown',
        guessedBalance: guess.guessed_balance,
        guessedAt: new Date(guess.guessed_at),
      })) || [],
    }));

    return NextResponse.json({ bonusHunts: transformedBonusHunts });
  } catch (error) {
    console.error('❌ Error in bonus hunts endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
