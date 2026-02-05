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
    const { title, description, prize, tournamentType, durationHours } = body;

    // Validate required fields
    if (!title || !description || !prize || !tournamentType || !durationHours) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate tournament type
    if (tournamentType !== 8 && tournamentType !== 16) {
      return NextResponse.json({ error: 'Invalid tournament type' }, { status: 400 });
    }

    // Calculate start and end times
    const startsAt = new Date();
    const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    // Create tournament in database
    const { data: tournament, error } = await supabaseAdmin
      .from('tournaments')
      .insert({
        title,
        description,
        prize,
        tournament_type: tournamentType,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating tournament:', error);
      return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
    }

    console.log('✅ Tournament created:', tournament.id);

    return NextResponse.json({ success: true, tournament }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in create tournament endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
