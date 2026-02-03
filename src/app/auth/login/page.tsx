'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, Shield, Gift, Trophy, AlertCircle } from 'lucide-react';
import { LoginButtons } from '@/components/auth';
import { Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Trophy,
    title: 'Predictions',
    description: 'Bet on stream outcomes and win big',
  },
  {
    icon: Gift,
    title: 'Giveaways',
    description: 'Enter exclusive giveaways and prizes',
  },
  {
    icon: Sparkles,
    title: 'Points',
    description: 'Earn points by participating in events',
  },
  {
    icon: Shield,
    title: 'Leaderboards',
    description: 'Compete for the top spots',
  },
];

const errorMessages: Record<string, string> = {
  oauth_error: 'Authentication was cancelled or failed. Please try again.',
  missing_params: 'Invalid authentication request. Please try again.',
  invalid_state: 'Session expired. Please try again.',
  auth_failed: 'Failed to authenticate. Please try again.',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const error = searchParams.get('error');
  const redirectTo = searchParams.get('redirectTo') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to StreamerHub
          </h1>
          <p className="text-gray-400">
            Sign in to participate in predictions, giveaways, and more!
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-500/50 bg-red-500/10">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{errorMessages[error] || 'An error occurred. Please try again.'}</p>
            </div>
          </Card>
        )}

        {/* Login Card */}
        <Card variant="gradient" className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              Choose how to sign in
            </h2>
            <LoginButtons size="lg" />
            <p className="text-xs text-gray-500 text-center mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-4 rounded-xl bg-gray-800/50 border border-gray-700"
            >
              <feature.icon className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          New here? Just sign in and your account will be created automatically!
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
