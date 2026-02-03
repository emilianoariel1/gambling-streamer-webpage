'use client';

import { useAuth as useAuthContext } from '@/context/AuthContext';

// Re-export the hook for cleaner imports
export const useAuth = useAuthContext;

// Hook to require authentication
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  if (typeof window !== 'undefined' && !isLoading && !isAuthenticated) {
    const currentPath = encodeURIComponent(window.location.pathname);
    window.location.href = `${redirectTo}?redirectTo=${currentPath}`;
  }

  return { user, isLoading, isAuthenticated };
}
