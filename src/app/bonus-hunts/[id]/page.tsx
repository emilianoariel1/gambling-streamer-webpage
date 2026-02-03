'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, DollarSign, Trophy, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { BonusList } from '@/components/bonus-hunt';
import { formatNumber, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { BonusHunt } from '@/types';

// Mock data - in production this would come from an API
const mockBonusHunts: Record<string, BonusHunt> = {
  '1': {
    id: '1',
    name: 'Friday Night Hunt #42',
    startBalance: 5000,
    bonuses: [
      { id: 'b1', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 450, multiplier: 22.5 },
      { id: 'b2', slotName: 'Gates of Olympus', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 120, multiplier: 6 },
      { id: 'b3', slotName: 'Wanted Dead or Wild', provider: 'Hacksaw', betSize: 40, isOpened: true, result: 800, multiplier: 20 },
      { id: 'b4', slotName: 'Mental', provider: 'NoLimit City', betSize: 20, isOpened: true, result: 340, multiplier: 17 },
      { id: 'b5', slotName: 'Fruit Party', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 95, multiplier: 4.75 },
      { id: 'b6', slotName: 'Dog House Megaways', provider: 'Pragmatic Play', betSize: 40, isOpened: true, result: 1200, multiplier: 30 },
    ],
    guesses: [
      { id: 'g1', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 7500, guessedAt: new Date() },
      { id: 'g2', visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 4200, guessedAt: new Date() },
      { id: 'g3', visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 8900, guessedAt: new Date() },
    ],
    status: 'started',
    createdAt: new Date(Date.now() - 3600000),
    startedAt: new Date(Date.now() - 1800000),
  },
  '3': {
    id: '3',
    name: 'Thursday Hunt #41',
    startBalance: 4000,
    finalBalance: 6850,
    bonuses: [
      { id: 'b10', slotName: 'Razor Shark', provider: 'Push Gaming', betSize: 20, isOpened: true, result: 340, multiplier: 17 },
      { id: 'b11', slotName: 'Jammin Jars', provider: 'Push Gaming', betSize: 40, isOpened: true, result: 1200, multiplier: 30 },
      { id: 'b12', slotName: 'Reactoonz', provider: 'Play\'n GO', betSize: 20, isOpened: true, result: 180, multiplier: 9 },
      { id: 'b13', slotName: 'Fire in the Hole', provider: 'NoLimit City', betSize: 20, isOpened: true, result: 2400, multiplier: 120 },
      { id: 'b14', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 560, multiplier: 28 },
      { id: 'b15', slotName: 'Book of Dead', provider: 'Play\'n GO', betSize: 20, isOpened: true, result: 220, multiplier: 11 },
      { id: 'b16', slotName: 'Gates of Olympus', provider: 'Pragmatic Play', betSize: 40, isOpened: true, result: 1950, multiplier: 48.75 },
    ],
    guesses: [
      { id: 'g4', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 6500, guessedAt: new Date() },
      { id: 'g5', visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 7200, guessedAt: new Date() },
      { id: 'g6', visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 5100, guessedAt: new Date() },
      { id: 'g7', visibleUserId: 'u4', userId: 'u4', username: 'SlotMaster', guessedBalance: 8200, guessedAt: new Date() },
      { id: 'g8', visibleUserId: 'u5', userId: 'u5', username: 'BigWinner', guessedBalance: 3500, guessedAt: new Date() },
    ],
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
    startedAt: new Date(Date.now() - 82800000),
    completedAt: new Date(Date.now() - 79200000),
    winners: [
      { rank: 1, visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 6500, difference: 350, prize: 5000 },
      { rank: 2, visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 7200, difference: 350, prize: 2500 },
      { rank: 3, visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 5100, difference: 1750, prize: 1000 },
    ],
  },
};

export default function BonusHuntDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hunt = mockBonusHunts[id];
  const { user } = useAuth();

  if (!hunt) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <Target className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Bonus Hunt Not Found</h3>
          <p className="text-gray-400 mb-4">The bonus hunt you're looking for doesn't exist.</p>
          <Link href="/bonus-hunts">
            <Button variant="outline">Back to Bonus Hunts</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalBonuses = hunt.bonuses.length;
  const totalPayout = hunt.bonuses
    .filter((b) => b.result !== undefined)
    .reduce((sum, b) => sum + (b.result || 0), 0);
  const profitLoss = (hunt.finalBalance || totalPayout) - hunt.startBalance;
  const profitPercent = ((hunt.finalBalance || totalPayout) / hunt.startBalance - 1) * 100;

  // Find current user's prediction
  const userPrediction = user ? hunt.guesses.find(g => g.userId === user.id) : null;

  const statusConfig = {
    open: { label: 'Open for Predictions', badgeVariant: 'info' as const },
    started: { label: 'In Progress', badgeVariant: 'success' as const },
    completed: { label: 'Completed', badgeVariant: 'default' as const },
  };

  const status = statusConfig[hunt.status];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/bonus-hunts" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Bonus Hunts
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={status.badgeVariant}>{status.label}</Badge>
          {hunt.completedAt && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(hunt.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-purple-400" />
          {hunt.name}
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <DollarSign className="w-6 h-6 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-white">${formatNumber(hunt.startBalance)}</p>
            <p className="text-sm text-gray-400">Start Balance</p>
          </div>
        </Card>
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <Target className="w-6 h-6 text-purple-400 mb-2" />
            <p className="text-2xl font-bold text-white">{totalBonuses}</p>
            <p className="text-sm text-gray-400">Total Bonuses</p>
          </div>
        </Card>
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <DollarSign className="w-6 h-6 text-blue-400 mb-2" />
            {userPrediction ? (
              <>
                <p className="text-2xl font-bold text-white">${formatNumber(userPrediction.guessedBalance)}</p>
                <p className="text-sm text-gray-400">Your Prediction</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-500">-</p>
                <p className="text-sm text-gray-400">Your Prediction</p>
              </>
            )}
          </div>
        </Card>
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <Users className="w-6 h-6 text-pink-400 mb-2" />
            <p className="text-2xl font-bold text-white">{hunt.guesses.length}</p>
            <p className="text-sm text-gray-400">Predictions</p>
          </div>
        </Card>
      </div>

      {/* Final Result (for completed hunts) */}
      {hunt.status === 'completed' && hunt.finalBalance !== undefined && (
        <Card variant="gradient" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Final Balance</p>
                <p className={cn(
                  'text-4xl font-bold',
                  profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  ${formatNumber(hunt.finalBalance)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Profit/Loss</p>
                <p className={cn(
                  'text-2xl font-bold',
                  profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {profitLoss >= 0 ? '+' : ''}${formatNumber(profitLoss)}
                </p>
                <p className={cn(
                  'text-sm',
                  profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  ({profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Winners Section */}
      {hunt.status === 'completed' && hunt.winners && hunt.winners.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hunt.winners.map((winner) => (
                <div
                  key={winner.visibleUserId}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg',
                    winner.rank === 1 ? 'bg-yellow-500/20 border border-yellow-500/30' :
                    winner.rank === 2 ? 'bg-gray-400/20 border border-gray-400/30' :
                    'bg-amber-600/20 border border-amber-600/30'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold',
                      winner.rank === 1 ? 'bg-yellow-500 text-black' :
                      winner.rank === 2 ? 'bg-gray-400 text-black' : 'bg-amber-600 text-black'
                    )}>
                      {winner.rank}
                    </span>
                    <div>
                      <p className="font-semibold text-white text-lg">{winner.username}</p>
                      <p className="text-sm text-gray-400">
                        Guessed: ${formatNumber(winner.guessedBalance)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400 text-lg">{formatNumber(winner.prize)} pts</p>
                    <p className="text-sm text-gray-400">
                      Off by ${formatNumber(winner.difference)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bonus List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Bonus List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BonusList bonuses={hunt.bonuses} showAll />
        </CardContent>
      </Card>
    </div>
  );
}

