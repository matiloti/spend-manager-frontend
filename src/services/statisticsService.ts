import api from "./api";
import { CategorySummary, TransactionType } from "@/types/models";

// ============ Date Range Types ============

export type DateRangePreset =
  | "THIS_WEEK"
  | "LAST_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_YEAR"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "CUSTOM";

export type Trend = "UP" | "DOWN" | "FLAT";
export type Granularity = "DAILY" | "WEEKLY" | "MONTHLY";
export type CompareWith = "PREVIOUS_PERIOD" | "SAME_PERIOD_LAST_YEAR";

export interface DateRangeInfo {
  startDate: string;
  endDate: string;
  preset: DateRangePreset;
  displayLabel: string;
}

export interface DateRangePresetInfo {
  id: DateRangePreset;
  label: string;
  startDate: string;
  endDate: string;
}

// ============ KPI Types ============

export interface BiggestExpense {
  amount: number;
  description: string;
  date: string;
  category: CategorySummary;
}

export interface KPIs {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  transactionCount: number;
  expenseCount: number;
  incomeCount: number;
  avgDailyExpense: number;
  avgTransactionAmount: number;
  biggestExpense: BiggestExpense | null;
  daysWithExpenses: number;
  daysInRange: number;
}

// ============ Category Breakdown Types ============

export interface CategoryStatistic {
  category: CategorySummary;
  amount: number;
  percentage: number;
  transactionCount: number;
  avgTransactionAmount?: number;
}

export interface CategoryBreakdown {
  expenses: CategoryStatistic[];
  income: CategoryStatistic[];
}

export interface OtherCategories {
  amount: number;
  percentage: number;
  categoryCount: number;
  transactionCount: number;
}

// ============ Comparison Types ============

export interface ComparisonPeriod {
  startDate: string;
  endDate: string;
  displayLabel: string;
}

export interface ComparisonMetric<T = number> {
  current: T;
  previous?: T;
  comparison?: T;
  changeAmount?: number;
  difference?: number;
  changePercentage?: number;
  percentageChange?: number;
  trend: Trend;
}

export interface ComparisonData {
  previousPeriod: ComparisonPeriod;
  expenses: ComparisonMetric;
  income: ComparisonMetric;
  transactionCount: ComparisonMetric<number>;
}

export interface CategoryComparison {
  category: CategorySummary;
  current: number;
  comparison: number;
  difference: number;
  percentageChange: number;
  trend: Trend;
}

// ============ Time Series Types ============

export interface TimeSeriesDataPoint {
  date: string;
  label: string;
  expenses: number;
  income: number;
  netBalance: number;
  expenseCount: number;
  incomeCount: number;
  weekNumber?: number;
  monthName?: string;
}

export interface TimeSeriesSummary {
  totalExpenses: number;
  totalIncome: number;
  avgExpensePerPeriod: number;
  avgIncomePerPeriod: number;
  maxExpenseDay: {
    date: string;
    amount: number;
  };
  maxIncomeDay: {
    date: string;
    amount: number;
  };
}

// ============ Trends Types ============

export interface DailyTrends {
  avgDailyExpense: number;
  avgDailyIncome: number;
  medianDailyExpense: number;
  maxDailyExpense: number;
  minDailyExpense: number;
  daysWithExpenses: number;
  daysWithoutExpenses: number;
  streakWithoutExpenses: number;
}

export interface WeeklyTrends {
  avgWeeklyExpense: number;
  avgWeeklyIncome: number;
  bestWeek: {
    startDate: string;
    endDate: string;
    netBalance: number;
  };
  worstWeek: {
    startDate: string;
    endDate: string;
    netBalance: number;
  };
}

export interface TopExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: CategorySummary;
}

export interface RecurringDescription {
  description: string;
  count: number;
  totalAmount: number;
  avgAmount: number;
}

export interface SpendingPatterns {
  mostExpensiveDayOfWeek: {
    dayOfWeek: string;
    avgAmount: number;
  };
  leastExpensiveDayOfWeek: {
    dayOfWeek: string;
    avgAmount: number;
  };
  topRecurringDescription: RecurringDescription[];
}

// ============ Response Types ============

export interface StatisticsOverviewResponse {
  dateRange: DateRangeInfo;
  account: { id: string; name: string } | null;
  kpis: KPIs;
  categoryBreakdown: CategoryBreakdown;
  comparison: ComparisonData;
}

