// src/components/OperatingCosts.tsx
'use client';

import { useState } from 'react';
import NumberInput from '../components/NumberInput';  // Make sure this path is correct!

interface CostItem {
  id: number;
  name: string;
  amount: number;
  category: 'one-time' | 'recurring';
}

interface OperatingCostsProps {
  costs: CostItem[];
  onCostsChange: (costs: CostItem[]) => void;
}

export default function OperatingCosts({ costs, onCostsChange }: OperatingCostsProps) {
  // All state hooks at the top
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCost, setNewCost] = useState({
    name: '',
    amount: '',
    category: 'recurring' as 'one-time' | 'recurring'
  });

  // Helper functions
  const addCost = () => {
    if (newCost.name && newCost.amount) {
      const newItem = {
        id: Date.now(),
        name: newCost.name,
        amount: Number(newCost.amount),
        category: newCost.category
      };
      onCostsChange([...costs, newItem]);
      setNewCost({
        name: '',
        amount: '',
        category: 'recurring'
      });
    }
  };

  const removeCost = (id: number) => {
    onCostsChange(costs.filter(cost => cost.id !== id));
  };

  const updateCost = (id: number, updates: Partial<CostItem>) => {
    const updatedCosts = costs.map(cost =>
      cost.id === id ? { ...cost, ...updates } : cost
    );
    onCostsChange(updatedCosts);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Operating Costs</h2>
      
      {/* List existing costs */}
      <div className="space-y-2 mb-4">
        {costs.map(cost => (
          <div key={cost.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            {editingId === cost.id ? (
              // Edit mode
              <div className="flex gap-2 flex-grow">
                <input
                  type="text"
                  value={cost.name}
                  onChange={(e) => updateCost(cost.id, { name: e.target.value })}
                  className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-gray-100"
                />
                <NumberInput
                  value={cost.amount}
                  onChange={(value) => updateCost(cost.id, { amount: value })}
                />
                <select
                  value={cost.category}
                  onChange={(e) => updateCost(cost.id, { 
                    category: e.target.value as 'one-time' | 'recurring' 
                  })}
                  className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-gray-100"
                >
                  <option value="one-time">One-time Investment</option>
                  <option value="recurring">Recurring Cost</option>
                </select>
                <button 
                  onClick={() => setEditingId(null)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              // View mode
              <>
                <div>
                  <span className="font-medium text-gray-100">{cost.name}</span>
                  <span className="ml-2 text-gray-300">${cost.amount.toLocaleString()}/year</span>
                  <span className="ml-2 text-sm text-gray-400">({cost.category})</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingId(cost.id)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => removeCost(cost.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new cost form */}
      <div className="space-y-2 border-t border-gray-700 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Cost Name"
            value={newCost.name}
            onChange={(e) => setNewCost(prev => ({ ...prev, name: e.target.value }))}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 flex-grow text-gray-100 placeholder-gray-400"
          />
          <NumberInput
            value={Number(newCost.amount) || 0}
            onChange={(value) => setNewCost(prev => ({ ...prev, amount: value.toString() }))}
          />
          <select
            value={newCost.category}
            onChange={(e) => setNewCost(prev => ({ 
              ...prev, 
              category: e.target.value as 'one-time' | 'recurring' 
            }))}
            className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-100"
          >
            <option value="one-time">One-time Investment</option>
            <option value="recurring">Recurring Cost</option>
          </select>
        </div>
        <button
          onClick={addCost}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add Cost
        </button>
      </div>

      {/* Total costs */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-lg font-semibold text-gray-100">
          Total Annual Costs: ${costs.reduce((sum, cost) => sum + cost.amount, 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}