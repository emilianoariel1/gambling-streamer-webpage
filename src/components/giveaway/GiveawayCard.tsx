'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, Clock, Users, Coins, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useSocket } from '@/hooks/useSocket';
import { useAppStore } from '@/lib/store';
import { formatCountdown, truncateText } from '@/lib/utils';
import type { Giveaway } from '@/types';

interface GiveawayCardProps {
  giveaway: Giveaway;
}

export function GiveawayCard({ giveaway }: GiveawayCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const { enterGiveaway } = useSocket();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(formatCountdown(new Date(giveaway.endsAt)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [giveaway.endsAt]);

  useEffect(() => {
    if (user) {
      const hasEntered = giveaway.entries.some((e) => e.userId === user.id);
      setIsEntered(hasEntered);
    }
  }, [giveaway.entries, user]);

  const handleEnter = async () => {
    if (!user || isEntered || isEntering) return;

    setIsEntering(true);
    try {
      enterGiveaway(giveaway.id);
      setIsEntered(true);
    } catch (error) {
      console.error('Failed to enter giveaway:', error);
    } finally {
      setIsEntering(false);
    }
  };

  const isEnded = !giveaway.isActive || new Date(giveaway.endsAt) < new Date();
  const hasWinners = !!giveaway.winners && giveaway.winners.length > 0;
  const entriesCount = giveaway.entries.length;
  const canAfford = user ? user.points >= giveaway.pointsCost : false;
  const entryCostDisplay = giveaway.pointsCost === 0 ? 'Free' : giveaway.pointsCost.toString();

  return (
    <Link href={`/giveaways/${giveaway.id}`} className="block h-full">
      <Card
        variant="gradient"
        hoverable
        className="overflow-hidden relative h-full flex flex-col cursor-pointer"
      >
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-500 flex-shrink-0" />
                <span className="truncate">{truncateText(giveaway.title, 40)}</span>
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {truncateText(giveaway.description, 80)}
              </p>
            </div>
            <Badge
              variant={isEnded ? 'danger' : 'success'}
              className="flex-shrink-0"
            >
              {isEnded ? 'Ended' : 'Active'}
            </Badge>
          </div>
        </CardHeader>

      <div className="flex flex-col flex-grow">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4 flex-shrink-0">
          <div className="text-center">
            <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm font-medium text-white">{timeLeft}</p>
            <p className="text-xs text-gray-500">Time Left</p>
          </div>
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm font-medium text-white">{entriesCount}</p>
            <p className="text-xs text-gray-500">Entries</p>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm font-medium text-white">{giveaway.numberOfWinners}</p>
            <p className="text-xs text-gray-500">Winners</p>
          </div>
          <div className="text-center">
            <Coins className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm font-medium text-white">{entryCostDisplay}</p>
            <p className="text-xs text-gray-500">Entry Cost</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {!isEnded && user && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleEnter();
              }}
              disabled={isEntered || !canAfford || isEntering}
              isLoading={isEntering}
              className="w-full"
              variant={isEntered ? 'secondary' : 'primary'}
            >
              {isEntered
                ? 'Entered!'
                : !canAfford
                ? `Need ${giveaway.pointsCost} Points`
                : giveaway.pointsCost === 0
                ? 'Enter for Free'
                : `Enter for ${giveaway.pointsCost} Points`}
            </Button>
          )}

          {!user && !isEnded && (
            <p className="text-center text-gray-400 text-sm">Sign in to enter</p>
          )}
        </div>
      </div>
      </Card>
    </Link>
  );
}
