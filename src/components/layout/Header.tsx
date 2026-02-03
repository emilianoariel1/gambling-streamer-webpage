'use client';

import Link from 'next/link';
import { Bell, Coins, LogIn } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { Button, Badge } from '@/components/ui';
import { UserMenu } from '@/components/auth';
import { formatNumber } from '@/lib/utils';

export function Header() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const notifications = useAppStore((state) => state.notifications);
  const streamInfo = useAppStore((state) => state.streamInfo);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4 ml-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                StreamerHub
              </span>
            </Link>

            {streamInfo.isLive && (
              <Badge variant="danger" className="animate-pulse">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5 animate-ping" />
                LIVE
              </Badge>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                {/* Points */}
                <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-white">
                    {formatNumber(user.points)}
                  </span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* User Menu */}
                <UserMenu />
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
