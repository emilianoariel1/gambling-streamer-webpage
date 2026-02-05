'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface BonusFormData {
  slotName: string;
  provider: string;
  betSize: number;
}

interface AddBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BonusFormData) => void;
}

export function AddBonusModal({ isOpen, onClose, onSubmit }: AddBonusModalProps) {
  const [formData, setFormData] = useState<BonusFormData>({
    slotName: '',
    provider: '',
    betSize: 20,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BonusFormData, string>>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: Partial<Record<keyof BonusFormData, string>> = {};

    if (!formData.slotName.trim()) {
      newErrors.slotName = 'Slot name is required';
    }
    if (!formData.provider.trim()) {
      newErrors.provider = 'Provider is required';
    }
    if (!formData.betSize || formData.betSize <= 0) {
      newErrors.betSize = 'Bet size must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      slotName: '',
      provider: '',
      betSize: 20,
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      slotName: '',
      provider: '',
      betSize: 20,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-400" />
            Add Bonus
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Slot Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Slot Name *
            </label>
            <input
              type="text"
              value={formData.slotName}
              onChange={(e) => {
                setFormData({ ...formData, slotName: e.target.value });
                setErrors({ ...errors, slotName: undefined });
              }}
              placeholder="e.g., Sweet Bonanza"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            {errors.slotName && (
              <p className="mt-1 text-sm text-red-400">{errors.slotName}</p>
            )}
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Provider *
            </label>
            <input
              type="text"
              value={formData.provider}
              onChange={(e) => {
                setFormData({ ...formData, provider: e.target.value });
                setErrors({ ...errors, provider: undefined });
              }}
              placeholder="e.g., Pragmatic Play"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            {errors.provider && (
              <p className="mt-1 text-sm text-red-400">{errors.provider}</p>
            )}
          </div>

          {/* Bet Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bet Size *
            </label>
            <input
              type="number"
              value={formData.betSize}
              onChange={(e) => {
                setFormData({ ...formData, betSize: parseFloat(e.target.value) });
                setErrors({ ...errors, betSize: undefined });
              }}
              placeholder="20"
              step="0.01"
              min="0.01"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            {errors.betSize && (
              <p className="mt-1 text-sm text-red-400">{errors.betSize}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer"
            >
              Add Bonus
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
