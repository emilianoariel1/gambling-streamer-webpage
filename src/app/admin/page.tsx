'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Gift, Target, Swords, Users, Loader2 } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import Link from 'next/link';

export default function AdminDashboardPage() {
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

  const adminActions = [
    {
      title: 'Bonus Hunts',
      description: 'Create and manage bonus hunt events',
      icon: Target,
      href: '/admin/bonus-hunts',
      color: 'purple',
    },
    {
      title: 'Giveaways',
      description: 'Create and manage giveaway campaigns',
      icon: Gift,
      href: '/admin/giveaways',
      color: 'pink',
    },
    {
      title: 'Tournaments',
      description: 'Create and manage tournament brackets',
      icon: Swords,
      href: '/admin/tournaments',
      color: 'orange',
    },
    {
      title: 'Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'blue',
    },
  ];

  const colorClasses = {
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-500/50',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-500/50',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 hover:border-orange-500/50',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-500/50',
  };

  const iconColorClasses = {
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-gray-400">
          Manage bonus hunts, giveaways, tournaments, and users
        </p>
      </div>

      {/* Admin Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {adminActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card
              className={`
                bg-gradient-to-br ${colorClasses[action.color as keyof typeof colorClasses]}
                border-2 transition-all duration-200
                hover:scale-105 hover:shadow-xl
                cursor-pointer p-6
              `}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-900/50 rounded-xl">
                  <action.icon className={`w-6 h-6 ${iconColorClasses[action.color as keyof typeof iconColorClasses]}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">0</div>
            <div className="text-sm text-gray-400">Active Hunts</div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">0</div>
            <div className="text-sm text-gray-400">Active Giveaways</div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">0</div>
            <div className="text-sm text-gray-400">Active Tournaments</div>
          </Card>
          <Card className="bg-gray-800/50 border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">1</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
