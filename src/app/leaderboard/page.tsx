'use client';

import { useState } from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown, Crown, Search } from 'lucide-react';
import { Card, Avatar, Badge, Input } from '@/components/ui';
import { formatNumber, cn } from '@/lib/utils';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/types';

// Mock data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: '1', username: 'LuckyAce', points: 125000, wins: 45, losses: 12, winRate: 78.9 },
  { rank: 2, userId: '2', username: 'HighRoller', points: 98500, wins: 38, losses: 15, winRate: 71.7 },
  { rank: 3, userId: '3', username: 'StreamKing', points: 87200, wins: 32, losses: 18, winRate: 64.0 },
  { rank: 4, userId: '4', username: 'BetMaster', points: 76400, wins: 28, losses: 22, winRate: 56.0 },
  { rank: 5, userId: '5', username: 'CryptoKing', points: 65800, wins: 25, losses: 20, winRate: 55.6 },
  { rank: 6, userId: '6', username: 'DiamondHands', points: 54200, wins: 22, losses: 18, winRate: 55.0 },
  { rank: 7, userId: '7', username: 'MoonShot', points: 48900, wins: 20, losses: 15, winRate: 57.1 },
  { rank: 8, userId: '8', username: 'RiskTaker', points: 42100, wins: 18, losses: 22, winRate: 45.0 },
  { rank: 9, userId: '9', username: 'SlotMachine', points: 38500, wins: 16, losses: 14, winRate: 53.3 },
  { rank: 10, userId: '10', username: 'BigWinner', points: 35200, wins: 15, losses: 10, winRate: 60.0 },
  { rank: 11, userId: '11', username: 'CasinoRoyale', points: 32800, wins: 14, losses: 16, winRate: 46.7 },
  { rank: 12, userId: '12', username: 'JackpotJoe', points: 29400, wins: 13, losses: 12, winRate: 52.0 },
  { rank: 13, userId: '13', username: 'GoldRush', points: 26100, wins: 12, losses: 18, winRate: 40.0 },
  { rank: 14, userId: '14', username: 'VIPPlayer', points: 23700, wins: 11, losses: 9, winRate: 55.0 },
  { rank: 15, userId: '15', username: 'NewChallenger', points: 21500, wins: 10, losses: 5, winRate: 66.7 },
];

const periods: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'allTime', label: 'All Time' },
];

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = mockLeaderboard.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-2 border-gray-400/50';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-2 border-amber-600/50';
      default:
        return 'bg-gray-800/50 border border-gray-700 hover:border-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Leaderboard
        </h1>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-4 mb-8">
        {/* 2nd Place */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-2 relative">
            <Avatar name={mockLeaderboard[1].username} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-black font-bold border-2 border-gray-900">
              2
            </div>
          </div>
          <p className="font-semibold text-white text-sm">{mockLeaderboard[1].username}</p>
          <p className="text-gray-400 text-xs">{formatNumber(mockLeaderboard[1].points)} pts</p>
          <div className="w-16 h-24 bg-gradient-to-t from-gray-400/30 to-gray-400/10 rounded-t-lg mt-2 mx-auto" />
        </div>

        {/* 1st Place */}
        <div className="text-center -mb-4">
          <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
          <div className="w-24 h-24 mx-auto mb-2 relative">
            <Avatar name={mockLeaderboard[0].username} size="xl" className="w-24 h-24 text-xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold border-2 border-gray-900">
              1
            </div>
          </div>
          <p className="font-bold text-white">{mockLeaderboard[0].username}</p>
          <p className="text-yellow-400 text-sm">{formatNumber(mockLeaderboard[0].points)} pts</p>
          <div className="w-20 h-32 bg-gradient-to-t from-yellow-500/30 to-yellow-500/10 rounded-t-lg mt-2 mx-auto" />
        </div>

        {/* 3rd Place */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-2 relative">
            <Avatar name={mockLeaderboard[2].username} size="xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-black font-bold border-2 border-gray-900">
              3
            </div>
          </div>
          <p className="font-semibold text-white text-sm">{mockLeaderboard[2].username}</p>
          <p className="text-gray-400 text-xs">{formatNumber(mockLeaderboard[2].points)} pts</p>
          <div className="w-16 h-16 bg-gradient-to-t from-amber-600/30 to-amber-600/10 rounded-t-lg mt-2 mx-auto" />
        </div>
      </div>

      {/* Period Selector & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-all cursor-pointer',
                selectedPeriod === period.value
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card variant="glass">
        <div className="divide-y divide-gray-800">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-2 text-center">W/L</div>
            <div className="col-span-2 text-center">Win Rate</div>
            <div className="col-span-3 text-right">Points</div>
          </div>

          {/* Entries */}
          {filteredLeaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                'grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all',
                getRankStyle(entry.rank)
              )}
            >
              <div className="col-span-1 flex items-center">
                {getRankIcon(entry.rank)}
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <Avatar name={entry.username} src={entry.avatar} size="md" />
                <div>
                  <p className="font-semibold text-white">{entry.username}</p>
                  {entry.rank <= 3 && (
                    <Badge variant={entry.rank === 1 ? 'vip' : 'default'} size="sm">
                      {entry.rank === 1 ? 'Champion' : entry.rank === 2 ? 'Runner-up' : 'Bronze'}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center gap-2">
                  <span className="text-green-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" />
                    {entry.wins}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-red-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" />
                    {entry.losses}
                  </span>
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className={cn(
                  'font-medium',
                  entry.winRate >= 60 ? 'text-green-400' :
                  entry.winRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {entry.winRate.toFixed(1)}%
                </span>
              </div>
              <div className="col-span-3 text-right">
                <p className="font-bold text-white text-lg">{formatNumber(entry.points)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {filteredLeaderboard.length === 0 && (
        <Card className="text-center py-12 mt-4">
          <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No players found</h3>
          <p className="text-gray-400">Try a different search term.</p>
        </Card>
      )}
    </div>
  );
}
