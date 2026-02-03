'use client';

import { useState } from 'react';
import { Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, Avatar, Badge } from '@/components/ui';
import { formatNumber, cn } from '@/lib/utils';
import type { LeaderboardEntry, LeaderboardPeriod } from '@/types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

const periods: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'allTime', label: 'All Time' },
];

export function LeaderboardTable({ entries, isLoading }: LeaderboardTableProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-400">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/50';
      case 2:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/50';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/50';
      default:
        return 'bg-gray-800/50 border-gray-700';
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  selectedPeriod === period.value
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-800/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No entries yet</p>
          <p className="text-sm">Be the first on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg border transition-all hover:scale-[1.01]',
                getRankStyle(entry.rank)
              )}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>

              <Avatar name={entry.username} src={entry.avatar} size="md" />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{entry.username}</p>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {entry.wins}W
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    {entry.losses}L
                  </span>
                  <span>{entry.winRate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-white">
                  {formatNumber(entry.points)}
                </p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
