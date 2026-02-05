'use client';

import { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Target, X, Plus, Trash2 } from 'lucide-react';

interface CreateBonusHuntModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BonusHuntFormData) => void;
}

export interface BonusHuntFormData {
  name: string;
  startBalance: number;
  bonuses: {
    slotName: string;
    provider: string;
    betSize: number;
  }[];
}

export function CreateBonusHuntModal({ isOpen, onClose, onSubmit }: CreateBonusHuntModalProps) {
  const [formData, setFormData] = useState<BonusHuntFormData>({
    name: '',
    startBalance: 5000,
    bonuses: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: '',
      startBalance: 5000,
      bonuses: [],
    });
  };

  const handleChange = (field: keyof Omit<BonusHuntFormData, 'bonuses'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBonusChange = (index: number, field: keyof BonusHuntFormData['bonuses'][0], value: string | number) => {
    const newBonuses = [...formData.bonuses];
    newBonuses[index] = { ...newBonuses[index], [field]: value };
    setFormData(prev => ({ ...prev, bonuses: newBonuses }));
  };

  const addBonus = () => {
    setFormData(prev => ({
      ...prev,
      bonuses: [...prev.bonuses, { slotName: '', provider: '', betSize: 20 }]
    }));
  };

  const removeBonus = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Bonus Hunt</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hunt Name & Start Balance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hunt Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Friday Night Hunt #42"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Balance *
              </label>
              <Input
                type="number"
                value={formData.startBalance}
                onChange={(e) => handleChange('startBalance', parseInt(e.target.value) || 0)}
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          {/* Bonuses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Bonuses (optional)
              </label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={addBonus}
                className="text-purple-400 hover:text-purple-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Bonus
              </Button>
            </div>

            <div className="space-y-3">
              {formData.bonuses.map((bonus, index) => (
                <div key={index} className="flex gap-3 items-end bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={bonus.slotName}
                      onChange={(e) => handleBonusChange(index, 'slotName', e.target.value)}
                      placeholder="Slot name"
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={bonus.provider}
                      onChange={(e) => handleBonusChange(index, 'provider', e.target.value)}
                      placeholder="Provider"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={bonus.betSize}
                      onChange={(e) => handleBonusChange(index, 'betSize', parseInt(e.target.value) || 0)}
                      placeholder="Bet"
                      min="0"
                    />
                  </div>
                  {formData.bonuses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBonus(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
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
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            >
              Create Hunt
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
