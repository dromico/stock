'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Clock, Briefcase, DollarSign } from 'lucide-react';
import { formatCurrency, formatLargeNumber, formatPercentage } from '@/lib/utils';

interface StockHeaderProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  currency: string;
  loading?: boolean;
}

export function StockHeader({
  symbol,
  name,
  price,
  change,
  changePercent,
  marketCap,
  currency,
  loading = false
}: StockHeaderProps) {
  if (loading) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const isPositiveChange = change >= 0;

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {symbol} 
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {name}
            </span>
          </h1>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold">
              {formatCurrency(price, currency)}
            </span>
            
            <div className={`flex items-center ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              <span className="flex items-center">
                {isPositiveChange ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {formatCurrency(Math.abs(change), currency)}
              </span>
              <span className="ml-1">
                ({isPositiveChange ? '+' : ''}{formatPercentage(changePercent / 100)})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Briefcase size={16} className="text-gray-500" />
            <span className="text-gray-500">Market Cap:</span>
            <span className="font-medium">{formatLargeNumber(marketCap)}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <DollarSign size={16} className="text-gray-500" />
            <span className="text-gray-500">Currency:</span>
            <span className="font-medium">{currency}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-gray-500" />
            <span className="text-gray-500">Last Updated:</span>
            <span className="font-medium">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}