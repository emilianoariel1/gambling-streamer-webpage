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
    const { title, description, prize, pointsCost, numberOfWinners, durationHours } = body;

    // Validate required fields
    if (!title || !description || !prize || pointsCost === undefined || !numberOfWinners || !durationHours) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate start and end times
    const startsAt = new Date();
    const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    // Create giveaway in database
    const { data: giveaway, error } = await supabaseAdmin
      .from('giveaways')
      .insert({
        title,
        description,
        prize,
        points_cost: pointsCost,
        number_of_winners: numberOfWinners,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating giveaway:', error);
      return NextResponse.json({ error: 'Failed to create giveaway' }, { status: 500 });
    }

    console.log('✅ Giveaway created:', giveaway.id);

    return NextResponse.json({ success: true, giveaway }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in create giveaway endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
