import api from "./api";

// Types matching the home API spec

export interface AccountSummary {
  id: string;
  name: string;
  colorCode?: string;
  isActive?: boolean;
}

export interface CategorySummary {
  id: string;
  name: string;
  icon: string;
  colorCode: string;
}

export interface TransactionSummary {
  id: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  category: CategorySummary;
  description: string | null;
  time: string;
  tagCount: number;
}

export interface DailyBalance {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  expenseCount?: number;
  incomeCount?: number;
}

export interface DailySummaryResponse {
  date: string;
  dayOfWeek: string;
  account: AccountSummary;
  balance: DailyBalance;
  transactions: TransactionSummary[];
  hasMore: boolean;
}

export interface DaySummary {
  date: string;
  dayOfWeek: string;
  hasTransactions: boolean;
  expenseTotal: number;
  incomeTotal: number;
  transactionCount: number;
}

export interface WeekNavigation {
  previousWeekStart: string;
  nextWeekStart: string | null;
  canGoNext: boolean;
}

export interface WeekSummary {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  transactionCount: number;
}

export interface WeekSummaryResponse {
  weekStart: string;
  weekEnd: string;
  account: AccountSummary;
  days: DaySummary[];
  weekSummary: WeekSummary;
  navigation: WeekNavigation;
}

export interface MonthlySummary {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  expenseCount: number;
  incomeCount: number;
  daysWithTransactions: number;
}

export interface MonthComparison {
  previousMonth: string;
  expenseChange: number;
  expenseChangeAmount: number;
  incomeChange: number;
  incomeChangeAmount: number;
}

export interface TopCategory {
  category: CategorySummary;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlySummaryResponse {
  month: string;
  monthName: string;
  account: AccountSummary;
  summary: MonthlySummary;
  comparison: MonthComparison;
  topCategories: TopCategory[];
}

export interface BalanceBarDisplayText {
  expenseLabel: string;
  remainingLabel?: string;
  overageLabel?: string;
}

export interface BalanceBarResponse {
  date: string;
  expenses: number;
  income: number;
  expensePercentage: number;
  remainingPercentage?: number;
  overagePercentage?: number;
  isOverspent: boolean;
  netAmount: number;
  displayText: BalanceBarDisplayText;
}

export interface HomeStateResponse {
  account: AccountSummary;
  accounts: AccountSummary[];
  daily: {
    date: string;
    balance: DailyBalance;
    transactions: TransactionSummary[];
  };
  week: {
    weekStart: string;
    weekEnd: string;
    days: DaySummary[];
  };
  monthly: {
    month: string;
    summary: {
      totalExpenses: number;
      totalIncome: number;
      netBalance: number;
    };
  };
  balanceBar: {
    expenses: number;
    income: number;
    expensePercentage: number;
    isOverspent: boolean;
  };
}

// Query params
export interface DailySummaryParams {
  accountId?: string;
  date?: string;
  includeTransactions?: boolean;
  transactionLimit?: number;
}

export interface WeekSummaryParams {
  accountId?: string;
  date?: string;
}

export interface MonthlySummaryParams {
  accountId?: string;
  month?: string;
  includeTopCategories?: boolean;
  categoryLimit?: number;
}

export interface BalanceBarParams {
  accountId?: string;
  date?: string;
}

export interface HomeStateParams {
  accountId?: string;
  date?: string;
}

const homeService = {
  /**
   * Get daily summary for home screen
   */
  getDailySummary: async (
    params?: DailySummaryParams
  ): Promise<DailySummaryResponse> => {
    const response = await api.get("/home/daily", { params });
    return response.data;
  },

  /**
   * Get week summary for week navigation
   */
  getWeekSummary: async (
    params?: WeekSummaryParams
  ): Promise<WeekSummaryResponse> => {
    const response = await api.get("/home/week", { params });
    return response.data;
  },

  /**
   * Get monthly summary for collapsible card
   */
  getMonthlySummary: async (
    params?: MonthlySummaryParams
  ): Promise<MonthlySummaryResponse> => {
    const response = await api.get("/home/monthly", { params });
    return response.data;
  },

  /**
   * Get balance bar data
   */
  getBalanceBar: async (
    params?: BalanceBarParams
  ): Promise<BalanceBarResponse> => {
    const response = await api.get("/home/balance-bar", { params });
    return response.data;
  },

  /**
   * Get complete home screen state (combined endpoint)
   */
  getHomeState: async (
    params?: HomeStateParams
  ): Promise<HomeStateResponse> => {
    const response = await api.get("/home/state", { params });
    return response.data;
  },
};

export default homeService;
