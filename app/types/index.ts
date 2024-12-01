// src/types/index.ts
export interface PodcastData {
    id: number;
    name: string;
    revenue: number;
    listeners: number;
    growthRate: number;
    dealType: 'revShare' | 'equity';
    revShare: number;
    investment?: number;
  }
  
  export interface CostItem {
    id: number;
    name: string;
    amount: number;
    category: 'one-time' | 'recurring';
  }