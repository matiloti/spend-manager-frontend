import React, { useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, RefreshControl, SafeAreaView } from "react-native";
import { Hash, Calendar } from "lucide-react-native";
import { useStatisticsOverview, useTimeSeries } from "@/hooks/api/useStatistics";
import { useAccounts } from "@/hooks/api/useAccounts";
import { DateRangePreset } from "@/services/statisticsService";
import { formatCurrency } from "@/utils/formatters";
import {
  DateRangeSelector,
  DateRangeSelectorRef,
  AccountFilter,
  KPICard,
  SecondaryKPICard,
  ComparisonCard,
  CategoryDonutChart,
  TimeSeriesChart,
  TopCategoriesList,
  StatisticsEmptyState,
  StatisticsErrorState,
  StatisticsSkeleton,
} from "@/components/statistics";

export default function StatisticsScreen() {
  // Ref for DateRangeSelector to allow opening custom picker from empty state
  const dateRangeSelectorRef = useRef<DateRangeSelectorRef>(null);

  // Filter state
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("THIS_MONTH");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [customStartDate, setCustomStartDate] = useState<string | undefined>();
  const [customEndDate, setCustomEndDate] = useState<string | undefined>();

  // Build query params
  const queryParams = {
    preset: selectedPreset,
    accountId: selectedAccountId || undefined,
    ...(selectedPreset === "CUSTOM" && customStartDate && customEndDate
      ? { startDate: customStartDate, endDate: customEndDate }
      : {}),
  };

  // Data fetching
  const {
    data: overview,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    refetch: refetchOverview,
  } = useStatisticsOverview(queryParams);

  const {
    data: timeSeries,
    isLoading: isLoadingTimeSeries,
    refetch: refetchTimeSeries,
  } = useTimeSeries(queryParams);

  const { data: accountsData } = useAccounts({ includeBalance: false });

  const accounts = accountsData?.content || [];

  // Refresh handler
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchOverview(), refetchTimeSeries()]);
    setRefreshing(false);
  }, [refetchOverview, refetchTimeSeries]);

  // Custom date range handler
  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  // Handler for "Change Date Range" button in empty state
  const handleChangeDateRange = useCallback(() => {
    dateRangeSelectorRef.current?.openCustomPicker();
  }, []);

  // Loading state
  if (isLoadingOverview && !overview) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary">
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-text-primary">Statistics</Text>
        </View>
        <StatisticsSkeleton />
      </SafeAreaView>
    );
  }

  // Error state
  if (isErrorOverview) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary">
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-text-primary">Statistics</Text>
        </View>
        <StatisticsErrorState onRetry={refetchOverview} />
      </SafeAreaView>
    );
  }

  // Empty state (no data for period)
  const hasData = overview && overview.kpis.transactionCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-text-primary">Statistics</Text>
        {overview?.dateRange && (
          <Text className="text-sm text-text-secondary mt-1">
            {overview.dateRange.displayLabel}
          </Text>
        )}
      </View>

      {/* Filters (sticky) */}
      <View className="px-4 bg-bg-primary">
        <DateRangeSelector
          ref={dateRangeSelectorRef}
          selectedPreset={selectedPreset}
          onPresetChange={setSelectedPreset}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onCustomDateChange={handleCustomDateChange}
          testID="statistics-date-range"
        />

        <View className="mt-4">
          <AccountFilter
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountChange={setSelectedAccountId}
            testID="statistics-account-filter"
          />
        </View>
      </View>

      {!hasData ? (
        <StatisticsEmptyState
          onChangeDateRange={handleChangeDateRange}
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Primary KPI Cards */}
          <View className="pt-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              <KPICard
                label="Total Expenses"
                amount={overview.kpis.totalExpenses}
                type="expense"
                trend={overview.comparison.expenses.trend}
                trendPercentage={overview.comparison.expenses.changePercentage}
                testID="statistics-kpi-expenses"
              />
              <KPICard
                label="Total Income"
                amount={overview.kpis.totalIncome}
                type="income"
                trend={overview.comparison.income.trend}
                trendPercentage={overview.comparison.income.changePercentage}
                testID="statistics-kpi-income"
              />
              <KPICard
                label="Net Balance"
                amount={overview.kpis.netBalance}
                type="balance"
                testID="statistics-kpi-balance"
              />
            </ScrollView>
          </View>

          {/* Secondary KPI Cards */}
          <View className="px-4 pt-4 flex-row gap-3">
            <SecondaryKPICard
              icon={<Hash size={20} color="#6B7280" />}
              label="Transactions"
              value={overview.kpis.transactionCount}
              testID="statistics-kpi-count"
            />
            <SecondaryKPICard
              icon={<Calendar size={20} color="#6B7280" />}
              label="Avg Daily"
              value={formatCurrency(overview.kpis.avgDailyExpense)}
              testID="statistics-kpi-avg-daily"
            />
          </View>

          {/* Comparison Cards */}
          <View className="px-4 pt-6">
            <Text className="text-lg font-semibold text-text-primary mb-3">
              vs {overview.comparison.previousPeriod.displayLabel}
            </Text>
            <View className="flex-row gap-3">
              <ComparisonCard
                title="Expenses"
                type="expense"
                current={overview.comparison.expenses.current}
                previous={overview.comparison.expenses.previous || 0}
                trend={overview.comparison.expenses.trend}
                changePercentage={
                  overview.comparison.expenses.changePercentage || 0
                }
                changeAmount={overview.comparison.expenses.changeAmount || 0}
                testID="statistics-comparison-expenses"
              />
              <ComparisonCard
                title="Income"
                type="income"
                current={overview.comparison.income.current}
                previous={overview.comparison.income.previous || 0}
                trend={overview.comparison.income.trend}
                changePercentage={
                  overview.comparison.income.changePercentage || 0
                }
                changeAmount={overview.comparison.income.changeAmount || 0}
                testID="statistics-comparison-income"
              />
            </View>
          </View>

          {/* Category Breakdown */}
          {overview.categoryBreakdown.expenses.length > 0 && (
            <View className="px-4 pt-6">
              <Text className="text-lg font-semibold text-text-primary mb-3">
                Spending by Category
              </Text>
              <View className="bg-bg-elevated rounded-card shadow-card">
                <CategoryDonutChart
                  categories={overview.categoryBreakdown.expenses}
                  totalAmount={overview.kpis.totalExpenses}
                  testID="statistics-donut-chart"
                />
              </View>
            </View>
          )}

          {/* Time Series Chart */}
          {timeSeries && timeSeries.dataPoints.length > 0 && (
            <View className="px-4 pt-6">
              <Text className="text-lg font-semibold text-text-primary mb-3">
                Spending Over Time
              </Text>
              <TimeSeriesChart
                dataPoints={timeSeries.dataPoints}
                granularity={timeSeries.granularity}
                testID="statistics-timeseries-chart"
              />
            </View>
          )}

          {/* Top Categories List */}
          {overview.categoryBreakdown.expenses.length > 0 && (
            <View className="px-4 pt-6">
              <Text className="text-lg font-semibold text-text-primary mb-3">
                Top Spending Categories
              </Text>
              <TopCategoriesList
                categories={overview.categoryBreakdown.expenses.slice(0, 5)}
                testID="statistics-top-categories"
              />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
