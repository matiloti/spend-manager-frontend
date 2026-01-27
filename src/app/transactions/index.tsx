import React, { useCallback, useState, useMemo } from "react";
import { View, FlatList, RefreshControl, Alert, Text } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Receipt } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/layout/EmptyState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import {
  TransactionFilter,
  TransactionFilters,
} from "@/components/transaction/TransactionFilter";
import { DeleteTransactionModal } from "@/components/transaction/DeleteTransactionModal";
import {
  useInfiniteTransactions,
  useDeleteTransaction,
} from "@/hooks/api/useTransactions";
import { useAccountStore } from "@/stores/accountStore";
import { Transaction } from "@/types/models";
import { formatDateISO, formatCurrency } from "@/utils/formatters";

export default function TransactionListScreen() {
  const router = useRouter();
  const { activeAccountId } = useAccountStore();
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [deleteModalTransaction, setDeleteModalTransaction] =
    useState<Transaction | null>(null);

  const queryParams = useMemo(
    () => ({
      accountId: activeAccountId || "",
      type: filters.type,
      startDate: filters.startDate
        ? formatDateISO(filters.startDate)
        : undefined,
      endDate: filters.endDate ? formatDateISO(filters.endDate) : undefined,
      categoryId: filters.categoryId,
      tagIds: filters.tagIds?.join(","),
      size: 20,
      sort: "date,desc",
    }),
    [activeAccountId, filters]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTransactions(queryParams, { enabled: !!activeAccountId });

  const deleteMutation = useDeleteTransaction();

  // Flatten all pages into a single array
  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.content) || [],
    [data]
  );

  // Get summary from the first page
  const summary = data?.pages[0]?.summary;

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push(`/transactions/${transaction.id}`);
    },
    [router]
  );

  const handleTransactionLongPress = useCallback(
    (transaction: Transaction) => {
      Alert.alert(
        transaction.category?.name || "Transaction",
        "What would you like to do?",
        [
          {
            text: "Edit",
            onPress: () => router.push(`/transactions/${transaction.id}/edit`),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => setDeleteModalTransaction(transaction),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    },
    [router]
  );

  const handleCreateTransaction = useCallback(() => {
    router.push("/transactions/create");
  }, [router]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModalTransaction) return;

    try {
      await deleteMutation.mutateAsync(deleteModalTransaction.id);
      setDeleteModalTransaction(null);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to delete transaction. Please try again."
      );
    }
  }, [deleteModalTransaction, deleteMutation]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderTransactionItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionCard
        transaction={item}
        onPress={() => handleTransactionPress(item)}
        onLongPress={() => handleTransactionLongPress(item)}
        testID={`transaction-card-${item.id}`}
      />
    ),
    [handleTransactionPress, handleTransactionLongPress]
  );

  const renderSeparator = useCallback(() => <View className="h-3" />, []);

  const renderEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon={<Receipt size={48} color="#9CA3AF" />}
        title="No transactions"
        description="Add your first transaction to start tracking your spending."
        actionLabel="Add Transaction"
        onAction={handleCreateTransaction}
      />
    ),
    [handleCreateTransaction]
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4">
          <SkeletonCard />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage]);

  const renderListHeader = useCallback(
    () => (
      <View className="mb-4">
        {/* Summary */}
        {summary && transactions.length > 0 && (
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-expense-light/30 rounded-xl p-3">
              <Text className="text-xs text-expense-text mb-1">Expenses</Text>
              <Text className="text-lg font-bold text-expense">
                -{formatCurrency(summary.totalExpenses)}
              </Text>
            </View>
            <View className="flex-1 bg-income-light/30 rounded-xl p-3">
              <Text className="text-xs text-income-text mb-1">Income</Text>
              <Text className="text-lg font-bold text-income">
                +{formatCurrency(summary.totalIncome)}
              </Text>
            </View>
          </View>
        )}
      </View>
    ),
    [summary, transactions.length]
  );

  const renderLoadingSkeleton = () => (
    <View className="gap-3 px-4 pt-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  if (!activeAccountId) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Transactions" showBack />
        <EmptyState
          icon={<Receipt size={48} color="#9CA3AF" />}
          title="No account selected"
          description="Please select an account to view transactions."
        />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Transactions" showBack />
        <View className="px-4 py-4 flex-row justify-end">
          <TransactionFilter filters={filters} onFiltersChange={setFilters} />
        </View>
        {renderLoadingSkeleton()}
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Transactions" showBack />
        <ErrorState
          message="Failed to load transactions."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false} backgroundColor="#F9FAFB">
      <Header
        title="Transactions"
        showBack
        rightElement={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleCreateTransaction}
            leftIcon={<Plus size={18} color="#3B82F6" />}
          >
            Add
          </Button>
        }
      />

      {/* Filter bar */}
      <View className="px-4 py-3 flex-row justify-end border-b border-gray-100">
        <TransactionFilter
          filters={filters}
          onFiltersChange={setFilters}
          testID="transaction-filter"
        />
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        testID="transaction-list"
      />

      <DeleteTransactionModal
        visible={!!deleteModalTransaction}
        transaction={deleteModalTransaction}
        onClose={() => setDeleteModalTransaction(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
