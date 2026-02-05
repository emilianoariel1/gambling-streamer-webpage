'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Gift, Users, Swords } from 'lucide-react';
import { StreamEmbed } from '@/components/layout';
import { BonusHuntCard } from '@/components/bonus-hunt';
import { GiveawayCard } from '@/components/giveaway';
import { TournamentCard } from '@/components/tournament';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { AuthToastHandler } from '@/components/auth/AuthToastHandler';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';
import type { BonusHunt, Giveaway, Tournament } from '@/types';

// Mock data for demonstration
const mockActiveBonusHunt: BonusHunt = {
  id: '1',
  name: 'Friday Night Hunt #42',
  startBalance: 5000,
  bonuses: [
    { id: 'b1', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 450, multiplier: 22.5 },
    { id: 'b2', slotName: 'Gates of Olympus', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 120, multiplier: 6 },
    { id: 'b3', slotName: 'Wanted Dead or Wild', provider: 'Hacksaw', betSize: 40, isOpened: false },
    { id: 'b4', slotName: 'Mental', provider: 'NoLimit City', betSize: 20, isOpened: false },
  ],
  guesses: [
    { id: 'g1', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 7500, guessedAt: new Date() },
    { id: 'g2', visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 4200, guessedAt: new Date() },
  ],
  status: 'started',
  createdAt: new Date(Date.now() - 3600000),
  startedAt: new Date(Date.now() - 1800000),
};

const mockGiveaways: Giveaway[] = [
  {
    id: '1',
    title: 'Weekly VIP Giveaway',
    description: 'Enter for a chance to win exclusive VIP status!',
    prize: '1 Month VIP + 10,000 Points',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=200&fit=crop',
    entries: [],
    maxEntries: 500,
    pointsCost: 100,
    numberOfWinners: 1,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
  {
    id: '2',
    title: 'Monthly Cash Prize',
    description: 'Biggest giveaway of the month - real cash prizes!',
    prize: '$500 Cash',
    entries: Array(234).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date()
    })),
    pointsCost: 500,
    numberOfWinners: 3,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 7),
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Entry Giveaway',
    description: 'No points needed - everyone can enter!',
    prize: '5,000 Points',
    entries: Array(89).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date()
    })),
    pointsCost: 0,
    numberOfWinners: 5,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000),
    isActive: true,
  },
];

const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'Friday Night Showdown',
    description: 'Weekly 8-player tournament with amazing prizes',
    prize: '$1,000 Cash Prize',
    tournamentType: 8,
    participants: Array(8).fill(null).map((_, i) => ({
      userId: `player${i}`,
      username: `Player${i}`,
      seed: i + 1,
      joinedAt: new Date()
    })),
    startsAt: new Date(Date.now() + 3600000 * 2),
    endsAt: new Date(Date.now() + 86400000 * 2),
    isActive: true,
  },
  {
    id: '2',
    title: 'Weekend Championship',
    description: 'Elite 16-player tournament for the best competitors',
    prize: '$2,500 Grand Prize',
    tournamentType: 16,
    participants: Array(12).fill(null).map((_, i) => ({
      userId: `player${i}`,
      username: `Player${i}`,
      seed: i + 1,
      joinedAt: new Date()
    })),
    startsAt: new Date(Date.now() + 86400000),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
];

export default function HomePage() {
  const setStreamInfo = useAppStore((state) => state.setStreamInfo);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate stream being live for demo
    setStreamInfo({
      isLive: true,
      title: 'Late Night Slots Session!',
      game: 'Slots',
      viewerCount: 1234,
    });
  }, [setStreamInfo]);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
          <AuthToastHandler />
          {/* Hero Section with Stream */}
          <section>
            <StreamEmbed channel="your-channel" platform="kick" />
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 gap-4">
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-sm text-gray-400">Watching Now</p>
              </div>
            </Card>
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Gift className="w-8 h-8 text-pink-400 mb-2" />
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-400">Active Giveaways</p>
              </div>
            </Card>
          </section>

          {/* Active Bonus Hunt */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-400" />
                Active Bonus Hunt
                <Badge variant="success" className="animate-pulse ml-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-ping" />
                  LIVE
                </Badge>
              </h2>
              <Link href="/bonus-hunts">
                <Button variant="ghost" size="sm">View All Hunts</Button>
              </Link>
            </div>
            <BonusHuntCard hunt={mockActiveBonusHunt} expanded />
          </section>

          {/* Giveaways */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-pink-400" />
                Giveaways
              </h2>
              <Link href="/giveaways">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockGiveaways.map((giveaway) => (
                <GiveawayCard key={giveaway.id} giveaway={giveaway} />
              ))}
            </div>
          </section>

          {/* Active Tournaments */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Swords className="w-6 h-6 text-orange-400" />
                Active Tournaments
              </h2>
              <Link href="/tournaments">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          </section>
    </div>
  );
}
