// src/components/PodcastCalculator.tsx
'use client';

import { useState } from 'react';
import PodcastCard from './PodcastCard';
import OperatingCosts from './OperatingCosts';
import ProjectionChart from './ProjectionChart';
import { INITIAL_PODCAST_DATA, INITIAL_COSTS } from '../data/mockData';
import { PodcastData, CostItem } from '../types';


interface PodcastData {
  id: number;
  name: string;
  revenue: number;
  listeners: number;
  growthRate: number;
  dealType: 'revShare' | 'equity';
  revShare: number;
  investment?: number;
  isOnSubstack: boolean;
  needsStudio: boolean;
  isActive: boolean;  // Add this
}

interface CostItem {
  id: number;
  name: string;
  amount: number;
  category: 'one-time' | 'recurring';  // Updated from 'fixed' | 'variable' | 'salary'
}

export default function PodcastCalculator() {

    const [podcasts, setPodcasts] = useState<PodcastData[]>(INITIAL_PODCAST_DATA);
    const [operatingCosts, setOperatingCosts] = useState<CostItem[]>(INITIAL_COSTS);


  const handleRevShareChange = (id: number, value: number) => {
    setPodcasts(current =>
      current.map(podcast =>
        podcast.id === id ? { ...podcast, revShare: value } : podcast
      )
    );
  };

  const handleToggleActive = (id: number) => {
    setPodcasts(current =>
      current.map(podcast =>
        podcast.id === id ? { ...podcast, isActive: !podcast.isActive } : podcast
      )
    );
  };
  
  const handleInvestmentChange = (id: number, value: number) => {
    setPodcasts(current =>
      current.map(podcast =>
        podcast.id === id ? { ...podcast, investment: value } : podcast
      )
    );
  };

  // Add handlers for the new fields:
const handleGrowthRateChange = (id: number, value: number) => {
  setPodcasts(current =>
    current.map(podcast =>
      podcast.id === id ? { ...podcast, growthRate: value } : podcast
    )
  );
};

const handleDealTypeChange = (id: number, type: 'revShare' | 'equity') => {
  setPodcasts(current =>
    current.map(podcast =>
      podcast.id === id ? {
        ...podcast,
        dealType: type,
        // Clear investment if switching to revShare
        investment: type === 'revShare' ? undefined : podcast.investment
      } : podcast
    )
  );
};



  const calculateFiveYearTotals = () => {
  // Calculate Year 5 revenue with compound growth
  const yearFiveRevenue = podcasts.reduce((sum, podcast) => {
    const yearlyGrowthRate = 1 + (podcast.growthRate / 100);
    const yearFiveRevenue = podcast.revenue * Math.pow(yearlyGrowthRate, 4);
    const revenueShare = yearFiveRevenue * (podcast.revShare / 100);
    return sum + revenueShare;
  }, 0);

  // Calculate total upfront investments
  const totalInvestments = podcasts.reduce((sum, podcast) => 
    sum + (podcast.dealType === 'equity' && podcast.investment ? podcast.investment : 0)
  , 0);

  // Calculate Year 5 recurring costs with inflation + one-time costs + investments
  const yearFiveCosts = operatingCosts.reduce((sum, cost) => {
    if (cost.category === 'recurring') {
      // Compound 3% inflation over 5 years
      return sum + (cost.amount * Math.pow(1.03, 4));
    }
    return sum + cost.amount; // one-time costs
  }, 0) + totalInvestments;  // add investments to total costs
  
  
    return {
      revenue: yearFiveRevenue,
      costs: yearFiveCosts,
      profit: yearFiveRevenue - yearFiveCosts
    };
  };

  const { revenue, costs, profit } = calculateFiveYearTotals();

  const getEmoji = (profit: number) => {
    if (profit <= 0) return "😢";
    if (profit < 100000) return "😐";
    if (profit < 500000) return "🙂";
    return "🤑";
   };
   
   const getProfitColor = (profit: number) => {
    return profit <= 0 ? "text-red-400" : "text-green-400";
   };

  return (
    <div className="space-y-8 bg-gray-900 text-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* Financial Summary */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Year 5 Financial Summary</h2>
            <div className="space-y-2">
              <p>Total Revenue: ${revenue.toLocaleString()}</p>
              <p>Total Costs: ${costs.toLocaleString()}</p>
              <p className={`text-xl font-bold ${getProfitColor(profit)} flex items-center gap-2`}>
 Net Profit: ${profit.toLocaleString()}
 <span className="text-2xl">{getEmoji(profit)}</span>
</p>
            </div>
          </div>
   
          <ProjectionChart
            podcasts={podcasts}
            operatingCosts={operatingCosts}
          />
   
          <OperatingCosts   costs={operatingCosts}  // Make sure this prop is being passed
  onCostsChange={setOperatingCosts}  />
        </div>
   
        <div className="space-y-4"> {/* Right column */}
        {podcasts.map(podcast => (
           <PodcastCard
             key={podcast.id}
             name={podcast.name}
             revenue={podcast.revenue}
             listeners={podcast.listeners}
             initialRevShare={podcast.revShare}
             initialGrowthRate={podcast.growthRate}
             dealType={podcast.dealType}
             initialInvestment={podcast.investment}
             isOnSubstack={podcast.isOnSubstack}
             needsStudio={podcast.needsStudio}
             onToggleActive={() => handleToggleActive(podcast.id)}
             onRevShareChange={(value) => handleRevShareChange(podcast.id, value)}
             onInvestmentChange={(value) => handleInvestmentChange(podcast.id, value)}
             onDealTypeChange={(type) => handleDealTypeChange(podcast.id, type)}
             onGrowthRateChange={(value) => handleGrowthRateChange(podcast.id, value)}
           />
          ))}
        </div>
      </div>
    </div>
  );
}