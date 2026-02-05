'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Users, Calendar, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button, Avatar } from '@/components/ui';
import { BracketView, BracketPrediction } from '@/components/tournament';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Tournament } from '@/types';

// Mock data - in production this would come from an API
const mockTournaments: Record<string, Tournament> = {
  '1': {
    id: '1',
    title: 'Weekly High Roller Challenge',
    description: 'Compete for the highest multiplier win! Prize: $1000 Cash + VIP Status',
    prize: '$1000 Cash + VIP Status',
    tournamentType: 8,
    participants: Array(8).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i + 1}`,
      enteredAt: new Date(),
    })),
    bracket: [
      // Quarterfinals
      {
        id: 'qf1',
        round: 'quarterfinals',
        player1: { id: 'user0', username: 'Player1' },
        player2: { id: 'user1', username: 'Player2' },
        winner: 'user0',
      },
      {
        id: 'qf2',
        round: 'quarterfinals',
        player1: { id: 'user2', username: 'Player3' },
        player2: { id: 'user3', username: 'Player4' },
        winner: 'user2',
      },
      {
        id: 'qf3',
        round: 'quarterfinals',
        player1: { id: 'user4', username: 'Player5' },
        player2: { id: 'user5', username: 'Player6' },
      },
      {
        id: 'qf4',
        round: 'quarterfinals',
        player1: { id: 'user6', username: 'Player7' },
        player2: { id: 'user7', username: 'Player8' },
      },
      // Semifinals
      {
        id: 'sf1',
        round: 'semifinals',
        player1: { id: 'user0', username: 'Player1' },
        player2: { id: 'user2', username: 'Player3' },
      },
      {
        id: 'sf2',
        round: 'semifinals',
      },
      // Finals
      {
        id: 'f1',
        round: 'finals',
      },
    ],
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 5),
    isActive: true,
  },
  '2': {
    id: '2',
    title: 'Mega Slots Championship',
    description: 'Best win rate over 100 spins wins! Prize: $2000 Cash',
    prize: '$2000 Cash',
    tournamentType: 16,
    participants: Array(16).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i + 1}`,
      enteredAt: new Date(),
    })),
    bracket: [
      // Round of 16
      ...Array(8).fill(null).map((_, i) => ({
        id: `r16_${i}`,
        round: 'round16' as const,
        player1: { id: `user${i * 2}`, username: `Player${i * 2 + 1}` },
        player2: { id: `user${i * 2 + 1}`, username: `Player${i * 2 + 2}` },
      })),
      // Quarterfinals
      ...Array(4).fill(null).map((_, i) => ({
        id: `qf${i}`,
        round: 'quarterfinals' as const,
      })),
      // Semifinals
      ...Array(2).fill(null).map((_, i) => ({
        id: `sf${i}`,
        round: 'semifinals' as const,
      })),
      // Finals
      {
        id: 'f1',
        round: 'finals' as const,
      },
    ],
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 7),
    isActive: true,
  },
};

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tournament = mockTournaments[id];
  const { user } = useAuth();
  const [showPredictions, setShowPredictions] = useState(false);
  const [activeTab, setActiveTab] = useState<'bracket' | 'ranking'>('bracket');

  if (!tournament) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Tournament Not Found</h3>
          <p className="text-gray-400 mb-4">The tournament you're looking for doesn't exist.</p>
          <Link href="/tournaments">
            <Button variant="outline">Back to Tournaments</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isEnded = !tournament.isActive || new Date(tournament.endsAt) < new Date();
  const participantsCount = tournament.participants.length;
  const userHasEntered = user && tournament.participants.some((p) => p.userId === user.id);

  // Mock ranking data - in production this would come from backend
  const mockRanking = [
    { rank: 1, userId: 'user0', username: 'Player1', avatar: undefined, points: 150, submittedAt: new Date(Date.now() - 86400000 * 2) },
    { rank: 2, userId: 'user1', username: 'Player2', avatar: undefined, points: 120, submittedAt: new Date(Date.now() - 86400000 * 1.5) },
    { rank: 3, userId: 'user2', username: 'Player3', avatar: undefined, points: 100, submittedAt: new Date(Date.now() - 86400000 * 1) },
    { rank: 4, userId: 'user3', username: 'Player4', avatar: undefined, points: 85, submittedAt: new Date(Date.now() - 86400000 * 0.5) },
    { rank: 5, userId: 'user4', username: 'Player5', avatar: undefined, points: 70, submittedAt: new Date(Date.now() - 3600000 * 12) },
    { rank: 6, userId: 'user5', username: 'Player6', avatar: undefined, points: 50, submittedAt: new Date(Date.now() - 3600000 * 6) },
    { rank: 7, userId: 'user6', username: 'Player7', avatar: undefined, points: 30, submittedAt: new Date(Date.now() - 3600000 * 3) },
    { rank: 8, userId: 'user7', username: 'Player8', avatar: undefined, points: 10, submittedAt: new Date(Date.now() - 3600000 * 1) },
  ];

  const handlePredictionSubmit = (predictions: Record<string, string>) => {
    console.log('Predictions submitted:', predictions);
    // TODO: Submit to backend
    setShowPredictions(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tournaments
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={isEnded ? 'danger' : 'success'}>
            {isEnded ? 'Ended' : 'Active'}
          </Badge>
          <Badge variant="info">{tournament.tournamentType} Players</Badge>
          {tournament.completedAt && (
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(tournament.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-500" />
          {tournament.title}
        </h1>
        <p className="text-gray-400 mt-2">{tournament.description}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <Trophy className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-white">{tournament.prize}</p>
            <p className="text-sm text-gray-400">Prize Pool</p>
          </div>
        </Card>
        <Card variant="glass" className="text-center">
          <div className="flex flex-col items-center p-4">
            <Users className="w-6 h-6 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">{participantsCount}</p>
            <p className="text-sm text-gray-400">Participants</p>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('bracket')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-md transition-all cursor-pointer',
            activeTab === 'bracket'
              ? 'bg-yellow-600 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Bracket
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-md transition-all cursor-pointer',
            activeTab === 'ranking'
              ? 'bg-yellow-600 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          Ranking
        </button>
      </div>

      {/* Bracket Tab Content */}
      {activeTab === 'bracket' && (
        <>
          {tournament.bracket && tournament.bracket.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Tournament Bracket
                  </span>
                  {!isEnded && userHasEntered && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPredictions(!showPredictions)}
                      className="cursor-pointer"
                    >
                      {showPredictions ? 'View Bracket' : 'Make Predictions'}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BracketView
                  matches={tournament.bracket as any}
                  tournamentType={tournament.tournamentType}
                />
              </CardContent>
            </Card>
          )}

          {/* Prediction Section */}
          {!isEnded && userHasEntered && showPredictions && tournament.bracket && (
            <div className="mb-8">
              <BracketPrediction
                matches={tournament.bracket as any}
                tournamentType={tournament.tournamentType}
                onSubmit={handlePredictionSubmit}
              />
            </div>
          )}
        </>
      )}

      {/* Ranking Tab Content */}
      {activeTab === 'ranking' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Predictions Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockRanking.map((entry) => (
                <div
                  key={entry.userId}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg transition-all',
                    entry.rank === 1 ? 'bg-yellow-500/20 border-2 border-yellow-500/50' :
                    entry.rank === 2 ? 'bg-gray-400/20 border-2 border-gray-400/50' :
                    entry.rank === 3 ? 'bg-amber-600/20 border-2 border-amber-600/50' :
                    'bg-gray-800/50 border border-gray-700'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold',
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-amber-600 text-black' :
                      'bg-gray-700 text-gray-300'
                    )}>
                      {entry.rank}
                    </span>
                    <Avatar name={entry.username} src={entry.avatar} size="md" />
                    <div>
                      <p className="font-semibold text-white text-lg">{entry.username}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {entry.submittedAt.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400 text-xl">{entry.points}</p>
                    <p className="text-sm text-gray-400">Points</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry Message */}
      {!isEnded && !userHasEntered && (
        <Card variant="gradient" className="text-center">
          <CardContent className="p-6">
            <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Join the Tournament</h3>
            <p className="text-gray-400 mb-4">
              Enter this tournament to make predictions and compete for prizes!
            </p>
            <Link href="/tournaments">
              <Button>Go to Tournaments</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
