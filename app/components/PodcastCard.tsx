// src/components/PodcastCard.tsx
'use client';

import { useState } from 'react';
import NumberInput from './NumberInput';

interface PodcastCardProps {
  name: string;
  revenue: number;
  listeners: number;
  initialRevShare: number;
  initialGrowthRate: number;
  dealType: 'revShare' | 'equity';
  initialInvestment?: number;
  isOnSubstack?: boolean;
  needsStudio?: boolean;
  isActive: boolean;  // Add this
  onToggleActive: () => void;  // Add this
  onRevShareChange: (value: number) => void;
  onInvestmentChange: (value: number) => void;
  onDealTypeChange: (type: 'revShare' | 'equity') => void;
  onGrowthRateChange: (value: number) => void;
}

export default function PodcastCard({
  name,
  revenue,
  listeners,
  initialRevShare,
  initialGrowthRate,
  dealType,
  initialInvestment,
  isOnSubstack,
  needsStudio,
  isActive,
  onRevShareChange,
  onInvestmentChange,
  onDealTypeChange,
  onGrowthRateChange
}: PodcastCardProps) {
  const [inputValues, setInputValues] = useState({
    revShare: initialRevShare.toString(),
    investment: (initialInvestment || 0).toString(),
    growthRate: initialGrowthRate.toString()
  });

  const handleChange = (field: keyof typeof inputValues, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof typeof inputValues,
    updateFn: (value: number) => void
  ) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setInputValues(prev => ({
        ...prev,
        [field]: field === 'revShare' ? initialRevShare.toString() :
                 field === 'growthRate' ? initialGrowthRate.toString() :
                 (initialInvestment || 0).toString()
      }));
      e.currentTarget.blur();
    }
  };

  return (
<div className="bg-gray-800 rounded-lg shadow p-3">
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-4 min-w-0">
      <h2 className="text-lg font-semibold text-gray-100">{name}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span>${revenue.toLocaleString()}/yr</span>
        <span>•</span>
        <span>{listeners.toLocaleString()} listeners</span>
      </div>
    </div>
    <div className="flex gap-1 flex-shrink-0">
      {isOnSubstack && (
        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
          📝
        </span>
      )}
      {needsStudio && (
        <span className="px-1.5 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
          🎙️
        </span>
      )}
    </div>
  </div>
      
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Growth %</label>
            <NumberInput value={initialGrowthRate} onChange={onGrowthRateChange} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Rev Share %</label>
            <NumberInput value={initialRevShare} onChange={onRevShareChange} />
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={dealType === 'revShare'}
                onChange={() => onDealTypeChange('revShare')}
                className="form-radio text-blue-500 h-3 w-3"
              />
              <span className="text-xs text-gray-300">Rev Share</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                checked={dealType === 'equity'}
                onChange={() => onDealTypeChange('equity')}
                className="form-radio text-blue-500 h-3 w-3"
              />
              <span className="text-xs text-gray-300">Equity</span>
            </label>
          </div>
  
          {dealType === 'equity' && (
            <div className="flex items-center gap-2 ml-2">
              <label className="text-xs text-gray-400">Investment</label>
              <NumberInput value={initialInvestment || 0} onChange={onInvestmentChange} />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}