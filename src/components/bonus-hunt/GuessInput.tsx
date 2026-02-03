'use client';

import { useState } from 'react';
import { DollarSign, Send, AlertCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { formatNumber } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface GuessInputProps {
  huntId: string;
  startBalance: number;
  onSubmit?: (huntId: string, guess: number) => void;
  disabled?: boolean;
}

export function GuessInput({ huntId, startBalance, onSubmit, disabled }: GuessInputProps) {
  const [guessValue, setGuessValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setGuessValue(value);
    setError('');
  };

  const handleSubmit = async () => {
    const numValue = parseFloat(guessValue);

    if (!guessValue || isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    if (numValue <= 0) {
      setError('Guess must be greater than 0');
      return;
    }

    if (numValue > startBalance * 100) {
      setError('That seems unrealistically high!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(huntId, numValue);
      }
      setGuessValue('');
    } catch (err) {
      setError('Failed to submit guess. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <AlertCircle className="w-5 h-5" />
          <span>Sign in to make your prediction</span>
        </div>
        <Link href="/auth/login">
          <Button variant="primary" size="sm" className="w-full">
            Sign In to Guess
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Your Prediction for Final Balance
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Start balance is ${formatNumber(startBalance)}. What will the final balance be?
      </p>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Enter your guess..."
            value={guessValue}
            onChange={handleInputChange}
            disabled={disabled || isSubmitting}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={disabled || isSubmitting || !guessValue}
          className="px-6"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {guessValue && !error && (
        <p className="mt-2 text-sm text-gray-400">
          Your guess: <span className="text-white font-medium">${formatNumber(parseFloat(guessValue) || 0)}</span>
        </p>
      )}
    </div>
  );
}
