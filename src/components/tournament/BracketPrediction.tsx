'use client';

import { useState, useEffect } from 'react';
import { Trophy, Send, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { BracketMatch } from './BracketView';

interface BracketPredictionProps {
  matches: BracketMatch[];
  tournamentType: 8 | 16;
  onSubmit?: (predictions: Record<string, string>) => void;
  disabled?: boolean;
  existingPredictions?: Record<string, string>;
}

export function BracketPrediction({
  matches,
  tournamentType,
  onSubmit,
  disabled = false,
  existingPredictions = {},
}: BracketPredictionProps) {
  const [predictions, setPredictions] = useState<Record<string, string>>(existingPredictions);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPredictions(existingPredictions);
  }, [existingPredictions]);

  const handlePlayerSelect = (matchId: string, playerId: string) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: playerId,
    }));
    setError('');
  };

  const calculatePotentialPoints = () => {
    let total = 0;
    matches.forEach((match) => {
      if (predictions[match.id] && match.player1 && match.player2) {
        switch (match.round) {
          case 'round16':
            total += 1;
            break;
          case 'quarterfinals':
            total += 2;
            break;
          case 'semifinals':
            total += 5;
            break;
          case 'finals':
            total += 7;
            break;
        }
      }
    });
    return total;
  };

  const handleSubmit = async () => {
    // Validate all matches have predictions
    const unpredictedMatches = matches.filter((m) => !predictions[m.id] && m.player1 && m.player2);

    if (unpredictedMatches.length > 0) {
      setError(`Please predict all ${unpredictedMatches.length} remaining matches`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        // Include timestamp with predictions
        const predictionData = {
          predictions,
          submittedAt: new Date().toISOString(),
        };
        await onSubmit(predictions);
      }
    } catch (err) {
      setError('Failed to submit predictions. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoundMatches = (round: BracketMatch['round']) => {
    return matches.filter((m) => m.round === round && m.player1 && m.player2);
  };

  const renderMatchPrediction = (match: BracketMatch) => {
    const selectedPlayer = predictions[match.id];

    return (
      <div
        key={match.id}
        className="bg-gray-800/50 rounded-lg border border-gray-700 p-4"
      >
        <p className="text-xs text-gray-400 mb-3 text-center">Select Winner</p>

        <div className="space-y-2">
          {/* Player 1 */}
          {match.player1 && (
            <button
              onClick={() => handlePlayerSelect(match.id, match.player1!.id)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                selectedPlayer === match.player1.id
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 text-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Avatar name={match.player1.username} src={match.player1.avatar} size="sm" />
              <span className="font-medium flex-1 text-left">{match.player1.username}</span>
              {selectedPlayer === match.player1.id && <Trophy className="w-4 h-4 text-yellow-500" />}
            </button>
          )}

          {/* Player 2 */}
          {match.player2 && (
            <button
              onClick={() => handlePlayerSelect(match.id, match.player2!.id)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                selectedPlayer === match.player2.id
                  ? 'bg-green-500/20 border-green-500 text-white'
                  : 'bg-gray-900/50 border-gray-700 hover:border-gray-600 text-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Avatar name={match.player2.username} src={match.player2.avatar} size="sm" />
              <span className="font-medium flex-1 text-left">{match.player2.username}</span>
              {selectedPlayer === match.player2.id && <Trophy className="w-4 h-4 text-yellow-500" />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const quarterfinals = getRoundMatches('quarterfinals');
  const semifinals = getRoundMatches('semifinals');
  const finals = getRoundMatches('finals');
  const round16 = tournamentType === 16 ? getRoundMatches('round16') : [];

  const totalMatches = matches.filter((m) => m.player1 && m.player2).length;
  const predictedMatches = Object.keys(predictions).length;

  const potentialPoints = calculatePotentialPoints();
  const maxPoints = tournamentType === 16
    ? (8 * 1) + (4 * 2) + (2 * 5) + (1 * 7) // Round16 + Quarters + Semis + Final
    : (4 * 2) + (2 * 5) + (1 * 7); // Quarters + Semis + Final

  return (
    <Card variant="gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Make Your Predictions
        </CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Predict the winner of each match. {predictedMatches}/{totalMatches} matches predicted
        </p>
      </CardHeader>
      <CardContent>
        {/* Points System Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-400 mb-2">📊 Points System</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-300">
            {tournamentType === 16 && (
              <div>
                <span className="text-white font-medium">Round of 16:</span> 1 pt
              </div>
            )}
            <div>
              <span className="text-white font-medium">Quarterfinals:</span> 2 pts
            </div>
            <div>
              <span className="text-white font-medium">Semifinals:</span> 5 pts
            </div>
            <div>
              <span className="text-white font-medium">Final:</span> 7 pts
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            💡 Max possible: <span className="text-yellow-400 font-semibold">{maxPoints} points</span>
            {' • '}Ties broken by prediction time (first wins)
          </p>
        </div>
        <div className="space-y-6">
          {/* Round of 16 (if 16 player tournament) */}
          {tournamentType === 16 && round16.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Round of 16</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {round16.map(renderMatchPrediction)}
              </div>
            </div>
          )}

          {/* Quarterfinals */}
          {quarterfinals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Quarterfinals</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quarterfinals.map(renderMatchPrediction)}
              </div>
            </div>
          )}

          {/* Semifinals */}
          {semifinals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Semifinals</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {semifinals.map(renderMatchPrediction)}
              </div>
            </div>
          )}

          {/* Finals */}
          {finals.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Finals</h3>
              <div className="max-w-md mx-auto">
                {finals.map(renderMatchPrediction)}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-700">
            {error && (
              <p className="mb-3 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={disabled || isSubmitting || predictedMatches < totalMatches}
              isLoading={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Predictions
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
