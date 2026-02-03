'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { TournamentCard } from '@/components/tournament';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Tournament } from '@/types';

// Mock data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'Weekly High Roller Challenge',
    description: 'Compete for the highest multiplier win! Prize: $1000 Cash + VIP Status',
    prize: '$1000 Cash + VIP Status',
    tournamentType: 8,
    participants: Array(8).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(),
    })),
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 5),
    isActive: true,
  },
  {
    id: '2',
    title: 'Slots Tournament',
    description: 'Best win rate over 100 spins wins! Prize: 50,000 Points',
    prize: '50,000 Points',
    tournamentType: 16,
    participants: Array(16).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(),
    })),
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Entry Beginner Tournament',
    description: 'New players only! Prize: 10,000 Points',
    prize: '10,000 Points',
    tournamentType: 8,
    participants: Array(8).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(),
    })),
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 2),
    isActive: true,
  },
];

const pastTournaments: Tournament[] = [
  {
    id: '4',
    title: 'Last Week High Stakes',
    description: 'High stakes tournament completed! Prize: $500 Cash',
    prize: '$500 Cash',
    tournamentType: 8,
    participants: Array(8).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(Date.now() - 86400000 * 8),
    })),
    startsAt: new Date(Date.now() - 86400000 * 10),
    endsAt: new Date(Date.now() - 86400000 * 3),
    isActive: false,
    winnerId: 'winner456',
    winnerUsername: 'ProGambler99',
  },
  {
    id: '5',
    title: 'Monthly Mega Tournament',
    description: 'Biggest tournament of the month! Prize: $2000 Cash',
    prize: '$2000 Cash',
    tournamentType: 16,
    participants: Array(16).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(Date.now() - 86400000 * 35),
    })),
    startsAt: new Date(Date.now() - 86400000 * 40),
    endsAt: new Date(Date.now() - 86400000 * 10),
    isActive: false,
    winnerId: 'winner789',
    winnerUsername: 'SlotKing',
  },
];

type FilterType = 'active' | 'ended';

export default function TournamentsPage() {
  const [filter, setFilter] = useState<FilterType>('active');

  const allTournaments = [...mockTournaments, ...pastTournaments];

  const filteredTournaments = allTournaments.filter((t) => {
    switch (filter) {
      case 'active':
        return t.isActive;
      case 'ended':
        return !t.isActive;
      default:
        return true;
    }
  });

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'active', label: 'Active', count: allTournaments.filter((t) => t.isActive).length },
    { value: 'ended', label: 'Ended', count: allTournaments.filter((t) => !t.isActive).length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Tournaments
        </h1>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer',
              filter === f.value
                ? 'bg-yellow-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {f.label}
            <Badge variant="default" size="sm">{f.count}</Badge>
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <Card className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No tournaments found</h3>
          <p className="text-gray-400">Check back later for upcoming tournaments!</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}
