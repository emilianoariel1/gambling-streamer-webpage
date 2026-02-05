'use client';

import { useState, useEffect } from 'react';
import { Gift, Plus } from 'lucide-react';
import { GiveawayCard } from '@/components/giveaway';
import { Card, Badge, Button } from '@/components/ui';
import { CreateGiveawayModal, type GiveawayFormData } from '@/components/admin';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Giveaway } from '@/types';

type FilterType = 'active' | 'ended';

export default function GiveawaysPage() {
  const [filter, setFilter] = useState<FilterType>('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchGiveaways();
  }, []);

  const fetchGiveaways = async () => {
    try {
      const response = await fetch('/api/giveaways');
      if (!response.ok) {
        throw new Error('Failed to fetch giveaways');
      }
      const data = await response.json();
      setGiveaways(data.giveaways || []);
    } catch (error) {
      console.error('❌ Error fetching giveaways:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGiveaway = async (data: GiveawayFormData) => {
    try {
      const response = await fetch('/api/admin/giveaways/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create giveaway');
      }

      const result = await response.json();
      console.log('✅ Giveaway created:', result);

      // Refresh the giveaways list
      fetchGiveaways();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('❌ Error creating giveaway:', error);
      alert('Failed to create giveaway. Please try again.');
    }
  };

  const filteredGiveaways = giveaways.filter((g) => {
    switch (filter) {
      case 'active':
        return g.isActive;
      case 'ended':
        return !g.isActive;
      default:
        return true;
    }
  });

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: 'active', label: 'Active', count: giveaways.filter((g) => g.isActive).length },
    { value: 'ended', label: 'Ended', count: giveaways.filter((g) => !g.isActive).length },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center text-gray-400">Loading giveaways...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gift className="w-8 h-8 text-pink-400" />
            Giveaways
          </h1>
          {user?.isAdmin && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Giveaway
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
                ? 'bg-pink-600 text-white'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {f.label}
            <Badge variant="default" size="sm">{f.count}</Badge>
          </button>
        ))}
      </div>

      {/* Giveaways Grid */}
      {filteredGiveaways.length === 0 ? (
        <Card className="text-center py-12">
          <Gift className="w-12 h-12 mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No giveaways found</h3>
          <p className="text-gray-400">Try adjusting your filters or check back later.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGiveaways.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateGiveawayModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGiveaway}
      />
    </div>
  );
}
