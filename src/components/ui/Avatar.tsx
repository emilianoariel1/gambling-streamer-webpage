'use client';

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isVip?: boolean;
  isModerator?: boolean;
  className?: string;
}

export function Avatar({ src, name, size = 'md', isVip, isModerator, className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const ringColors = isModerator
    ? 'ring-2 ring-green-500'
    : isVip
    ? 'ring-2 ring-yellow-500'
    : '';

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-bold',
        'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
        sizes[size],
        ringColors,
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      {(isVip || isModerator) && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-gray-900 flex items-center justify-center text-[8px]',
            isModerator ? 'bg-green-500' : 'bg-yellow-500'
          )}
        >
          {isModerator ? 'M' : 'V'}
        </div>
      )}
    </div>
  );
}
