import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data: giveaways, error } = await supabaseAdmin
      .from('giveaways')
      .select(`
        *,
        entries:giveaway_entries(count),
        winners:giveaway_winners(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching giveaways:', error);
      return NextResponse.json({ error: 'Failed to fetch giveaways' }, { status: 500 });
    }

    // Transform database format to frontend format
    const transformedGiveaways = giveaways.map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      prize: g.prize,
      imageUrl: g.image_url,
      entries: [], // We'll just show the count, not the actual entries
      maxEntries: g.max_entries,
      pointsCost: g.points_cost,
      numberOfWinners: g.number_of_winners,
      startsAt: new Date(g.starts_at),
      endsAt: new Date(g.ends_at),
      isActive: g.is_active && new Date(g.ends_at) > new Date(),
      winners: g.winners?.map((w: any) => ({
        userId: w.user_id,
        username: w.username || 'Unknown',
        wonAt: new Date(w.won_at),
      })),
    }));

    return NextResponse.json({ giveaways: transformedGiveaways });
  } catch (error) {
    console.error('❌ Error in giveaways endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
