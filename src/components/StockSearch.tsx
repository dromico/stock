'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchStocks } from '@/lib/api';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
}

interface SearchResult {
  symbol: string;
  shortname: string;
  longname: string;
  exchange: string;
  type: string;
}

export function StockSearch({ onSelectStock }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await searchStocks(query);
        if (response && response.quotes) {
          setResults(response.quotes.slice(0, 8));
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error searching for stocks:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    setIsOpen(false);
    onSelectStock(symbol);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 dark:border-gray-600"
          placeholder="Search for a stock..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-y-auto">
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={result.symbol}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelect(result.symbol)}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{result.symbol}</span>
                  <span className="text-sm text-gray-500">{result.exchange}</span>
                </div>
                <div className="text-sm truncate">{result.longname || result.shortname}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}