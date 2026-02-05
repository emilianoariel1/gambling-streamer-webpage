'use client';

import { useState, useEffect } from 'react';
import { Trophy, Plus, Swords } from 'lucide-react';
import { TournamentCard } from '@/components/tournament';
import { Card, Badge, Button } from '@/components/ui';
import { CreateTournamentModal, type TournamentFormData } from '@/components/admin';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Tournament } from '@/types';

type FilterType = 'active' | 'ended';

export default function TournamentsPage() {
  const [filter, setFilter] = useState<FilterType>('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) {
        throw new Error('Failed to fetch tournaments');
      }
      const data = await response.json();
      setTournaments(data.tournaments || []);
    } catch (error) {
      console.error('❌ Error fetching tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = async (data: TournamentFormData) => {
    try {
      const response = await fetch('/api/admin/tournaments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create tournament');
      }

      const result = await response.json();
      console.log('✅ Tournament created:', result);

      // Refresh the tournaments list
      fetchTournaments();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('❌ Error creating tournament:', error);
      alert('Failed to create tournament. Please try again.');
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    switch (filter) {
      case 'active':
        return t.isActive;
      case 'ended':
        return !t.isActive;
      default:
        return true;
    }
  });

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'active', label: 'Active', count: tournaments.filter((t) => t.isActive).length },
    { value: 'ended', label: 'Ended', count: tournaments.filter((t) => !t.isActive).length },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Swords className="w-8 h-8 text-orange-400" />
            Tournaments
          </h1>
          {user?.isAdmin && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Tournament
            </Button>
          )}
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-6 w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 cursor-pointer',
              filter === f.value
                ? 'bg-yellow-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {f.label}
            <Badge variant="default" size="sm">{f.count}</Badge>
          </button>
        ))}
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <Card className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No tournaments found</h3>
          <p className="text-gray-400">Check back later for upcoming tournaments!</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTournament}
      />
    </div>
  );
}
