// src/components/ProjectionChart.tsx
'use client';

import { 
 LineChart, 
 Line, 
 XAxis, 
 YAxis, 
 CartesianGrid, 
 Tooltip, 
 Legend, 
 ResponsiveContainer 
} from 'recharts';

interface ChartProps {
 podcasts: Array<{
   id: number;
   name: string;
   revenue: number;
   listeners: number;
   growthRate: number;
   dealType: 'revShare' | 'equity';
   revShare: number;
   investment?: number;
 }>;
 operatingCosts: Array<{
   id: number;
   name: string;
   amount: number;
   category: 'one-time' | 'recurring';
 }>;
}

export default function ProjectionChart({ podcasts, operatingCosts }: ChartProps) {
    const generateProjections = () => {
        const years = [0, 1, 2, 3, 4];
        return years.map((year) => {
          const yearRevenue = podcasts.reduce((sum, podcast) => {
            const yearlyGrowthRate = 1 + podcast.growthRate / 100;
            const yearlyRevenue = podcast.revenue * Math.pow(yearlyGrowthRate, year);
            const share = podcast.revShare / 100;
            return sum + yearlyRevenue * share;
          }, 0);
      
          const yearCosts =
            operatingCosts.reduce((sum, cost) => {
              const inflationRate = cost.category === 'recurring' ? 0.03 : 0;
              return sum + cost.amount * Math.pow(1 + inflationRate, year);
            }, 0) +
            (year === 0
              ? podcasts.reduce(
                  (sum, podcast) =>
                    podcast.dealType === 'equity' && podcast.investment
                      ? sum + podcast.investment
                      : sum,
                  0
                )
              : 0);
      
          const yearProfit = yearRevenue - yearCosts;
      
          return {
            name: `Year ${year + 1}`,
            revenue: yearRevenue,
            costs: yearCosts,
            profit: yearProfit,
          };
        });
      };

 const data = generateProjections();

 return (
   <div className="bg-gray-800 rounded-lg shadow p-3">
     <h2 className="text-sm font-semibold mb-2 text-gray-100">5 Year Projections</h2>
     <div className="h-48">
       <ResponsiveContainer width="100%" height="100%">
         {/* @ts-ignore */}
         <LineChart
           data={data}
           margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
         >
           {/* @ts-ignore */}
           <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
           {/* @ts-ignore */}
           <XAxis 
             dataKey="name" 
             style={{ fontSize: '10px', fill: '#9CA3AF' }} 
           />
           {/* @ts-ignore */}
           <YAxis 
             style={{ fontSize: '10px', fill: '#9CA3AF' }}
             tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
           />
           {/* @ts-ignore */}
           <Tooltip 
             contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
             labelStyle={{ color: '#9CA3AF' }}
             formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
           />
           {/* @ts-ignore */}
           <Legend wrapperStyle={{ color: '#9CA3AF' }} />
           {/* @ts-ignore */}
           <Line
             type="monotone"
             dataKey="revenue"
             stroke="#10B981"
             name="Revenue"
             strokeWidth={2}
           />
           {/* @ts-ignore */}
           <Line
             type="monotone"
             dataKey="costs"
             stroke="#EF4444"
             name="Costs"
             strokeWidth={2}
           />
           {/* @ts-ignore */}
           <Line
             type="monotone"
             dataKey="profit"
             stroke="#3B82F6"
             name="Profit"
             strokeWidth={2}
           />
         </LineChart>
       </ResponsiveContainer>
     </div>
   </div>
 );
}