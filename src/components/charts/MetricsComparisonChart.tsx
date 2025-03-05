'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface ComparisonData {
  name: string;
  value: number;
  benchmark?: number;
  industry?: number;
}

interface MetricsComparisonChartProps {
  data: ComparisonData[];
  title: string;
  primaryColor: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  percentageFormat?: boolean;
  showBenchmark?: boolean;
  showIndustry?: boolean;
  benchmarkLabel?: string;
  industryLabel?: string;
}

export function MetricsComparisonChart({
  data,
  title,
  primaryColor,
  secondaryColor = "#82ca9d",
  tertiaryColor = "#8884d8",
  percentageFormat = false,
  showBenchmark = false,
  showIndustry = false,
  benchmarkLabel = "Historical Avg",
  industryLabel = "Industry Avg"
}: MetricsComparisonChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center border border-dashed rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const formatter = percentageFormat ? formatPercentage : formatNumber;

  return (
    <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-25}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tickFormatter={(value) => formatter(value)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [formatter(value), "Value"]}
              cursor={{ opacity: 0.3 }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
            />
            <Bar 
              dataKey="value" 
              fill={primaryColor} 
              name="Current"
              radius={[4, 4, 0, 0]}
            />
            {showBenchmark && (
              <Bar 
                dataKey="benchmark" 
                fill={secondaryColor} 
                name={benchmarkLabel}
                radius={[4, 4, 0, 0]}
              />
            )}
            {showIndustry && (
              <Bar 
                dataKey="industry" 
                fill={tertiaryColor} 
                name={industryLabel}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}