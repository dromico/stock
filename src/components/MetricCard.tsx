'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import { formatNumber, formatPercentage } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  historic?: { avg: number; percentile: number };
  industry?: { avg: number; percentile: number };
  tooltip?: string;
  isPercentage?: boolean;
  colorInversion?: boolean; // Some metrics are better when lower (P/E), others when higher (ROE)
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  historic,
  industry,
  tooltip,
  isPercentage = false,
  colorInversion = false,
  loading = false
}: MetricCardProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    );
  }

  const formatter = isPercentage ? formatPercentage : formatNumber;
  
  // Calculate difference from historical average
  const historicDiff = historic ? ((value - historic.avg) / historic.avg) : null;
  const industryDiff = industry ? ((value - industry.avg) / industry.avg) : null;
  
  // Determine if the difference is positive (accounting for color inversion)
  const isHistoricPositive = colorInversion ? 
    (historicDiff && historicDiff <= 0) : 
    (historicDiff && historicDiff >= 0);
  
  const isIndustryPositive = colorInversion ? 
    (industryDiff && industryDiff <= 0) : 
    (industryDiff && industryDiff >= 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        {tooltip && (
          <div className="group relative">
            <Info size={16} className="text-gray-400" />
            <div className="absolute right-0 w-60 p-2 text-xs bg-gray-800 text-white rounded shadow-lg 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <div className="text-2xl font-bold mb-3">{isNaN(value) ? 'N/A' : formatter(isPercentage ? value / 100 : value)}</div>
      
      {historic && !isNaN(historic.avg) && (
        <div className="flex items-center text-xs mb-2">
          <span className="text-gray-500 mr-2">Hist Avg: {formatter(isPercentage ? historic.avg / 100 : historic.avg)}</span>
          {historicDiff !== null && !isNaN(historicDiff) && (
            <span className={`flex items-center ${isHistoricPositive ? 'text-green-500' : 'text-red-500'}`}>
              {historicDiff === 0 ? (
                'No change'
              ) : (
                <>
                  {Math.abs(historicDiff) > 0 ? (isHistoricPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : null}
                  {formatPercentage(Math.abs(historicDiff))}
                </>
              )}
            </span>
          )}
        </div>
      )}
      
      {industry && !isNaN(industry.avg) && (
        <div className="flex items-center text-xs">
          <span className="text-gray-500 mr-2">Industry: {formatter(isPercentage ? industry.avg / 100 : industry.avg)}</span>
          {industryDiff !== null && !isNaN(industryDiff) && (
            <span className={`flex items-center ${isIndustryPositive ? 'text-green-500' : 'text-red-500'}`}>
              {industryDiff === 0 ? (
                'No change'
              ) : (
                <>
                  {Math.abs(industryDiff) > 0 ? (isIndustryPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : null}
                  {formatPercentage(Math.abs(industryDiff))}
                </>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}