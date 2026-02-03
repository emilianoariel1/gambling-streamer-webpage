'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Gift, Trophy, Users, Zap } from 'lucide-react';
import { StreamEmbed } from '@/components/layout';
import { BonusHuntCard } from '@/components/bonus-hunt';
import { GiveawayCard } from '@/components/giveaway';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { formatNumber } from '@/lib/utils';
import type { BonusHunt, Giveaway, LeaderboardEntry } from '@/types';

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
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', username: 'LuckyAce', points: 125000, wins: 45, losses: 12, winRate: 78.9 },
  { rank: 2, userId: '2', username: 'HighRoller', points: 98500, wins: 38, losses: 15, winRate: 71.7 },
  { rank: 3, userId: '3', username: 'StreamKing', points: 87200, wins: 32, losses: 18, winRate: 64.0 },
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

  const openedBonuses = mockActiveBonusHunt.bonuses.filter(b => b.isOpened).length;
  const totalBonuses = mockActiveBonusHunt.bonuses.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
          {/* Hero Section with Stream */}
          <section>
            <StreamEmbed channel="your-channel" platform="kick" />
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-sm text-gray-400">Watching Now</p>
              </div>
            </Card>
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">{openedBonuses}/{totalBonuses}</p>
                <p className="text-sm text-gray-400">Bonuses Opened</p>
              </div>
            </Card>
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Gift className="w-8 h-8 text-pink-400 mb-2" />
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-400">Active Giveaways</p>
              </div>
            </Card>
            <Card variant="glass" className="text-center">
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-white">125K</p>
                <p className="text-sm text-gray-400">Top Points</p>
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

          {/* Top Players Preview */}
          <section>
            <Card variant="gradient">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Players This Week
                  </CardTitle>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm">Full Leaderboard</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLeaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            entry.rank === 1
                              ? 'bg-yellow-500 text-black'
                              : entry.rank === 2
                              ? 'bg-gray-400 text-black'
                              : 'bg-amber-600 text-black'
                          }`}
                        >
                          {entry.rank}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{entry.username}</p>
                          <p className="text-sm text-gray-400">
                            {entry.wins}W / {entry.losses}L
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatNumber(entry.points)}</p>
                        <p className="text-sm text-green-400">{entry.winRate}% WR</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
    </div>
  );
}
