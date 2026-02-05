import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, startBalance, bonuses } = body;

    // Validate required fields
    if (!name || startBalance === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create bonus hunt in database
    const { data: bonusHunt, error: huntError } = await supabaseAdmin
      .from('bonus_hunts')
      .insert({
        name,
        start_balance: startBalance,
        status: 'open', // open = accepting guesses, not started yet
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (huntError) {
      console.error('Error creating bonus hunt:', huntError);
      return NextResponse.json({ error: 'Failed to create bonus hunt' }, { status: 500 });
    }

    // Create bonuses if provided
    if (bonuses && bonuses.length > 0) {
      const bonusesData = bonuses.map((bonus: any, index: number) => ({
        bonus_hunt_id: bonusHunt.id,
        slot_name: bonus.slotName,
        provider: bonus.provider,
        bet_size: bonus.betSize,
        is_opened: false,
        order_index: index,
      }));

      const { error: bonusesError } = await supabaseAdmin
        .from('bonuses')
        .insert(bonusesData);

      if (bonusesError) {
        console.error('Error creating bonuses:', bonusesError);
        // Don't fail the request, just log the error
      }
    }

    console.log('✅ Bonus hunt created:', bonusHunt.id);

    return NextResponse.json({ success: true, bonusHunt }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in create bonus hunt endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
