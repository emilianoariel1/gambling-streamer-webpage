import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: bonusHunt, error } = await supabaseAdmin
      .from('bonus_hunts')
      .select(`
        *,
        bonuses:bonuses(*),
        guesses:bonus_hunt_guesses(
          *,
          user:users(username, email)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching bonus hunt:', error);
      return NextResponse.json({ error: 'Failed to fetch bonus hunt' }, { status: 500 });
    }

    if (!bonusHunt) {
      return NextResponse.json({ error: 'Bonus hunt not found' }, { status: 404 });
    }

    // Transform database format to frontend format
    const transformedBonusHunt = {
      id: bonusHunt.id,
      name: bonusHunt.name,
      startBalance: bonusHunt.start_balance,
      currentBalance: bonusHunt.current_balance || bonusHunt.start_balance,
      finalBalance: bonusHunt.final_balance,
      status: bonusHunt.status,
      createdAt: new Date(bonusHunt.created_at),
      startedAt: bonusHunt.started_at ? new Date(bonusHunt.started_at) : undefined,
      completedAt: bonusHunt.completed_at ? new Date(bonusHunt.completed_at) : undefined,
      bonuses: bonusHunt.bonuses?.map((bonus: any) => ({
        id: bonus.id,
        slotName: bonus.slot_name,
        provider: bonus.provider,
        betSize: bonus.bet_size,
        result: bonus.result,
        multiplier: bonus.multiplier,
        isOpened: bonus.is_opened,
        orderIndex: bonus.order_index,
      })).sort((a: any, b: any) => a.orderIndex - b.orderIndex) || [],
      guesses: bonusHunt.guesses?.map((guess: any) => ({
        userId: guess.user_id,
        username: guess.user?.username || guess.user?.email || 'Unknown',
        guessedBalance: guess.guessed_balance,
        guessedAt: new Date(guess.guessed_at),
      })) || [],
      winners: bonusHunt.winners || [],
    };

    return NextResponse.json({ bonusHunt: transformedBonusHunt });
  } catch (error) {
    console.error('❌ Error in bonus hunt detail endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