export interface CategoryBreakdownResponse {
  dateRange: DateRangeInfo;
  type: TransactionType;
  totalAmount: number;
  categories: CategoryStatistic[];
  otherCategories: OtherCategories | null;
}

export interface TimeSeriesResponse {
  dateRange: DateRangeInfo;
  granularity: Granularity;
  dataPoints: TimeSeriesDataPoint[];
  summary: TimeSeriesSummary;
}

export interface ComparisonResponse {
  currentPeriod: ComparisonPeriod;
  comparisonPeriod: ComparisonPeriod;
  compareWith: CompareWith;
  metrics: {
    expenses: ComparisonMetric;
    income: ComparisonMetric;
    netBalance: ComparisonMetric;
    transactionCount: ComparisonMetric<number>;
    avgDailyExpense: ComparisonMetric;
  };
  categoryComparison: CategoryComparison[];
}

export interface CategoryTrendData {
  category: CategorySummary;
  data: number[];
  total: number;
  average: number;
  trend: Trend;
  rank: number;
}

export interface CategoryTrendResponse {
  granularity: Granularity;
  type: TransactionType;
  periods: Array<{
    date: string;
    label: string;
  }>;
  categories: CategoryTrendData[];
  totals: {
    data: number[];
    overall: number;
    average: number;
  };
}

export interface TrendsResponse {
  dateRange: DateRangeInfo;
  dailyTrends: DailyTrends;
  weeklyTrends: WeeklyTrends;
  topExpenses: TopExpense[];
  patterns: SpendingPatterns;
}

export interface PresetsResponse {
  presets: DateRangePresetInfo[];
  today: string;
}

// ============ Request Types ============

export interface StatisticsRequestParams {
  accountId?: string;
  preset?: DateRangePreset;
  startDate?: string;
  endDate?: string;
}

export interface CategoryStatisticsParams extends StatisticsRequestParams {
  type?: TransactionType;
  limit?: number;
}

export interface TimeSeriesParams extends StatisticsRequestParams {
  granularity?: Granularity;
}

export interface ComparisonParams extends StatisticsRequestParams {
  compareWith?: CompareWith;
}

export interface CategoryTrendParams {
  accountId?: string;
  type?: TransactionType;
  periods?: number;
  granularity?: Granularity;
  categoryLimit?: number;
}

// ============ Service ============

export const statisticsService = {
  /**
   * Get statistics overview (main endpoint for page load)
   */
  getOverview: async (
    params?: StatisticsRequestParams
  ): Promise<StatisticsOverviewResponse> => {
    const response = await api.get<StatisticsOverviewResponse>(
      "/statistics/overview",
      { params }
    );
    return response.data;
  },

  /**
   * Get category breakdown for pie/donut chart
   */
  getCategories: async (
    params?: CategoryStatisticsParams
  ): Promise<CategoryBreakdownResponse> => {
    const response = await api.get<CategoryBreakdownResponse>(
      "/statistics/categories",
      { params }
    );
    return response.data;
  },

  /**
   * Get time series data for line/bar charts
   */
  getTimeSeries: async (
    params?: TimeSeriesParams
  ): Promise<TimeSeriesResponse> => {
    const response = await api.get<TimeSeriesResponse>(
      "/statistics/time-series",
      { params }
    );
    return response.data;
  },

  /**
   * Get period comparison data
   */
  getComparison: async (
    params?: ComparisonParams
  ): Promise<ComparisonResponse> => {
    const response = await api.get<ComparisonResponse>(
      "/statistics/comparison",
      { params }
    );
    return response.data;
  },

  /**
   * Get category trend data over multiple periods
   */
  getCategoryTrend: async (
    params?: CategoryTrendParams
  ): Promise<CategoryTrendResponse> => {
    const response = await api.get<CategoryTrendResponse>(
      "/statistics/categories/trend",
      { params }
    );
    return response.data;
  },

  /**
   * Get spending trends and patterns
   */
  getTrends: async (
    params?: StatisticsRequestParams
  ): Promise<TrendsResponse> => {
    const response = await api.get<TrendsResponse>("/statistics/trends", {
      params,
    });
    return response.data;
  },

  /**
   * Get available date range presets
   */
  getPresets: async (): Promise<PresetsResponse> => {
    const response = await api.get<PresetsResponse>("/statistics/presets");
    return response.data;
  },
};

export default statisticsService;
