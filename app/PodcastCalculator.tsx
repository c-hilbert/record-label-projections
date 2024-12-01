// // src/components/PodcastCalculator.tsx
// 'use client';

// import { useState } from 'react';
// import PodcastCard from './PodcastCard';

// interface PodcastData {
//   id: number;
//   name: string;
//   revenue: number;
//   listeners: number;
// }

// export default function PodcastCalculator() {
//   const [podcasts, setPodcasts] = useState<PodcastData[]>([
//     { 
//       id: 1, 
//       name: 'Fifth Column', 
//       revenue: 250000, 
//       listeners: 150000 
//     },
//     { 
//       id: 2, 
//       name: 'Blocked & Reported', 
//       revenue: 180000, 
//       listeners: 100000 
//     }
//   ]);

//   const handleRevenueChange = (id: number, value: number) => {
//     setPodcasts(current =>
//       current.map(podcast =>
//         podcast.id === id ? { ...podcast, revenue: value } : podcast
//       )
//     );
//   };

//   const handleListenersChange = (id: number, value: number) => {
//     setPodcasts(current =>
//       current.map(podcast =>
//         podcast.id === id ? { ...podcast, listeners: value } : podcast
//       )
//     );
//   };

//   return (
//     <div className="space-y-4">
//       {podcasts.map(podcast => (
//         <PodcastCard
//           key={podcast.id}
//           name={podcast.name}
//           initialRevenue={podcast.revenue}
//           initialListeners={podcast.listeners}
//           onRevenueChange={(value) => handleRevenueChange(podcast.id, value)}
//           onListenersChange={(value) => handleListenersChange(podcast.id, value)}
//         />
//       ))}
//     </div>
//   );
// }