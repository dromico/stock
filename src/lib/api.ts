import axios from 'axios';

const baseUrl = 'https://yh-finance.p.rapidapi.com';

// Use a function to create the API instance so it reads the environment variables when needed
// This is better for client-side code where environment variables might not be available immediately
const createApiInstance = () => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'yh-finance.p.rapidapi.com',
    },
  });
};

interface StockSummary {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  marketCap: number;
  currency: string;
}

interface FinancialData {
  operatingCashflow: number;
  freeCashflow: number;
  totalRevenue: number;
  totalDebt: number;
  totalCash: number;
  ebitda: number;
  netIncome: number;
  earningsPerShare: number;
  profitMargins: number;
  returnOnEquity: number;
  debtToEquity: number;
  dividendYield?: number;
}

interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface StockData {
  summary: StockSummary;
  financials: FinancialData[];
  historicalPrices: HistoricalData[];
}

export async function getStockSummary(symbol: string): Promise<any> {
  try {
    const apiInstance = createApiInstance();
    console.log('Making API call for summary data of:', symbol);
    const response = await apiInstance.get('/stock/v2/get-summary', {
      params: {
        symbol,
        region: 'US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock summary:', error);
    throw error;
  }
}

export async function getStockFinancials(symbol: string): Promise<any> {
  try {
    const apiInstance = createApiInstance();
    console.log('Making API call for financial data of:', symbol);
    const response = await apiInstance.get('/stock/v2/get-financials', {
      params: {
        symbol,
        region: 'US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock financials:', error);
    throw error;
  }
}

export async function getHistoricalData(symbol: string, interval: string = '1mo', range: string = '10y'): Promise<any> {
  try {
    const apiInstance = createApiInstance();
    console.log('Making API call for historical data of:', symbol);
    const response = await apiInstance.get('/stock/v3/get-historical-data', {
      params: {
        symbol,
        region: 'US',
        interval,
        range,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

export async function searchStocks(query: string): Promise<any> {
  try {
    const apiInstance = createApiInstance();
    console.log('Making API call for stock search:', query);
    const response = await apiInstance.get('/auto-complete', {
      params: {
        q: query,
        region: 'US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
}