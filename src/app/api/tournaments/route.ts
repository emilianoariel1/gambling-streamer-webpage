import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data: tournaments, error } = await supabaseAdmin
      .from('tournaments')
      .select(`
        *,
        participants:tournament_participants(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tournaments:', error);
      return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
    }

    // Transform database format to frontend format
    const transformedTournaments = tournaments.map((tournament: any) => ({
      id: tournament.id,
      title: tournament.title,
      description: tournament.description,
      prize: tournament.prize,
      tournamentType: tournament.tournament_type,
      startsAt: new Date(tournament.starts_at),
      endsAt: new Date(tournament.ends_at),
      isActive: tournament.is_active && new Date(tournament.ends_at) > new Date(),
      participants: tournament.participants?.map((p: any) => ({
        userId: p.user_id,
        username: p.username || 'Unknown',
        score: p.score || 0,
        position: p.position,
        joinedAt: new Date(p.joined_at),
      })) || [],
    }));

    return NextResponse.json({ tournaments: transformedTournaments });
  } catch (error) {
    console.error('❌ Error in tournaments endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
