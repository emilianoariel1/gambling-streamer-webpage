'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Gift, Clock, Users, Trophy, Coins } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { useSocket } from '@/hooks/useSocket';
import { formatCountdown, formatNumber } from '@/lib/utils';
import type { Giveaway } from '@/types';

// Mock data - in production this would come from backend
const mockGiveaways: Giveaway[] = [
  {
    id: '1',
    title: 'Weekly VIP Giveaway',
    description: 'Enter for a chance to win exclusive VIP status! This giveaway includes 1 month of VIP access plus 10,000 bonus points to get you started.',
    prize: '1 Month VIP + 10,000 Points',
    entries: [],
    pointsCost: 100,
    numberOfWinners: 1,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 3),
    isActive: true,
  },
  {
    id: '2',
    title: 'Monthly Cash Prize',
    description: 'Biggest giveaway of the month - real cash prizes! First place gets $500, second place gets $300, and third place gets $200.',
    prize: '$500 Cash',
    entries: Array(234).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(Date.now() - Math.random() * 86400000 * 5)
    })),
    pointsCost: 500,
    numberOfWinners: 3,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000 * 7),
    isActive: true,
  },
  {
    id: '3',
    title: 'Free Entry Giveaway',
    description: 'No points needed - everyone can enter! Five lucky winners will receive 5,000 points each.',
    prize: '5,000 Points',
    entries: Array(89).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(Date.now() - Math.random() * 86400000 * 2)
    })),
    pointsCost: 0,
    numberOfWinners: 5,
    startsAt: new Date(),
    endsAt: new Date(Date.now() + 86400000),
    isActive: true,
  },
  {
    id: '4',
    title: 'Last Week VIP',
    description: 'Previous VIP giveaway - winner has been announced! Congratulations to the winner.',
    prize: '1 Month VIP',
    entries: Array(450).fill(null).map((_, i) => ({
      userId: `user${i}`,
      username: `Player${i}`,
      enteredAt: new Date(Date.now() - 86400000 * 10 + Math.random() * 86400000 * 5)
    })),
    pointsCost: 100,
    numberOfWinners: 1,
    startsAt: new Date(Date.now() - 86400000 * 10),
    endsAt: new Date(Date.now() - 86400000 * 3),
    isActive: false,
    winners: [
      { userId: 'winner123', username: 'LuckyWinner42', wonAt: new Date(Date.now() - 86400000 * 3) }
    ],
  },
];

export default function GiveawayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const giveawayId = params.id as string;

  const [timeLeft, setTimeLeft] = useState('');
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const { enterGiveaway } = useSocket();
  const user = useAppStore((state) => state.user);

  const giveaway = mockGiveaways.find((g) => g.id === giveawayId);

  useEffect(() => {
    if (!giveaway) return;

    const updateTimer = () => {
      setTimeLeft(formatCountdown(new Date(giveaway.endsAt)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [giveaway]);

  useEffect(() => {
    if (user && giveaway) {
      const hasEntered = giveaway.entries.some((e) => e.userId === user.id);
      setIsEntered(hasEntered);
    }
  }, [giveaway?.entries, user, giveaway]);

  if (!giveaway) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/giveaways"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Giveaways
        </Link>
        <Card className="text-center py-12">
          <Gift className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Giveaway not found</h3>
          <p className="text-gray-400 mb-4">This giveaway doesn't exist or has been removed.</p>
        </Card>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/giveaways"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Giveaways
      </Link>

      {/* Header */}
      <Card variant="gradient" className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                <Gift className="w-7 h-7 text-pink-500" />
                {giveaway.title}
              </CardTitle>
              <p className="text-gray-400">{giveaway.description}</p>
            </div>
            <Badge
              variant={isEnded ? 'danger' : 'success'}
              className="flex-shrink-0"
            >
              {isEnded ? 'Ended' : 'Active'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="text-center">
            <Clock className="w-6 h-6 mx-auto text-gray-400 mb-2" />
            <p className="text-lg font-bold text-white">{timeLeft}</p>
            <p className="text-sm text-gray-500">Time Left</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <Users className="w-6 h-6 mx-auto text-gray-400 mb-2" />
            <p className="text-lg font-bold text-white">{formatNumber(entriesCount)}</p>
            <p className="text-sm text-gray-500">Entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <Trophy className="w-6 h-6 mx-auto text-gray-400 mb-2" />
            <p className="text-lg font-bold text-white">{giveaway.numberOfWinners}</p>
            <p className="text-sm text-gray-500">Winners</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="text-center">
            <Coins className="w-6 h-6 mx-auto text-gray-400 mb-2" />
            <p className="text-lg font-bold text-white">{entryCostDisplay}</p>
            <p className="text-sm text-gray-500">Entry Cost</p>
          </CardContent>
        </Card>
      </div>

      {/* Prize Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-500" />
            Prize
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-white">{giveaway.prize}</p>
        </CardContent>
      </Card>

      {/* Entry Action */}
      {!isEnded && (
        <Card className="mb-6">
          <CardContent className="text-center py-8">
            {user ? (
              <>
                <Gift className="w-12 h-12 mx-auto text-pink-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isEntered ? "You're entered!" : 'Enter this giveaway'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {isEntered
                    ? `Good luck! Winners will be announced when the giveaway ends.`
                    : `Cost: ${giveaway.pointsCost === 0 ? 'Free Entry' : `${giveaway.pointsCost} Points`}`
                  }
                </p>
                <Button
                  onClick={handleEnter}
                  disabled={isEntered || !canAfford || isEntering}
                  isLoading={isEntering}
                  size="lg"
                  variant={isEntered ? 'secondary' : 'primary'}
                >
                  {isEntered
                    ? 'Already Entered'
                    : !canAfford
                    ? `Need ${giveaway.pointsCost} Points`
                    : giveaway.pointsCost === 0
                    ? 'Enter for Free'
                    : `Enter for ${giveaway.pointsCost} Points`}
                </Button>
              </>
            ) : (
              <>
                <Gift className="w-12 h-12 mx-auto text-pink-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Sign in to enter</h3>
                <p className="text-gray-400">You need to be signed in to participate in giveaways.</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Winners Section */}
      {hasWinners && (
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {giveaway.winners!.map((winner, index) => (
                <div
                  key={winner.userId}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <Avatar name={winner.username} src={winner.avatar} size="md" />
                    <div>
                      <p className="font-semibold text-white">{winner.username}</p>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Winners Yet (for ended giveaways without winners) */}
      {isEnded && !hasWinners && (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Winners pending</h3>
            <p className="text-gray-400">
              The winners for this giveaway will be announced soon!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
