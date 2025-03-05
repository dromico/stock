'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface DataPoint {
  date: string;
  value: number;
  average?: number;
  median?: number;
}

interface RatioHistoryChartProps {
  data: DataPoint[];
  title: string;
  dataKey: string;
  color: string;
  showAverage?: boolean;
  showMedian?: boolean;
  percentageFormat?: boolean;
}

export function RatioHistoryChart({ 
  data, 
  title, 
  dataKey, 
  color,
  showAverage = true,
  showMedian = false,
  percentageFormat = false
}: RatioHistoryChartProps) {
  
  if (!data || data.length === 0) {
    return (
      <div className="h-72 w-full flex items-center justify-center border border-dashed rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const formatter = percentageFormat ? formatPercentage : formatNumber;
  
  const latestValue = data[data.length - 1]?.value;
  const averageValue = data[0]?.average;
  const medianValue = data[0]?.median;
  
  const valueDiff = averageValue ? latestValue - averageValue : 0;
  const percentDiff = averageValue ? (valueDiff / averageValue) * 100 : 0;

  return (
    <div className="w-full h-96 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          <div>
            <span className="text-gray-500">Current: </span>
            <span className="font-medium">{formatter(latestValue)}</span>
          </div>
          {showAverage && averageValue && (
            <div>
              <span className="text-gray-500">Average: </span>
              <span className="font-medium">{formatter(averageValue)}</span>
              <span className={`ml-2 ${valueDiff < 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({percentDiff > 0 ? '+' : ''}{formatPercentage(percentDiff / 100)})
              </span>
            </div>
          )}
          {showMedian && medianValue && (
            <div>
              <span className="text-gray-500">Median: </span>
              <span className="font-medium">{formatter(medianValue)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" strokeOpacity={0.4} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => new Date(value).getFullYear().toString()}
            />
            <YAxis 
              tickFormatter={(value) => formatter(value)}
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [formatter(value), dataKey]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              name={title}
              stroke={color} 
              fill={`url(#color-${dataKey})`} 
              strokeWidth={2}
            />
            {showAverage && averageValue && (
              <ReferenceLine 
                y={averageValue} 
                stroke="#888" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Avg', 
                  position: 'insideTopRight',
                  fontSize: 10
                }} 
              />
            )}
            {showMedian && medianValue && (
              <ReferenceLine 
                y={medianValue} 
                stroke="#666" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Median', 
                  position: 'insideBottomRight',
                  fontSize: 10
                }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}