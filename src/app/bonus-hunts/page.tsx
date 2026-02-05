'use client';

import { useState, useEffect } from 'react';
import { Target, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { BonusHuntCard } from '@/components/bonus-hunt';
import { Card, Button } from '@/components/ui';
import { CreateBonusHuntModal, type BonusHuntFormData } from '@/components/admin';
import { useAuth } from '@/hooks/useAuth';
import type { BonusHunt } from '@/types';

const ITEMS_PER_PAGE = 10;

export default function BonusHuntsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bonusHunts, setBonusHunts] = useState<BonusHunt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBonusHunts();
  }, []);

  const fetchBonusHunts = async () => {
    try {
      const response = await fetch('/api/bonus-hunts');
      if (!response.ok) {
        throw new Error('Failed to fetch bonus hunts');
      }
      const data = await response.json();
      setBonusHunts(data.bonusHunts || []);
    } catch (error) {
      console.error('❌ Error fetching bonus hunts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHunt = async (data: BonusHuntFormData) => {
    try {
      const response = await fetch('/api/admin/bonus-hunts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create bonus hunt');
      }

      const result = await response.json();
      console.log('✅ Bonus hunt created:', result);

      // Refresh the hunts list
      fetchBonusHunts();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('❌ Error creating bonus hunt:', error);
      alert('Failed to create bonus hunt. Please try again.');
    }
  };

  const totalPages = Math.ceil(bonusHunts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHunts = bonusHunts.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading bonus hunts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            Bonus Hunts
          </h1>
          {user?.isAdmin && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Hunt
            </Button>
          )}
        </div>
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
          Showing {startIndex + 1}-{Math.min(endIndex, bonusHunts.length)} of {bonusHunts.length} bonus hunts
        </p>
      )}

      {/* Create Modal */}
      <CreateBonusHuntModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateHunt}
      />
    </div>
  );
}
