'use client';

import { useState } from 'react';
import { Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { BonusHuntCard } from '@/components/bonus-hunt';
import { Card, Button } from '@/components/ui';
import type { BonusHunt } from '@/types';

const ITEMS_PER_PAGE = 10;

// Mock data for demonstration - ordered by most recent
const mockBonusHunts: BonusHunt[] = [
  {
    id: '1',
    name: 'Friday Night Hunt #42',
    startBalance: 5000,
    bonuses: [
      { id: 'b1', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 450, multiplier: 22.5 },
      { id: 'b2', slotName: 'Gates of Olympus', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 120, multiplier: 6 },
      { id: 'b3', slotName: 'Wanted Dead or Wild', provider: 'Hacksaw', betSize: 40, isOpened: true, result: 800, multiplier: 20 },
      { id: 'b4', slotName: 'Mental', provider: 'NoLimit City', betSize: 20, isOpened: false },
      { id: 'b5', slotName: 'Fruit Party', provider: 'Pragmatic Play', betSize: 20, isOpened: false },
      { id: 'b6', slotName: 'Dog House Megaways', provider: 'Pragmatic Play', betSize: 40, isOpened: false },
    ],
    guesses: [
      { id: 'g1', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 7500, guessedAt: new Date() },
      { id: 'g2', visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 4200, guessedAt: new Date() },
      { id: 'g3', visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 8900, guessedAt: new Date() },
    ],
    status: 'started',
    createdAt: new Date(Date.now() - 3600000),
    startedAt: new Date(Date.now() - 1800000),
  },
  {
    id: '2',
    name: 'Saturday Morning Hunt #43',
    startBalance: 3000,
    bonuses: [
      { id: 'b7', slotName: 'Big Bass Bonanza', provider: 'Pragmatic Play', betSize: 10, isOpened: false },
      { id: 'b8', slotName: 'Book of Dead', provider: 'Play\'n GO', betSize: 20, isOpened: false },
      { id: 'b9', slotName: 'Starlight Princess', provider: 'Pragmatic Play', betSize: 20, isOpened: false },
    ],
    guesses: [],
    status: 'open',
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: '3',
    name: 'Thursday Hunt #41',
    startBalance: 4000,
    finalBalance: 6850,
    bonuses: [
      { id: 'b10', slotName: 'Razor Shark', provider: 'Push Gaming', betSize: 20, isOpened: true, result: 340, multiplier: 17 },
      { id: 'b11', slotName: 'Jammin Jars', provider: 'Push Gaming', betSize: 40, isOpened: true, result: 1200, multiplier: 30 },
      { id: 'b12', slotName: 'Reactoonz', provider: 'Play\'n GO', betSize: 20, isOpened: true, result: 180, multiplier: 9 },
      { id: 'b13', slotName: 'Fire in the Hole', provider: 'NoLimit City', betSize: 20, isOpened: true, result: 2400, multiplier: 120 },
    ],
    guesses: [
      { id: 'g4', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 6500, guessedAt: new Date() },
      { id: 'g5', visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 7200, guessedAt: new Date() },
      { id: 'g6', visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 5100, guessedAt: new Date() },
    ],
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000),
    startedAt: new Date(Date.now() - 82800000),
    completedAt: new Date(Date.now() - 79200000),
    winners: [
      { rank: 1, visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 6500, difference: 350, prize: 5000 },
      { rank: 2, visibleUserId: 'u2', userId: 'u2', username: 'HighRoller', guessedBalance: 7200, difference: 350, prize: 2500 },
      { rank: 3, visibleUserId: 'u3', userId: 'u3', username: 'StreamKing', guessedBalance: 5100, difference: 1750, prize: 1000 },
    ],
  },
  {
    id: '4',
    name: 'Wednesday Hunt #40',
    startBalance: 6000,
    finalBalance: 4200,
    bonuses: [
      { id: 'b14', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 40, isOpened: true, result: 280, multiplier: 7 },
      { id: 'b15', slotName: 'Gates of Olympus', provider: 'Pragmatic Play', betSize: 40, isOpened: true, result: 520, multiplier: 13 },
    ],
    guesses: [
      { id: 'g7', visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 5000, guessedAt: new Date() },
    ],
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000),
    startedAt: new Date(Date.now() - 169200000),
    completedAt: new Date(Date.now() - 165600000),
    winners: [
      { rank: 1, visibleUserId: 'u1', userId: 'u1', username: 'LuckyAce', guessedBalance: 5000, difference: 800, prize: 5000 },
    ],
  },
  {
    id: '5',
    name: 'Tuesday Hunt #39',
    startBalance: 5000,
    finalBalance: 12500,
    bonuses: [
      { id: 'b16', slotName: 'Wanted Dead or Wild', provider: 'Hacksaw', betSize: 80, isOpened: true, result: 8000, multiplier: 100 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 259200000),
    startedAt: new Date(Date.now() - 255600000),
    completedAt: new Date(Date.now() - 252000000),
    winners: [],
  },
  {
    id: '6',
    name: 'Monday Hunt #38',
    startBalance: 4500,
    finalBalance: 3800,
    bonuses: [
      { id: 'b17', slotName: 'Mental', provider: 'NoLimit City', betSize: 20, isOpened: true, result: 150, multiplier: 7.5 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 345600000),
    completedAt: new Date(Date.now() - 342000000),
    winners: [],
  },
  {
    id: '7',
    name: 'Sunday Hunt #37',
    startBalance: 3500,
    finalBalance: 7200,
    bonuses: [
      { id: 'b18', slotName: 'Big Bass Bonanza', provider: 'Pragmatic Play', betSize: 10, isOpened: true, result: 500, multiplier: 50 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 432000000),
    completedAt: new Date(Date.now() - 428400000),
    winners: [],
  },
  {
    id: '8',
    name: 'Saturday Hunt #36',
    startBalance: 2500,
    finalBalance: 1800,
    bonuses: [
      { id: 'b19', slotName: 'Book of Dead', provider: 'Play\'n GO', betSize: 20, isOpened: true, result: 80, multiplier: 4 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 518400000),
    completedAt: new Date(Date.now() - 514800000),
    winners: [],
  },
  {
    id: '9',
    name: 'Friday Hunt #35',
    startBalance: 8000,
    finalBalance: 15000,
    bonuses: [
      { id: 'b20', slotName: 'Starlight Princess', provider: 'Pragmatic Play', betSize: 100, isOpened: true, result: 12000, multiplier: 120 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 604800000),
    completedAt: new Date(Date.now() - 601200000),
    winners: [],
  },
  {
    id: '10',
    name: 'Thursday Hunt #34',
    startBalance: 5500,
    finalBalance: 6200,
    bonuses: [
      { id: 'b21', slotName: 'Reactoonz', provider: 'Play\'n GO', betSize: 40, isOpened: true, result: 480, multiplier: 12 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 691200000),
    completedAt: new Date(Date.now() - 687600000),
    winners: [],
  },
  {
    id: '11',
    name: 'Wednesday Hunt #33',
    startBalance: 4000,
    finalBalance: 2500,
    bonuses: [
      { id: 'b22', slotName: 'Fire in the Hole', provider: 'NoLimit City', betSize: 20, isOpened: true, result: 60, multiplier: 3 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 777600000),
    completedAt: new Date(Date.now() - 774000000),
    winners: [],
  },
  {
    id: '12',
    name: 'Tuesday Hunt #32',
    startBalance: 3000,
    finalBalance: 4500,
    bonuses: [
      { id: 'b23', slotName: 'Sweet Bonanza', provider: 'Pragmatic Play', betSize: 20, isOpened: true, result: 600, multiplier: 30 },
    ],
    guesses: [],
    status: 'completed',
    createdAt: new Date(Date.now() - 864000000),
    completedAt: new Date(Date.now() - 860400000),
    winners: [],
  },
];

// Sort by createdAt descending (most recent first)
const sortedHunts = [...mockBonusHunts].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);

export default function BonusHuntsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedHunts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHunts = sortedHunts.slice(startIndex, endIndex);

  const handleGuessSubmit = (huntId: string, guess: number) => {
    console.log('Guess submitted:', { huntId, guess });
    // TODO: Submit to backend
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-purple-400" />
          Bonus Hunts
        </h1>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      {/* Hunt List */}
      <div className="space-y-4">
        {currentHunts.length > 0 ? (
          currentHunts.map((hunt) => (
            <BonusHuntCard key={hunt.id} hunt={hunt} onGuessSubmit={handleGuessSubmit} />
          ))
        ) : (
          <Card className="text-center py-12">
            <Target className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No bonus hunts yet</h3>
            <p className="text-gray-400">
              Check back during the stream for bonus hunts!
            </p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      {totalPages > 1 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedHunts.length)} of {sortedHunts.length} bonus hunts
        </p>
      )}
    </div>
  );
}
