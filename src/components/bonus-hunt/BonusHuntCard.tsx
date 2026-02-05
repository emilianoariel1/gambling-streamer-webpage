'use client';

import Link from 'next/link';
import { Target, ChevronRight } from 'lucide-react';
import { Card, CardContent, Badge } from '@/components/ui';
import { formatNumber, cn } from '@/lib/utils';
import type { BonusHunt } from '@/types';

interface BonusHuntCardProps {
  hunt: BonusHunt;
}

export function BonusHuntCard({ hunt }: BonusHuntCardProps) {
  const totalBonuses = hunt.bonuses.length;
  const openedBonuses = hunt.bonuses.filter((b) => b.isOpened).length;

  // Status configuration for the three stages
  const statusConfig = {
    open: { label: 'Open for Predictions', badgeVariant: 'info' as const },
    started: { label: 'In Progress', badgeVariant: 'success' as const },
    completed: { label: 'Completed', badgeVariant: 'default' as const },
  };

  const status = statusConfig[hunt.status];

  // Calculate current or final balance
  const displayBalance = hunt.status === 'completed'
    ? hunt.finalBalance || 0
    : hunt.currentBalance || hunt.startBalance;

  return (
    <Link href={`/bonus-hunts/${hunt.id}`} className="block">
      <Card variant="gradient" className="overflow-hidden hover:border-purple-500/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={status.badgeVariant}
                  className={hunt.status === 'started' ? 'animate-pulse' : ''}
                >
                  {hunt.status === 'started' && (
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-ping" />
                  )}
                  {status.label}
                </Badge>
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
                  <p className="text-sm font-bold text-white">
                    {hunt.status === 'started' ? `${openedBonuses}/` : ''}{totalBonuses}
                  </p>
                  <p className="text-xs text-gray-400">Bonuses</p>
                </div>
                <div className="text-center p-2 bg-gray-800/50 rounded-lg">
                  <p className={cn(
                    'text-sm font-bold',
                    displayBalance >= hunt.startBalance ? 'text-green-400' : 'text-red-400'
                  )}>
                    ${formatNumber(displayBalance)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {hunt.status === 'completed' ? 'Final' : 'Current'}
                  </p>
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
