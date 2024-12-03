import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { 
  NameType, 
  ValueType 
} from 'recharts/types/component/DefaultTooltipContent';

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

interface DataPoint {
  name: string;
  revenue: number;
  costs: number;
  profit: number;
}

export default function ProjectionChart({ podcasts, operatingCosts }: ChartProps) {
  const generateProjections = (): DataPoint[] => {
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

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded border border-gray-700">
          <p className="text-gray-300">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-3">
      <h2 className="text-sm font-semibold mb-2 text-gray-100">5 Year Projections</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              style={{ fontSize: '10px', fill: '#9CA3AF' }} 
            />
            <YAxis 
              style={{ fontSize: '10px', fill: '#9CA3AF' }}
              tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              name="Revenue"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="costs"
              stroke="#EF4444"
              name="Costs"
              strokeWidth={2}
            />
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