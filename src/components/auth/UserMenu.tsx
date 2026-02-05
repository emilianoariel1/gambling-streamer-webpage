'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className = '' }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <Avatar
          name={user.displayName}
          src={user.avatar || undefined}
          size="sm"
          isVip={user.isVip}
          isModerator={user.isModerator}
        />
        <div className="hidden md:block text-left">
          <p className="font-semibold text-white text-sm leading-tight">
            {user.displayName}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center gap-3">
              <Avatar
                name={user.displayName}
                src={user.avatar || undefined}
                size="lg"
                isVip={user.isVip}
                isModerator={user.isModerator}
              />
              <div>
                <p className="font-bold text-white">{user.displayName}</p>
                <div className="flex gap-1 mt-1">
                  {user.isVip && <Badge variant="vip" size="sm">VIP</Badge>}
                  {user.isModerator && <Badge variant="mod" size="sm">MOD</Badge>}
                  {user.isSubscriber && <Badge variant="success" size="sm">SUB</Badge>}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-800 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors w-full cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Provider Badge */}
          <div className="px-4 py-2 border-t border-gray-800 bg-gray-800/50">
            <p className="text-xs text-gray-500 flex items-center gap-2">
              Signed in with
              <span className={`font-medium ${
                user.provider === 'kick' ? 'text-[#53FC18]' : 'text-[#5865F2]'
              }`}>
                {user.provider === 'kick' ? 'Kick' : 'Discord'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
