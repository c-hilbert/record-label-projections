// src/data/mockData.ts
import { PodcastData, CostItem } from '../types';

export const INITIAL_PODCAST_DATA: PodcastData[] = [
  { 
    id: 1, 
    name: 'Fifth Column', 
    revenue: 1000000, 
    listeners: 50000,
    growthRate: 10,
    dealType: 'revShare',
    revShare: 30,
    investment: 0
  },
  { 
    id: 2, 
    name: 'Blocked & Reported', 
    revenue: 800000, 
    listeners: 40000,
    growthRate: 10,
    dealType: 'revShare',
    revShare: 10,
    investment: 0
  },
  {
    id: 3,
    name: 'New Show Example',
    revenue: 50000,
    listeners: 3000,
    growthRate: 20,
    dealType: 'equity',
    revShare: 25,
    investment: 100000
  }
];

export const INITIAL_COSTS: CostItem[] = [
  {
    id: 1,
    name: 'Salary 1',
    amount: 150000,
    category: 'recurring'
  },
  {
    id: 2,
    name: 'Salary 2',
    amount: 140000,
    category: 'recurring'
  },

];