'use client';

import { useState } from 'react';
import { Gift } from 'lucide-react';
import { GiveawayCard } from '@/components/giveaway';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Giveaway } from '@/types';

// Mock data
const mockGiveaways: Giveaway[] = [
  {
    id: '1',
    title: 'Weekly VIP Giveaway',
    description: 'Enter for a chance to win exclusive VIP status! Prize: 1 Month VIP + 10,000 Points',
    prize: '1 Month VIP + 10,000 Points',
    entries: [],
    pointsCost: 100,
    numberOfWinners: 1,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
  {
    id: '2',
    title: 'Monthly Cash Prize',
    description: 'Biggest giveaway of the month - real cash prizes! Prize: $500 Cash',
    prize: '$500 Cash',
    entries: Array(234).fill({ userId: '', username: '', enteredAt: new Date() }),
    pointsCost: 500,
    numberOfWinners: 3,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 7),
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Entry Giveaway',
    description: 'No points needed - everyone can enter! Prize: 5,000 Points',
    prize: '5,000 Points',
    entries: Array(89).fill({ userId: '', username: '', enteredAt: new Date() }),
    pointsCost: 0,
    numberOfWinners: 5,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000),
    isActive: true,
  },
];

const pastGiveaways: Giveaway[] = [
  {
    id: '4',
    title: 'Last Week VIP',
    description: 'Previous VIP giveaway winner announced! Prize: 1 Month VIP',
    prize: '1 Month VIP',
    entries: Array(450).fill({ userId: '', username: '', enteredAt: new Date() }),
    pointsCost: 100,
    numberOfWinners: 1,
    startsAt: new Date(Date.now() - 86400000 * 10),
    endsAt: new Date(Date.now() - 86400000 * 3),
    isActive: false,
    winners: [
      { userId: 'winner123', username: 'LuckyWinner42', wonAt: new Date(Date.now() - 86400000 * 3) }
    ],
  },
];

type FilterType = 'active' | 'ended';

export default function GiveawaysPage() {
  const [filter, setFilter] = useState<FilterType>('active');

  const allGiveaways = [...mockGiveaways, ...pastGiveaways];

  const filteredGiveaways = allGiveaways.filter((g) => {
    switch (filter) {
      case 'active':
        return g.isActive;
      case 'ended':
        return !g.isActive;
      default:
        return true;
    }
  });

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'active', label: 'Active', count: allGiveaways.filter((g) => g.isActive).length },
    { value: 'ended', label: 'Ended', count: allGiveaways.filter((g) => !g.isActive).length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8 text-pink-400" />
          Giveaways
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
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {f.label}
            <Badge variant="default" size="sm">{f.count}</Badge>
          </button>
        ))}
      </div>

      {/* Giveaways Grid */}
      {filteredGiveaways.length === 0 ? (
        <Card className="text-center py-12">
          <Gift className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No giveaways found</h3>
          <p className="text-gray-400">Try adjusting your filters or check back later.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGiveaways.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      )}
    </div>
  );
}
