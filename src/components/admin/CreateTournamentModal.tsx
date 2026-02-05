'use client';

import { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Swords, X } from 'lucide-react';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TournamentFormData) => void;
}

export interface TournamentFormData {
  title: string;
  description: string;
  prize: string;
  tournamentType: 8 | 16;
  durationHours: number;
}

export function CreateTournamentModal({ isOpen, onClose, onSubmit }: CreateTournamentModalProps) {
  const [formData, setFormData] = useState<TournamentFormData>({
    title: '',
    description: '',
    prize: '',
    tournamentType: 8,
    durationHours: 48,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      title: '',
      description: '',
      prize: '',
      tournamentType: 8,
      durationHours: 48,
    });
  };

  const handleChange = (field: keyof TournamentFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Swords className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Tournament</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Weekly High Roller Challenge"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Compete for the highest multiplier win!"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              required
            />
          </div>

          {/* Prize */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Prize *
            </label>
            <Input
              type="text"
              value={formData.prize}
              onChange={(e) => handleChange('prize', e.target.value)}
              placeholder="$1000 Cash + VIP Status"
              required
            />
          </div>

          {/* Tournament Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tournament Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('tournamentType', 8)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.tournamentType === 8
                    ? 'border-orange-500 bg-orange-500/10 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl font-bold mb-1">8</div>
                <div className="text-sm">Players</div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('tournamentType', 16)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.tournamentType === 16
                    ? 'border-orange-500 bg-orange-500/10 text-white'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl font-bold mb-1">16</div>
                <div className="text-sm">Players</div>
              </button>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (hours) *
            </label>
            <Input
              type="number"
              value={formData.durationHours}
              onChange={(e) => handleChange('durationHours', parseInt(e.target.value) || 48)}
              min="1"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
            >
              Create Tournament
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
