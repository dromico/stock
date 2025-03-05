import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = 'USD', decimals: number = 2): string {
  if (value === undefined || isNaN(value)) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  if (value === undefined || isNaN(value)) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatLargeNumber(value: number): string {
  if (value === undefined || isNaN(value)) return 'N/A';
  
  if (Math.abs(value) >= 1e12) {
    return formatNumber(value / 1e12, 2) + 'T';
  } else if (Math.abs(value) >= 1e9) {
    return formatNumber(value / 1e9, 2) + 'B';
  } else if (Math.abs(value) >= 1e6) {
    return formatNumber(value / 1e6, 2) + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return formatNumber(value / 1e3, 2) + 'K';
  }
  
  return formatNumber(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  if (value === undefined || isNaN(value)) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function calculatePOCF(price: number, operatingCashFlow: number, sharesOutstanding: number): number {
  if (!price || !operatingCashFlow || !sharesOutstanding || operatingCashFlow <= 0) {
    return NaN;
  }
  const operatingCashFlowPerShare = operatingCashFlow / sharesOutstanding;
  return price / operatingCashFlowPerShare;
}

export function calculatePFCF(price: number, freeCashFlow: number, sharesOutstanding: number): number {
  if (!price || !freeCashFlow || !sharesOutstanding || freeCashFlow <= 0) {
    return NaN;
  }
  const freeCashFlowPerShare = freeCashFlow / sharesOutstanding;
  return price / freeCashFlowPerShare;
}

export function calculatePEG(priceToEarnings: number, earningsGrowthRate: number): number {
  if (!priceToEarnings || !earningsGrowthRate || earningsGrowthRate <= 0) {
    return NaN;
  }
  return priceToEarnings / earningsGrowthRate;
}

export function calculateAverage(values: number[]): number {
  if (!values || values.length === 0) {
    return NaN;
  }
  const validValues = values.filter(v => !isNaN(v));
  if (validValues.length === 0) {
    return NaN;
  }
  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

export function calculateMedian(values: number[]): number {
  if (!values || values.length === 0) {
    return NaN;
  }
  const validValues = values.filter(v => !isNaN(v));
  if (validValues.length === 0) {
    return NaN;
  }
  const sorted = [...validValues].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function calculateCAGR(beginValue: number, endValue: number, years: number): number {
  if (!beginValue || !endValue || !years || beginValue <= 0 || endValue <= 0 || years <= 0) {
    return NaN;
  }
  return Math.pow(endValue / beginValue, 1 / years) - 1;
}

export function getPercentileRank(value: number, array: number[]): number {
  if (!array || array.length === 0 || isNaN(value)) {
    return NaN;
  }
  
  const validValues = array.filter(v => !isNaN(v));
  if (validValues.length === 0) {
    return NaN;
  }
  
  const sorted = [...validValues].sort((a, b) => a - b);
  const position = sorted.findIndex(v => v >= value);
  
  if (position === -1) {
    return 1; // Above all values
  }
  
  return position / sorted.length;
}
