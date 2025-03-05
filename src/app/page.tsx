'use client';

import React, { useState, useEffect } from 'react';
import { StockSearch } from '@/components/StockSearch';
import { StockHeader } from '@/components/StockHeader';
import { MetricCard } from '@/components/MetricCard';
import { RatioHistoryChart } from '@/components/charts/RatioHistoryChart';
import { MetricsComparisonChart } from '@/components/charts/MetricsComparisonChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs/index';
import { AlertCircle, Info } from 'lucide-react';

export default function Home() {
  const [symbol, setSymbol] = useState<string>('MSFT');
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState<boolean>(false);

  const fetchStockData = async (stockSymbol: string) => {
    if (!stockSymbol) return;
    
    setLoading(true);
    setError(null);
    setIsMockData(false);
    
    try {
      console.log(`Fetching data for ${stockSymbol}...`);
      const response = await fetch(`/api/stock/${stockSymbol}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch data for ${stockSymbol} (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setStockData(data);
      
      // Check if we're using mock data
      if (data._usedMockData) {
        console.log('Using mock data for visualization');
        setIsMockData(true);
      }
    } catch (err: any) {
      console.error('Error fetching stock data:', err);
      setError(err.message || 'An error occurred while fetching stock data');
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(symbol);
  }, [symbol]);

  const handleSelectStock = (newSymbol: string) => {
    setSymbol(newSymbol);
  };

  const handleRetry = () => {
    fetchStockData(symbol);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Stock Valuation Metrics
          </h1>
          <StockSearch onSelectStock={handleSelectStock} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-red-700 dark:text-red-300 font-medium">Error</h3>
            </div>
            <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
            <button 
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {isMockData && !error && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-blue-700 dark:text-blue-300 font-medium">Notice</h3>
            </div>
            <p className="mt-2 text-blue-700 dark:text-blue-300">
              Using sample data for visualization. This represents generated data and does not reflect actual stock performance.
            </p>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            <StockHeader 
              symbol="" 
              name="" 
              price={0} 
              change={0} 
              changePercent={0} 
              marketCap={0} 
              currency="USD" 
              loading={true} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MetricCard 
                  key={i} 
                  title="" 
                  value={0} 
                  loading={true} 
                />
              ))}
            </div>
          </div>
        ) : stockData ? (
          <div className="space-y-6">
            <StockHeader 
              symbol={stockData.symbol} 
              name={stockData.name} 
              price={stockData.price} 
              change={stockData.change} 
              changePercent={stockData.changePercent} 
              marketCap={stockData.marketCap} 
              currency={stockData.currency} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="P/OCF" 
                value={stockData.metrics.pocf.current} 
                historic={{ 
                  avg: stockData.metrics.pocf.avg, 
                  percentile: 50 
                }}
                tooltip="Price to Operating Cash Flow - Lower values may indicate undervaluation" 
                colorInversion={true}
              />
              
              <MetricCard 
                title="P/FCF" 
                value={stockData.metrics.pfcf.current} 
                historic={{ 
                  avg: stockData.metrics.pfcf.avg, 
                  percentile: 50 
                }}
                tooltip="Price to Free Cash Flow - Lower values may indicate undervaluation" 
                colorInversion={true}
              />
              
              <MetricCard 
                title="P/E" 
                value={stockData.metrics.pe.current} 
                historic={{ 
                  avg: stockData.metrics.pe.avg, 
                  percentile: 50 
                }}
                tooltip="Price to Earnings - Lower values may indicate undervaluation" 
                colorInversion={true}
              />
              
              <MetricCard 
                title="PEG Ratio" 
                value={stockData.metrics.peg.current} 
                tooltip="Price/Earnings to Growth Ratio - Values below 1 may indicate undervaluation" 
                colorInversion={true}
              />
              
              <MetricCard 
                title="ROE %" 
                value={stockData.metrics.roe.current} 
                historic={{ 
                  avg: stockData.metrics.roe.avg, 
                  percentile: 50 
                }}
                tooltip="Return on Equity - Higher values indicate better efficiency" 
                isPercentage={true}
              />
              
              <MetricCard 
                title="Debt/Equity %" 
                value={stockData.metrics.debtToEquity.current} 
                historic={{ 
                  avg: stockData.metrics.debtToEquity.avg, 
                  percentile: 50 
                }}
                tooltip="Debt to Equity - Lower values indicate healthier financial position" 
                colorInversion={true}
                isPercentage={true}
              />
              
              <MetricCard 
                title="Profit Margin %" 
                value={stockData.metrics.profitMargin.current} 
                historic={{ 
                  avg: stockData.metrics.profitMargin.avg, 
                  percentile: 50 
                }}
                tooltip="Net Profit Margin - Higher values indicate better profitability" 
                isPercentage={true}
              />
              
              <MetricCard 
                title="Dividend Yield %" 
                value={stockData.metrics.dividendYield.current} 
                historic={{ 
                  avg: stockData.metrics.dividendYield.avg, 
                  percentile: 50 
                }}
                tooltip="Dividend Yield - Higher values indicate better income" 
                isPercentage={true}
              />
            </div>
            
            <Tabs defaultValue="cash-flow" className="w-full mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="cash-flow">Cash Flow Metrics</TabsTrigger>
                <TabsTrigger value="valuation">Valuation Metrics</TabsTrigger>
                <TabsTrigger value="profitability">Profitability</TabsTrigger>
                <TabsTrigger value="debt">Debt & Dividends</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cash-flow" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RatioHistoryChart 
                    data={stockData.historicalData.pocf}
                    title="P/OCF Historical Trend"
                    dataKey="P/OCF"
                    color="#3B82F6"
                    showAverage={true}
                    showMedian={true}
                  />
                  
                  <RatioHistoryChart 
                    data={stockData.historicalData.pfcf}
                    title="P/FCF Historical Trend"
                    dataKey="P/FCF"
                    color="#10B981"
                    showAverage={true}
                    showMedian={true}
                  />
                </div>
                
                <MetricsComparisonChart 
                  data={[
                    { 
                      name: 'P/OCF', 
                      value: stockData.metrics.pocf.current, 
                      benchmark: stockData.metrics.pocf.avg 
                    },
                    { 
                      name: 'P/FCF', 
                      value: stockData.metrics.pfcf.current, 
                      benchmark: stockData.metrics.pfcf.avg 
                    }
                  ]}
                  title="Cash Flow Valuation Metrics"
                  primaryColor="#3B82F6"
                  secondaryColor="#10B981"
                  showBenchmark={true}
                  benchmarkLabel="5-10yr Average"
                />
              </TabsContent>
              
              <TabsContent value="valuation" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RatioHistoryChart 
                    data={stockData.historicalData.pe}
                    title="P/E Historical Trend"
                    dataKey="P/E"
                    color="#EC4899"
                    showAverage={true}
                    showMedian={true}
                  />
                  
                  <RatioHistoryChart 
                    data={stockData.historicalData.pb}
                    title="P/B Historical Trend"
                    dataKey="P/B"
                    color="#8B5CF6"
                    showAverage={true}
                    showMedian={true}
                  />
                </div>
                
                <MetricsComparisonChart 
                  data={[
                    { 
                      name: 'P/E', 
                      value: stockData.metrics.pe.current, 
                      benchmark: stockData.metrics.pe.avg 
                    },
                    { 
                      name: 'P/B', 
                      value: stockData.metrics.pb.current, 
                      benchmark: stockData.metrics.pb.avg 
                    },
                    { 
                      name: 'PEG', 
                      value: stockData.metrics.peg.current
                    }
                  ]}
                  title="Valuation Metrics Comparison"
                  primaryColor="#EC4899"
                  secondaryColor="#8B5CF6"
                  showBenchmark={true}
                  benchmarkLabel="5-10yr Average"
                />
              </TabsContent>
              
              <TabsContent value="profitability" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RatioHistoryChart 
                    data={stockData.historicalData.roe}
                    title="ROE % Historical Trend"
                    dataKey="ROE"
                    color="#F59E0B"
                    showAverage={true}
                    percentageFormat={true}
                  />
                  
                  <RatioHistoryChart 
                    data={stockData.historicalData.profitMargin}
                    title="Profit Margin % Historical Trend"
                    dataKey="Margin"
                    color="#6366F1"
                    showAverage={true}
                    percentageFormat={true}
                  />
                </div>
                
                <MetricsComparisonChart 
                  data={[
                    { 
                      name: 'ROE %', 
                      value: stockData.metrics.roe.current / 100, 
                      benchmark: stockData.metrics.roe.avg / 100 
                    },
                    { 
                      name: 'Profit Margin %', 
                      value: stockData.metrics.profitMargin.current / 100, 
                      benchmark: stockData.metrics.profitMargin.avg / 100 
                    }
                  ]}
                  title="Profitability Metrics"
                  primaryColor="#F59E0B"
                  secondaryColor="#6366F1"
                  showBenchmark={true}
                  benchmarkLabel="5-10yr Average"
                  percentageFormat={true}
                />
              </TabsContent>
              
              <TabsContent value="debt" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RatioHistoryChart 
                    data={stockData.historicalData.debtToEquity}
                    title="Debt to Equity % Trend"
                    dataKey="D/E"
                    color="#EF4444"
                    showAverage={true}
                    percentageFormat={true}
                  />
                  
                  <RatioHistoryChart 
                    data={stockData.historicalData.dividendYield}
                    title="Dividend Yield % Trend"
                    dataKey="Yield"
                    color="#22C55E"
                    showAverage={true}
                    percentageFormat={true}
                  />
                </div>
                
                <MetricsComparisonChart 
                  data={[
                    { 
                      name: 'Debt/Equity %', 
                      value: stockData.metrics.debtToEquity.current / 100, 
                      benchmark: stockData.metrics.debtToEquity.avg / 100 
                    },
                    { 
                      name: 'Dividend Yield %', 
                      value: stockData.metrics.dividendYield.current / 100, 
                      benchmark: stockData.metrics.dividendYield.avg / 100 
                    }
                  ]}
                  title="Debt & Income Metrics"
                  primaryColor="#EF4444"
                  secondaryColor="#22C55E"
                  showBenchmark={true}
                  benchmarkLabel="5-10yr Average"
                  percentageFormat={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
            <p>Search for a stock symbol to see valuation metrics</p>
          </div>
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto mt-16 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Stock Valuation Metrics Dashboard</p>
          <p className="mt-1">Data provided by Yahoo Finance API</p>
        </div>
      </footer>
    </div>
  );
}
