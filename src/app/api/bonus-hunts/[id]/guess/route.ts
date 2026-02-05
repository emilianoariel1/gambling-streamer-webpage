import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: huntId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { guessedBalance } = body;

    if (!guessedBalance || typeof guessedBalance !== 'number' || guessedBalance <= 0) {
      return NextResponse.json({ error: 'Invalid guess value' }, { status: 400 });
    }

    // Check if the bonus hunt exists and is in "open" status
    const { data: bonusHunt, error: huntError } = await supabaseAdmin
      .from('bonus_hunts')
      .select('id, status')
      .eq('id', huntId)
      .single();

    if (huntError || !bonusHunt) {
      return NextResponse.json({ error: 'Bonus hunt not found' }, { status: 404 });
    }

    if (bonusHunt.status !== 'open') {
      return NextResponse.json({ error: 'Predictions are closed for this hunt' }, { status: 400 });
    }

    // Upsert the guess (insert or update if already exists)
    const { data: guess, error: guessError } = await supabaseAdmin
      .from('bonus_hunt_guesses')
      .upsert(
        {
          bonus_hunt_id: huntId,
          user_id: user.id,
          guessed_balance: guessedBalance,
        },
        {
          onConflict: 'bonus_hunt_id,user_id',
        }
      )
      .select()
      .single();

    if (guessError) {
      console.error('Error saving guess:', guessError);
      return NextResponse.json({ error: 'Failed to save prediction' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      guess: {
        userId: guess.user_id,
        username: user.username || user.email,
        guessedBalance: guess.guessed_balance,
        guessedAt: new Date(guess.guessed_at),
      },
    });
  } catch (error) {
    console.error('❌ Error in guess submission endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
