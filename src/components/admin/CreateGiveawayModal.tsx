'use client';

import { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Gift, X } from 'lucide-react';

interface CreateGiveawayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GiveawayFormData) => void;
}

export interface GiveawayFormData {
  title: string;
  description: string;
  prize: string;
  pointsCost: number;
  numberOfWinners: number;
  durationHours: number;
}

export function CreateGiveawayModal({ isOpen, onClose, onSubmit }: CreateGiveawayModalProps) {
  const [formData, setFormData] = useState<GiveawayFormData>({
    title: '',
    description: '',
    prize: '',
    pointsCost: 0,
    numberOfWinners: 1,
    durationHours: 24,
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
      pointsCost: 0,
      numberOfWinners: 1,
      durationHours: 24,
    });
  };

  const handleChange = (field: keyof GiveawayFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Gift className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Giveaway</h2>
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
              placeholder="Weekly VIP Giveaway"
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
              placeholder="Enter for a chance to win exclusive VIP status!"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              placeholder="1 Month VIP + 10,000 Points"
              required
            />
          </div>

          {/* Grid for numbers */}
          <div className="grid grid-cols-3 gap-4 items-start">
            {/* Points Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Points Cost *
              </label>
              <Input
                type="number"
                value={formData.pointsCost}
                onChange={(e) => handleChange('pointsCost', parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>

            {/* Number of Winners */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Winners *
              </label>
              <Input
                type="number"
                value={formData.numberOfWinners}
                onChange={(e) => handleChange('numberOfWinners', parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (h) *
              </label>
              <Input
                type="number"
                value={formData.durationHours}
                onChange={(e) => handleChange('durationHours', parseInt(e.target.value) || 24)}
                min="1"
                required
              />
            </div>
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
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white cursor-pointer"
            >
              Create Giveaway
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
