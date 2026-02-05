'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Gift, Loader2, Play, Square, Users, Trophy } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export default function LiveGiveawayPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admin users
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-8 h-8 text-pink-400" />
          <h1 className="text-3xl font-bold text-white">Live Giveaway Control</h1>
        </div>
        <p className="text-gray-400">
          Control and manage the live giveaway in real-time
        </p>
      </div>

      {/* Status Card */}
      <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">No Active Giveaway</h2>
            <p className="text-gray-400">Start a new giveaway to begin</p>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Giveaway
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0</div>
              <div className="text-sm text-gray-400">Participants</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">-</div>
              <div className="text-sm text-gray-400">Winner</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Gift className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">-</div>
              <div className="text-sm text-gray-400">Prize</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Placeholder Content */}
      <Card className="bg-gray-800/30 border-gray-700 p-8">
        <div className="text-center text-gray-500">
          <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Live giveaway controls coming soon...</p>
          <p className="text-sm mt-2">This feature will allow you to manage giveaways in real-time</p>
        </div>
      </Card>
    </div>
  );
}
