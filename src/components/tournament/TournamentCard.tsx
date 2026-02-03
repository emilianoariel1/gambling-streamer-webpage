'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Users, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useSocket } from '@/hooks/useSocket';
import { useAppStore } from '@/lib/store';
import { truncateText } from '@/lib/utils';
import type { Tournament } from '@/types';

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const { enterTournament } = useSocket();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user) {
      const hasEntered = tournament.participants.some((p) => p.userId === user.id);
      setIsEntered(hasEntered);
    }
  }, [tournament.participants, user]);

  const handleEnter = async () => {
    if (!user || isEntered || isEntering) return;

    setIsEntering(true);
    try {
      enterTournament?.(tournament.id);
      setIsEntered(true);
    } catch (error) {
      console.error('Failed to enter tournament:', error);
    } finally {
      setIsEntering(false);
    }
  };

  const isEnded = !tournament.isActive || new Date(tournament.endsAt) < new Date();
  const participantsCount = tournament.participants.length;

  return (
    <div className="relative h-full">
      <Link href={`/tournaments/${tournament.id}`} className="block h-full">
        <Card
          variant="gradient"
          hoverable
          className="overflow-hidden relative cursor-pointer h-full flex flex-col"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span className="truncate">{truncateText(tournament.title, 40)}</span>
                </CardTitle>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {truncateText(tournament.description, 80)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge
                  variant={isEnded ? 'danger' : 'success'}
                >
                  {isEnded ? 'Ended' : 'Active'}
                </Badge>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardHeader>

          {/* Stats */}
          <div className="px-4 pb-4 mt-auto">
            <div className="flex items-center justify-center gap-2 bg-gray-800/50 rounded-lg p-3">
              <Users className="w-5 h-5 text-blue-400" />
              <div className="text-center">
                <p className="text-lg font-bold text-white">{participantsCount}</p>
                <p className="text-xs text-gray-400">Participants</p>
              </div>
            </div>
          </div>

          {/* Sign in message */}
          {!user && !isEnded && (
            <div className="px-4 pb-4">
              <p className="text-center text-gray-400 text-sm">Sign in to enter</p>
            </div>
          )}

          {/* Spacer for overlay button when user is logged in */}
          {user && !isEnded && <div className="h-14 flex-shrink-0"></div>}
        </Card>
      </Link>

      {/* Entry Button (Overlay) */}
      {!isEnded && user && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleEnter();
            }}
            disabled={isEntered || isEntering}
            isLoading={isEntering}
            className="w-full cursor-pointer"
            variant={isEntered ? 'secondary' : 'primary'}
          >
            {isEntered ? 'Entered!' : 'Enter Tournament'}
          </Button>
        </div>
      )}
    </div>
  );
}
