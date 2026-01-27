import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, Wallet } from "lucide-react-native";
import { AccountSelector } from "@/components/account/AccountSelector";
import {
  WeekNavigator,
  BalanceBar,
  DailySummaryCard,
  MonthlySummaryCard,
  TransactionQuickView,
} from "@/components/home";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { EmptyState } from "@/components/layout/EmptyState";
import {
  useDailySummary,
  useWeekSummary,
  useMonthlySummary,
} from "@/hooks/api/useHome";
import { useActiveAccount } from "@/hooks/api/useAccounts";
import { useHomeStore } from "@/stores/homeStore";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionSummary } from "@/services/homeService";

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Global state
  const {
    selectedDate,
    setSelectedDate,
    isMonthlyExpanded,
    toggleMonthlyExpanded,
  } = useHomeStore();

  // Fetch active account
  const {
    data: activeAccount,
    isLoading: accountLoading,
    error: accountError,
  } = useActiveAccount();

  // Fetch daily summary for selected date
  const {
    data: dailyData,
    isLoading: dailyLoading,
    error: dailyError,
    refetch: refetchDaily,
  } = useDailySummary(
    { date: selectedDate },
    { enabled: !!activeAccount }
  );

  // Fetch week summary
  const {
    data: weekData,
    isLoading: weekLoading,
    error: weekError,
    refetch: refetchWeek,
  } = useWeekSummary(
    { date: selectedDate },
    { enabled: !!activeAccount }
  );

  // Derive month from selected date for monthly summary
  const selectedMonth = useMemo(() => {
    return selectedDate.substring(0, 7); // YYYY-MM
  }, [selectedDate]);

  // Fetch monthly summary
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    refetch: refetchMonthly,
  } = useMonthlySummary(
    { month: selectedMonth },
    { enabled: !!activeAccount }
  );

  // Combined loading state (only for initial load)
  const isInitialLoading = accountLoading || (dailyLoading && !dailyData);
  const hasError = accountError || dailyError || weekError;

  // Refreshing state
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchDaily(), refetchWeek(), refetchMonthly()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchDaily, refetchWeek, refetchMonthly]);

  // Navigation handlers
  const handlePreviousWeek = useCallback(() => {
    if (weekData?.navigation.previousWeekStart) {
      setSelectedDate(weekData.navigation.previousWeekStart);
    }
  }, [weekData, setSelectedDate]);

  const handleNextWeek = useCallback(() => {
    if (weekData?.navigation.nextWeekStart && weekData.navigation.canGoNext) {
      setSelectedDate(weekData.navigation.nextWeekStart);
    }
  }, [weekData, setSelectedDate]);

  const handleSelectDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const handleTransactionPress = useCallback(
    (transaction: TransactionSummary) => {
      router.push(`/transactions/${transaction.id}`);
    },
    [router]
  );

  const handleAddTransaction = useCallback(() => {
    router.push("/transactions/create");
  }, [router]);

  const handleCreateAccount = useCallback(() => {
    router.push("/accounts/create");
  }, [router]);

  // Render transaction item
  const renderTransaction = useCallback(
    ({ item }: { item: TransactionSummary }) => (
      <TransactionQuickView
        transaction={item}
        onPress={() => handleTransactionPress(item)}
        testID={`transaction-${item.id}`}
      />
    ),
    [handleTransactionPress]
  );

  const keyExtractor = useCallback((item: TransactionSummary) => item.id, []);

  // No active account state
  if (!accountLoading && !activeAccount) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <EmptyState
          icon={<Wallet size={48} color="#6B7280" />}
          title="No Account Selected"
          description="Create your first account to start tracking your spending."
          actionLabel="Create Account"
          onAction={handleCreateAccount}
        />
      </SafeAreaView>
    );
  }

  // Loading state
  if (isInitialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <LoadingState message="Loading your finances..." />
      </SafeAreaView>
    );
  }

  // Error state
  if (hasError) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ErrorState
          title="Unable to load data"
          message="Please check your connection and try again."
          onRetry={handleRefresh}
        />
      </SafeAreaView>
    );
  }

  // Compute balance bar data from daily data
  const balanceBarData = dailyData
    ? {
        income: dailyData.balance.totalIncome,
        expenses: dailyData.balance.totalExpenses,
        expensePercentage:
          dailyData.balance.totalIncome > 0
            ? (dailyData.balance.totalExpenses / dailyData.balance.totalIncome) * 100
            : dailyData.balance.totalExpenses > 0
            ? 100
            : 0,
        isOverspent:
          dailyData.balance.totalExpenses > dailyData.balance.totalIncome,
      }
    : null;

  // Transaction list header component
  const ListHeader = () => (
    <>
      {/* Balance Bar */}
      {balanceBarData && (
        <BalanceBar
          income={balanceBarData.income}
          expenses={balanceBarData.expenses}
          expensePercentage={balanceBarData.expensePercentage}
          isOverspent={balanceBarData.isOverspent}
          testID="balance-bar"
        />
      )}

      {/* Daily Summary Card */}
      {dailyData && (
        <View className="mb-4">
          <DailySummaryCard
            date={dailyData.date}
            balance={dailyData.balance}
            testID="daily-summary"
          />
        </View>
      )}

      {/* Monthly Summary Card */}
      {monthlyData && (
        <View className="mb-4">
          <MonthlySummaryCard
            monthName={monthlyData.monthName}
            summary={monthlyData.summary}
            comparison={monthlyData.comparison}
            topCategories={monthlyData.topCategories}
            isExpanded={isMonthlyExpanded}
            onToggleExpand={toggleMonthlyExpanded}
            testID="monthly-summary"
          />
        </View>
      )}

      {/* Transactions header */}
      {dailyData && dailyData.transactions.length > 0 && (
        <View className="px-4 py-2">
          <Text className="text-lg font-bold text-gray-900">
            Today&apos;s Transactions
          </Text>
        </View>
      )}
    </>
  );

  // Empty transactions state
  const EmptyTransactions = () => (
    <View className="px-4 py-8 items-center">
      <Text className="text-gray-400 text-center">
        No transactions for this day
      </Text>
      <Pressable
        onPress={handleAddTransaction}
        className="mt-4 bg-primary-50 px-4 py-2 rounded-lg"
      >
        <Text className="text-primary-600 font-medium">Add Transaction</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header with Account Selector */}
      <View className="bg-white px-4 pt-2 pb-1 border-b border-gray-100">
        <AccountSelector
          activeAccount={activeAccount}
          onCreateAccount={handleCreateAccount}
        />
      </View>

      {/* Week Navigator */}
      {weekData && (
        <WeekNavigator
          days={weekData.days}
          weekStart={weekData.weekStart}
          weekEnd={weekData.weekEnd}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          canGoNext={weekData.navigation.canGoNext}
          testID="week-navigator"
        />
      )}

      {/* Main content - Transaction list with header */}
      <FlatList
        data={dailyData?.transactions || []}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyTransactions}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
          />
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-100 mx-4" />
        )}
      />

      {/* FAB for adding transactions */}
      <Pressable
        onPress={handleAddTransaction}
        className="absolute bottom-24 right-4 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg active:bg-primary-600"
        accessibilityLabel="Add transaction"
        accessibilityRole="button"
        testID="add-transaction-fab"
      >
        <Plus size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}
