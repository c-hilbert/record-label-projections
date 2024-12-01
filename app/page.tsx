import PodcastCalculator from './components/PodcastCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-4 text-gray-100">Podcast Revenue Calculator</h1>
      <PodcastCalculator />
    </div>
  );
}