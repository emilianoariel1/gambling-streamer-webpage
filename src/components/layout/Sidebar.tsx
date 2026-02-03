'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Gift, Target, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/giveaways', label: 'Giveaways', icon: Gift },
  { href: '/tournaments', label: 'Tournaments', icon: Swords },
  { href: '/bonus-hunts', label: 'Bonus Hunts', icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <nav className="flex flex-col p-4 gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
