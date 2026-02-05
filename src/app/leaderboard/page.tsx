'use client';

import { useState } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatNumber, cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/types';

// Helper function to censor username
const censorUsername = (username: string): string => {
  if (username.length <= 4) return username;
  const first = username.slice(0, 2);
  const last = username.slice(-2);
  return `${first}*****${last}`;
};

// Mock data for different months
const leaderboardData: Record<string, LeaderboardEntry[]> = {
  '2026-02': [
    { rank: 1, userId: '1', username: 'johnsmith123', wager: 125000, prize: 45000 },
    { rank: 2, userId: '2', username: 'sarahconnor', wager: 98500, prize: 38000 },
    { rank: 3, userId: '3', username: 'mikejones88', wager: 87200, prize: 32000 },
    { rank: 4, userId: '4', username: 'emilybrown', wager: 76400, prize: 28000 },
    { rank: 5, userId: '5', username: 'davidwilson', wager: 65800, prize: 25000 },
    { rank: 6, userId: '6', username: 'jessicamorgan', wager: 54200, prize: 22000 },
    { rank: 7, userId: '7', username: 'chrisevans', wager: 48900, prize: 20000 },
    { rank: 8, userId: '8', username: 'amandaturner', wager: 42100, prize: 18000 },
    { rank: 9, userId: '9', username: 'robertmiller', wager: 38500, prize: 16000 },
    { rank: 10, userId: '10', username: 'laurathompson', wager: 35200, prize: 15000 },
    { rank: 11, userId: '11', username: 'jamesanderson', wager: 32800, prize: 14000 },
    { rank: 12, userId: '12', username: 'oliviawhite', wager: 29400, prize: 13000 },
    { rank: 13, userId: '13', username: 'williamharris', wager: 26100, prize: 12000 },
    { rank: 14, userId: '14', username: 'sophiamartin', wager: 23700, prize: 11000 },
    { rank: 15, userId: '15', username: 'danielgarcia', wager: 21500, prize: 10000 },
  ],
  '2026-01': [
    { rank: 1, userId: '16', username: 'matthewclark', wager: 110000, prize: 42000 },
    { rank: 2, userId: '17', username: 'emilyrodriguez', wager: 95000, prize: 35000 },
    { rank: 3, userId: '18', username: 'joshuamartinez', wager: 82000, prize: 30000 },
    { rank: 4, userId: '19', username: 'ashleylewis', wager: 71000, prize: 27000 },
    { rank: 5, userId: '20', username: 'andrewwalker', wager: 63000, prize: 24000 },
  ],
  '2025-12': [
    { rank: 1, userId: '21', username: 'jessicahall', wager: 130000, prize: 50000 },
    { rank: 2, userId: '22', username: 'christopherallen', wager: 105000, prize: 40000 },
    { rank: 3, userId: '23', username: 'sarahyoung', wager: 89000, prize: 33000 },
    { rank: 4, userId: '24', username: 'danielking', wager: 75000, prize: 29000 },
    { rank: 5, userId: '25', username: 'meganscott', wager: 68000, prize: 26000 },
  ],
};

// Available months
const availableMonths = [
  { value: '2026-02', label: 'February 2026' },
  { value: '2026-01', label: 'January 2026' },
  { value: '2025-12', label: 'December 2025' },
];

export default function LeaderboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentLeaderboard = leaderboardData[selectedMonth] || [];
  const selectedMonthLabel = availableMonths.find(m => m.value === selectedMonth)?.label || 'February 2026';

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

  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-black';
      case 2:
        return 'bg-gray-400 text-black';
      case 3:
        return 'bg-amber-600 text-black';
      default:
        return 'bg-gray-700 text-gray-300';
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
      {currentLeaderboard.length >= 3 && (
        <div className="flex justify-center items-end gap-4 mb-8">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 relative bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-400">2</span>
            </div>
            <p className="font-semibold text-white text-sm">{censorUsername(currentLeaderboard[1].username)}</p>
            <p className="text-gray-400 text-xs">${formatNumber(currentLeaderboard[1].wager)}</p>
            <div className="w-16 h-24 bg-gradient-to-t from-gray-400/30 to-gray-400/10 rounded-t-lg mt-2 mx-auto" />
          </div>

          {/* 1st Place */}
          <div className="text-center -mb-4">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
            <div className="w-24 h-24 mx-auto mb-2 relative bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-black">1</span>
            </div>
            <p className="font-bold text-white">{censorUsername(currentLeaderboard[0].username)}</p>
            <p className="text-yellow-400 text-sm">${formatNumber(currentLeaderboard[0].wager)}</p>
            <div className="w-20 h-32 bg-gradient-to-t from-yellow-500/30 to-yellow-500/10 rounded-t-lg mt-2 mx-auto" />
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-2 relative bg-amber-700 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-amber-200">3</span>
            </div>
            <p className="font-semibold text-white text-sm">{censorUsername(currentLeaderboard[2].username)}</p>
            <p className="text-gray-400 text-xs">${formatNumber(currentLeaderboard[2].wager)}</p>
            <div className="w-16 h-16 bg-gradient-to-t from-amber-600/30 to-amber-600/10 rounded-t-lg mt-2 mx-auto" />
          </div>
        </div>
      )}

      {/* Month Selector */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer min-w-[200px] justify-between"
          >
            <span className="font-medium">{selectedMonthLabel}</span>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform",
              isDropdownOpen && "rotate-180"
            )} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10">
              {availableMonths.map((month) => (
                <button
                  key={month.value}
                  onClick={() => {
                    setSelectedMonth(month.value);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-6 py-3 text-left transition-colors cursor-pointer",
                    selectedMonth === month.value
                      ? "bg-yellow-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "first:rounded-t-lg last:rounded-b-lg"
                  )}
                >
                  {month.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <Card variant="glass">
        <div className="divide-y divide-gray-800">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-3 text-right">Prize</div>
            <div className="col-span-3 text-right">Wager</div>
          </div>

          {/* Entries */}
          {currentLeaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={cn(
                'grid grid-cols-12 gap-4 px-4 py-4 items-center transition-all',
                getRankStyle(entry.rank)
              )}
            >
              <div className="col-span-1 flex items-center justify-center">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  getRankBadgeStyle(entry.rank)
                )}>
                  {entry.rank}
                </span>
              </div>
              <div className="col-span-5 flex items-center">
                <p className="font-semibold text-white">{censorUsername(entry.username)}</p>
              </div>
              <div className="col-span-3 text-right">
                <p className="text-sm font-light text-gray-400">${formatNumber(entry.prize)}</p>
              </div>
              <div className="col-span-3 text-right">
                <p className="font-bold text-white text-lg">${formatNumber(entry.wager)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {currentLeaderboard.length === 0 && (
        <Card className="text-center py-12 mt-4">
          <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No data available</h3>
          <p className="text-gray-400">No leaderboard data for this month yet.</p>
        </Card>
      )}
    </div>
  );
}
