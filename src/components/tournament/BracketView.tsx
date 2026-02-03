'use client';

import { Trophy, User } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export type BracketMatch = {
  id: string;
  player1?: {
    id: string;
    username: string;
    avatar?: string;
  };
  player2?: {
    id: string;
    username: string;
    avatar?: string;
  };
  winner?: string; // player id
  round: 'quarterfinals' | 'semifinals' | 'finals' | 'round16';
};

interface BracketViewProps {
  matches: BracketMatch[];
  tournamentType: 8 | 16;
  className?: string;
}

export function BracketView({ matches, tournamentType, className }: BracketViewProps) {
  const getRoundMatches = (round: BracketMatch['round']) => {
    return matches.filter((m) => m.round === round);
  };

  const renderMatch = (match: BracketMatch, isVerticalLine = false) => {
    const hasWinner = !!match.winner;
    const player1Won = match.winner === match.player1?.id;
    const player2Won = match.winner === match.player2?.id;

    return (
      <div
        key={match.id}
        className={cn(
          'relative bg-gray-800/50 rounded-lg border border-gray-700 p-3 min-w-[200px]',
          hasWinner && 'border-yellow-500/30'
        )}
      >
        {/* Player 1 */}
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-md mb-2 transition-colors',
            player1Won && 'bg-green-500/20 border border-green-500/50',
            match.player1 ? 'hover:bg-gray-700/50' : 'bg-gray-900/50'
          )}
        >
          {match.player1 ? (
            <>
              <Avatar name={match.player1.username} src={match.player1.avatar} size="sm" />
              <span className={cn('text-sm font-medium', player1Won ? 'text-green-400' : 'text-white')}>
                {match.player1.username}
              </span>
              {player1Won && <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <User className="w-5 h-5" />
              <span className="text-sm">TBD</span>
            </div>
          )}
        </div>

        {/* VS Divider */}
        <div className="text-center text-xs text-gray-500 mb-2">VS</div>

        {/* Player 2 */}
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-md transition-colors',
            player2Won && 'bg-green-500/20 border border-green-500/50',
            match.player2 ? 'hover:bg-gray-700/50' : 'bg-gray-900/50'
          )}
        >
          {match.player2 ? (
            <>
              <Avatar name={match.player2.username} src={match.player2.avatar} size="sm" />
              <span className={cn('text-sm font-medium', player2Won ? 'text-green-400' : 'text-white')}>
                {match.player2.username}
              </span>
              {player2Won && <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />}
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <User className="w-5 h-5" />
              <span className="text-sm">TBD</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (tournamentType === 8) {
    // 8 Player Tournament: Quarterfinals -> Semifinals -> Finals
    const quarterfinals = getRoundMatches('quarterfinals');
    const semifinals = getRoundMatches('semifinals');
    const finals = getRoundMatches('finals');

    return (
      <div className={cn('overflow-x-auto pb-4', className)}>
        <div className="flex gap-12 justify-center min-w-max py-4">
          {/* Quarterfinals */}
          <div className="flex flex-col justify-center">
            <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Quarterfinals</h3>
            <div className="flex flex-col gap-8">
              {quarterfinals.map((match) => renderMatch(match))}
            </div>
          </div>

          {/* Semifinals */}
          <div className="flex flex-col justify-center">
            <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Semifinals</h3>
            <div className="flex flex-col gap-[calc(200px+2rem)]">
              {semifinals.map((match) => renderMatch(match))}
            </div>
          </div>

          {/* Finals */}
          <div className="flex flex-col justify-center">
            <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Finals</h3>
            {finals.map((match) => renderMatch(match))}
          </div>
        </div>
      </div>
    );
  }

  // 16 Player Tournament: Round of 16 -> Quarterfinals -> Semifinals -> Finals
  const round16 = getRoundMatches('round16');
  const quarterfinals = getRoundMatches('quarterfinals');
  const semifinals = getRoundMatches('semifinals');
  const finals = getRoundMatches('finals');

  return (
    <div className={cn('overflow-x-auto pb-4', className)}>
      <div className="flex gap-12 justify-center min-w-max py-4">
        {/* Round of 16 */}
        <div className="flex flex-col justify-center">
          <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Round of 16</h3>
          <div className="flex flex-col gap-4">
            {round16.map((match) => renderMatch(match))}
          </div>
        </div>

        {/* Quarterfinals */}
        <div className="flex flex-col justify-center">
          <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Quarterfinals</h3>
          <div className="flex flex-col gap-[calc(200px+1rem)]">
            {quarterfinals.map((match) => renderMatch(match))}
          </div>
        </div>

        {/* Semifinals */}
        <div className="flex flex-col justify-center">
          <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Semifinals</h3>
          <div className="flex flex-col gap-[calc(400px+3rem)]">
            {semifinals.map((match) => renderMatch(match))}
          </div>
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-center">
          <h3 className="text-center text-sm font-semibold text-gray-400 mb-4">Finals</h3>
          {finals.map((match) => renderMatch(match))}
        </div>
      </div>
    </div>
  );
}
