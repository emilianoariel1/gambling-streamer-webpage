'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Users, DollarSign, Trophy, ChevronDown, ChevronUp, Lock, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, ProgressBar } from '@/components/ui';
import { BonusList } from './BonusList';
import { GuessInput } from './GuessInput';
import { formatNumber, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { BonusHunt } from '@/types';

interface BonusHuntCardProps {
  hunt: BonusHunt;
  expanded?: boolean;
  onGuessSubmit?: (huntId: string, guess: number) => void;
}

export function BonusHuntCard({ hunt, expanded = false, onGuessSubmit }: BonusHuntCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { user, isAuthenticated } = useAuth();

  const openedBonuses = hunt.bonuses.filter((b) => b.isOpened).length;
  const totalBonuses = hunt.bonuses.length;
  const progress = totalBonuses > 0 ? (openedBonuses / totalBonuses) * 100 : 0;

  const currentTotal = hunt.bonuses
    .filter((b) => b.isOpened && b.result !== undefined)
    .reduce((sum, b) => sum + (b.result || 0), 0);

  const userHasGuessed = user && hunt.guesses.some((g) => g.userId === user.id);

  // Status configuration for the three stages
  const statusConfig = {
    open: { label: 'Open for Predictions', badgeVariant: 'info' as const },
    started: { label: 'In Progress', badgeVariant: 'success' as const },
    completed: { label: 'Completed', badgeVariant: 'default' as const },
  };

  const status = statusConfig[hunt.status];

  // Completed hunt card - simplified view
  if (hunt.status === 'completed') {
    return (
      <Link href={`/bonus-hunts/${hunt.id}`} className="block">
        <Card variant="gradient" className="overflow-hidden hover:border-purple-500/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={status.badgeVariant}>{status.label}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-400" />
                  {hunt.name}
                </h3>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-bold text-white">${formatNumber(hunt.startBalance)}</p>
                    <p className="text-xs text-gray-400">Start</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-bold text-white">{totalBonuses}</p>
                    <p className="text-xs text-gray-400">Bonuses</p>
                  </div>
                  <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                    <p className={cn(
                      'text-sm font-bold',
                      hunt.finalBalance && hunt.finalBalance >= hunt.startBalance ? 'text-green-400' : 'text-red-400'
                    )}>
                      ${formatNumber(hunt.finalBalance || 0)}
                    </p>
                    <p className="text-xs text-gray-400">Final</p>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  // Active/Open hunt card - full view
  return (
    <Card variant="gradient" className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={status.badgeVariant}
                className={hunt.status === 'started' ? 'animate-pulse' : ''}
              >
                {hunt.status === 'started' && (
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-ping" />
                )}
                {status.label}
              </Badge>
              {hunt.status === 'started' && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Predictions locked
                </span>
              )}
            </div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              {hunt.name}
            </CardTitle>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">${formatNumber(hunt.startBalance)}</p>
            <p className="text-xs text-gray-400">Start Balance</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Target className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">
              {openedBonuses}/{totalBonuses}
            </p>
            <p className="text-xs text-gray-400">Bonuses</p>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{hunt.guesses.length}</p>
            <p className="text-xs text-gray-400">Guesses</p>
          </div>
        </div>

        {/* Progress Bar (for started hunts) */}
        {hunt.status === 'started' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{openedBonuses} / {totalBonuses} opened</span>
            </div>
            <ProgressBar value={progress} />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Current Total:</span>
              <span className={cn(
                'font-bold',
                currentTotal >= hunt.startBalance ? 'text-green-400' : 'text-red-400'
              )}>
                ${formatNumber(currentTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Guess Input (only for 'open' status - predictions allowed) */}
        {hunt.status === 'open' && !userHasGuessed && (
          <GuessInput
            huntId={hunt.id}
            startBalance={hunt.startBalance}
            onSubmit={onGuessSubmit}
            disabled={!isAuthenticated}
          />
        )}

        {/* Predictions Locked Message (for started hunts without user guess) */}
        {hunt.status === 'started' && !userHasGuessed && (
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Predictions are closed for this hunt
            </p>
          </div>
        )}

        {/* User's Guess */}
        {userHasGuessed && user && (
          <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <p className="text-sm text-purple-400">Your Guess</p>
            <p className="text-xl font-bold text-white">
              ${formatNumber(hunt.guesses.find((g) => g.userId === user.id)?.guessedBalance || 0)}
            </p>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <BonusList bonuses={hunt.bonuses} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
