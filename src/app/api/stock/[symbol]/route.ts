import { NextResponse } from 'next/server';
import { getStockSummary, getStockFinancials, getHistoricalData } from '@/lib/api';
import { processStockData } from '@/lib/stockDataProcessor';

// Mock data for development/fallback
const mockSummaryData = {
  price: {
    symbol: "MSFT",
    shortName: "Microsoft Corporation",
    regularMarketPrice: { raw: 425.22 },
    regularMarketChange: { raw: 2.34 },
    regularMarketChangePercent: { raw: 0.55 },
    marketCap: { raw: 3160000000000 },
    currency: "USD"
  },
  defaultKeyStatistics: {
    sharesOutstanding: { raw: 7420000000 },
    earningsGrowth: { raw: 0.12 }
  },
  summaryDetail: {
    dividendRate: { raw: 3.00 }
  }
};

const mockFinancialsData = {
  timeSeries: {
    annualEarnings: [
      { reportedEPS: { raw: 11.33 } }
    ]
  },
  cashflowStatementHistory: {
    cashflowStatements: [
      { 
        totalCashFromOperatingActivities: { raw: 108000000000 },
        freeCashFlow: { raw: 59000000000 }
      }
    ]
  },
  balanceSheetHistory: {
    balanceSheetStatements: [
      {
        totalStockholderEquity: { raw: 166000000000 },
        shortLongTermDebt: { raw: 3000000000 },
        longTermDebt: { raw: 45000000000 }
      }
    ]
  },
  incomeStatementHistory: {
    incomeStatementHistory: [
      {
        netIncome: { raw: 72000000000 },
        totalRevenue: { raw: 212000000000 }
      }
    ]
  }
};

const mockHistoricalData = {
  prices: []
};

export async function GET(
  _request: Request,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase();
    console.log(`API Route: Processing request for symbol ${symbol}`);

    let summaryData, financialsData, historicalData;
    let usedMockData = false;

    try {
      // Try to fetch real data
      [summaryData, financialsData, historicalData] = await Promise.all([
        getStockSummary(symbol),
        getStockFinancials(symbol),
        getHistoricalData(symbol, '1mo', '10y')
      ]);
    } catch (apiError) {
      console.error("API call failed, using mock data:", apiError);
      // Fall back to mock data
      summaryData = JSON.parse(JSON.stringify(mockSummaryData));
      summaryData.price.symbol = symbol;
      summaryData.price.shortName = `${symbol} Corporation`;
      financialsData = mockFinancialsData;
      historicalData = mockHistoricalData;
      usedMockData = true;
    }

    // Process the data
    const processedData = await processStockData(summaryData, financialsData, historicalData);

    if (!processedData) {
      return NextResponse.json(
        { error: 'Failed to process stock data' },
        { status: 500 }
      );
    }

    // Add a flag to indicate if we used mock data
    return NextResponse.json({
      ...processedData,
      _usedMockData: usedMockData
    });
  } catch (error: any) {
    console.error(`Error processing data for ${params.symbol}:`, error);

    return NextResponse.json(
      { error: error.message || 'An error occurred while processing stock data' },
      { status: 500 }
    );
  }
}