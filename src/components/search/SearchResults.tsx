import React, { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { Search, AlertCircle } from "lucide-react-native";
import { Transaction, TransactionListSummary } from "@/types/models";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import { formatCurrency } from "@/utils/formatters";

interface SearchResultsProps {
  transactions: Transaction[];
  summary?: TransactionListSummary;
  isLoading: boolean;
  isRefreshing?: boolean;
  error?: { message: string } | null;
  hasSearched: boolean;
  searchQuery: string;
  onTransactionPress: (transaction: Transaction) => void;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  testID?: string;
}

export function SearchResults({
  transactions,
  summary,
  isLoading,
  isRefreshing = false,
  error,
  hasSearched,
  searchQuery,
  onTransactionPress,
  onLoadMore,
  onRefresh,
  hasNextPage,
  isFetchingNextPage,
  testID,
}: SearchResultsProps) {
  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <View className="px-4 mb-3">
        <TransactionCard
          transaction={item}
          onPress={() => onTransactionPress(item)}
          showDate
          testID={`search-result-${item.id}`}
        />
      </View>
    ),
    [onTransactionPress]
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }, [isFetchingNextPage]);

  const keyExtractor = useCallback(
    (item: Transaction) => item.id,
    []
  );

  // Initial state - no search yet
  if (!hasSearched && !isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center p-8"
        testID={testID ? `${testID}-initial` : undefined}
      >
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Search size={32} color="#9CA3AF" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
          Search Transactions
        </Text>
        <Text className="text-gray-500 text-center">
          Enter a search term or use filters to find transactions
        </Text>
      </View>
    );
  }

  // Loading state
  if (isLoading && !isRefreshing && transactions.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center p-8"
        testID={testID ? `${testID}-loading` : undefined}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-500 mt-4">Searching...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        className="flex-1 items-center justify-center p-8"
        testID={testID ? `${testID}-error` : undefined}
      >
        <View className="w-16 h-16 rounded-full bg-error-light items-center justify-center mb-4">
          <AlertCircle size={32} color="#DC2626" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-500 text-center">
          {error.message || "Unable to load search results. Please try again."}
        </Text>
      </View>
    );
  }

  // Empty state - no results
  if (hasSearched && transactions.length === 0) {
    return (
      <View
        className="flex-1 items-center justify-center p-8"
        testID={testID ? `${testID}-empty` : undefined}
      >
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
          <Search size={32} color="#9CA3AF" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
          No Results Found
        </Text>
        <Text className="text-gray-500 text-center">
          {searchQuery
            ? `No transactions match "${searchQuery}"`
            : "No transactions match the selected filters"}
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Try adjusting your search or filters
        </Text>
      </View>
    );
  }

  // Results list
  return (
    <View className="flex-1" testID={testID}>
      {/* Summary header */}
      {summary && transactions.length > 0 && (
        <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">
              {summary.transactionCount}{" "}
              {summary.transactionCount === 1 ? "result" : "results"}
            </Text>
            <View className="flex-row items-center gap-4">
              {summary.totalExpenses > 0 && (
                <Text className="text-sm text-expense font-medium">
                  -{formatCurrency(summary.totalExpenses)}
                </Text>
              )}
              {summary.totalIncome > 0 && (
                <Text className="text-sm text-income font-medium">
                  +{formatCurrency(summary.totalIncome)}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingVertical: 12 }}
        onEndReached={hasNextPage ? onLoadMore : undefined}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        testID={testID ? `${testID}-list` : undefined}
      />
    </View>
  );
}

export default SearchResults;
