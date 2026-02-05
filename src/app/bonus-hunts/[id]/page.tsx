'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, DollarSign, Trophy, Users, Calendar, Lock, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { BonusList, GuessInput, AddBonusModal } from '@/components/bonus-hunt';
import { formatNumber, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { BonusHunt } from '@/types';

export default function BonusHuntDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hunt, setHunt] = useState<BonusHunt | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchHuntDetail();
  }, [id]);

  const fetchHuntDetail = async () => {
    try {
      const response = await fetch(`/api/bonus-hunts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bonus hunt');
      }
      const data = await response.json();
      setHunt(data.bonusHunt);
    } catch (error) {
      console.error('❌ Error fetching bonus hunt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuessSubmit = async (huntId: string, guess: number) => {
    try {
      const response = await fetch(`/api/bonus-hunts/${huntId}/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guessedBalance: guess }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit prediction');
      }

      const result = await response.json();
      console.log('✅ Prediction submitted:', result);

      // Refetch the hunt to update the guesses list
      await fetchHuntDetail();
    } catch (error) {
      console.error('❌ Error submitting prediction:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit prediction. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading bonus hunt...</div>
      </div>
    );
  }

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
  const openedBonuses = hunt.bonuses.filter((b) => b.isOpened).length;
  const totalPayout = hunt.bonuses
    .filter((b) => b.result !== undefined)
    .reduce((sum, b) => sum + (b.result || 0), 0);

  const finalBalance = hunt.finalBalance || totalPayout;
  const profitLoss = finalBalance - hunt.startBalance;
  const profitPercent = (finalBalance / hunt.startBalance - 1) * 100;

  // Find current user's prediction
  const userPrediction = user ? hunt.guesses.find(g => g.userId === user.id) : null;
  const userHasGuessed = !!userPrediction;

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
          <Badge
            variant={status.badgeVariant}
            className={hunt.status === 'started' ? 'animate-pulse' : ''}
          >
            {hunt.status === 'started' && (
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-ping" />
            )}
            {status.label}
          </Badge>
          {hunt.completedAt && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(hunt.completedAt).toLocaleDateString()}
            </span>
          )}
          {hunt.status === 'started' && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Predictions locked
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
            <p className="text-2xl font-bold text-white">
              {hunt.status === 'started' ? `${openedBonuses}/` : ''}{totalBonuses}
            </p>
            <p className="text-sm text-gray-400">
              {hunt.status === 'started' ? 'Progress' : 'Total Bonuses'}
            </p>
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
      {hunt.status === 'completed' && (
        <Card variant="gradient" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Final Balance</p>
                <p className={cn(
                  'text-4xl font-bold',
                  profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  ${formatNumber(finalBalance)}
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

      {/* Prediction Section (for open hunts) */}
      {hunt.status === 'open' && (
        <Card variant="gradient" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              {userHasGuessed ? 'Edit Your Prediction' : 'Make Your Prediction'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GuessInput
              huntId={hunt.id}
              startBalance={hunt.startBalance}
              initialValue={userPrediction?.guessedBalance}
              onSubmit={handleGuessSubmit}
              disabled={!isAuthenticated}
            />
          </CardContent>
        </Card>
      )}

      {/* Current Balance (for started hunts) */}
      {hunt.status === 'started' && (
        <Card variant="gradient" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">Current Balance</p>
              <p className={cn(
                'text-3xl font-bold',
                totalPayout >= hunt.startBalance ? 'text-green-400' : 'text-red-400'
              )}>
                ${formatNumber(totalPayout)}
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{openedBonuses} / {totalBonuses} opened</span>
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
              {hunt.winners.map((winner: any) => (
                <div
                  key={winner.userId || winner.visibleUserId}
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
            Bonus List {totalBonuses > 0 && `(${totalBonuses})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalBonuses > 0 ? (
            <BonusList bonuses={hunt.bonuses} showAll />
          ) : (
            <p className="text-gray-400 text-center py-8">No bonuses added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
