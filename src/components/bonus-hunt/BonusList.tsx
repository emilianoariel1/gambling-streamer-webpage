'use client';

import { Gamepad2, Lock, Check, HelpCircle } from 'lucide-react';
import { formatNumber, cn } from '@/lib/utils';
import type { Bonus } from '@/types';

interface BonusListProps {
  bonuses: Bonus[];
  compact?: boolean;
  showAll?: boolean;
}

export function BonusList({ bonuses, compact = false, showAll = false }: BonusListProps) {
  if (bonuses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No bonuses added yet</p>
      </div>
    );
  }

  const totalBet = bonuses.reduce((sum, b) => sum + b.betSize, 0);
  const totalResult = bonuses
    .filter((b) => b.isOpened && b.result !== undefined)
    .reduce((sum, b) => sum + (b.result || 0), 0);
  const openedCount = bonuses.filter((b) => b.isOpened).length;

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-400">
          {openedCount} / {bonuses.length} bonuses opened
        </span>
      </div>

      {/* Bonus List */}
      <div className={cn(
        'space-y-2',
        !showAll && !compact ? 'max-h-80 overflow-y-auto' : '',
        compact ? 'max-h-60 overflow-y-auto' : ''
      )}>
        {bonuses.map((bonus, index) => (
          <div
            key={bonus.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all',
              bonus.isOpened
                ? bonus.result !== undefined && bonus.result >= bonus.betSize
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
                : 'bg-gray-800/50 border border-gray-700'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-300">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-white">{bonus.slotName}</p>
                <p className="text-xs text-gray-400">{bonus.provider}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Bet: ${formatNumber(bonus.betSize)}</p>
                {bonus.isOpened && bonus.result !== undefined ? (
                  <p className={cn(
                    'font-bold',
                    bonus.result >= bonus.betSize ? 'text-green-400' : 'text-red-400'
                  )}>
                    ${formatNumber(bonus.result)}
                    <span className="text-xs ml-1">
                      ({bonus.multiplier?.toFixed(2) || (bonus.result / bonus.betSize).toFixed(2)}x)
                    </span>
                  </p>
                ) : (
                  <p className="text-gray-500">-</p>
                )}
              </div>

              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center',
                bonus.isOpened
                  ? bonus.result !== undefined && bonus.result >= bonus.betSize
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                  : 'bg-gray-700 text-gray-400'
              )}>
                {bonus.isOpened ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
