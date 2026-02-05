'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// Kick logo as SVG
function KickLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.5 3H10L8.5 8L14 3H18.5L11.5 10L12 12L18.5 21H14L10 14L8.5 16V21H5V3H6.5Z" />
    </svg>
  );
}

interface LoginButtonsProps {
  onSuccess?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export function LoginButtons({
  size = 'md',
  showLabels = true,
  className = '',
}: LoginButtonsProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    login('kick');
  };

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-14 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Kick Login Button */}
      <Button
        onClick={handleLogin}
        disabled={loading}
        className={`
          ${sizeClasses[size]}
          bg-[#53FC18] hover:bg-[#45d915] text-black font-semibold
          flex items-center justify-center gap-3 w-full
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <KickLogo className={iconSizes[size]} />
        )}
        {showLabels && (
          <span>{loading ? 'Connecting...' : 'Continue with Kick'}</span>
        )}
      </Button>
    </div>
  );
}
