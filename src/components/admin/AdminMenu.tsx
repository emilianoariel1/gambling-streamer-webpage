'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, LayoutDashboard, Gift, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function AdminMenu() {
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

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Admin Dashboard',
      href: '/admin',
      description: 'Manage all content',
    },
    {
      icon: Gift,
      label: 'Live Giveaway',
      href: '/admin/live-giveaway',
      description: 'Control active giveaway',
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Admin Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
      >
        <Shield className="w-4 h-4" />
        <span className="hidden md:inline font-medium">Admin</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-purple-500/30 rounded-xl shadow-xl z-50 overflow-hidden animate-in">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-start gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors cursor-pointer border-b border-gray-800 last:border-b-0"
            >
              <item.icon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
