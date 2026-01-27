import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, SafeAreaView, TextInput, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { SearchBar, FilterPanel, SearchResults } from "@/components/search";
import { SearchFilters } from "@/components/search/FilterPanel";
import { useInfiniteTransactions } from "@/hooks/api/useTransactions";
import { useAccountStore } from "@/stores/accountStore";
import { useDebounce } from "@/hooks/useDebounce";
import { Transaction } from "@/types/models";
import { formatDateISO } from "@/utils/formatters";
import { ListTransactionsParams } from "@/types/api";

const INITIAL_FILTERS: SearchFilters = {
  categoryIds: [],
  tagIds: [],
  transactionType: null,
  startDate: null,
  endDate: null,
};

export default function SearchScreen() {
  const router = useRouter();
  const searchInputRef = useRef<TextInput>(null);
  const activeAccountId = useAccountStore((state) => state.activeAccountId);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce search query (300ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Build query params for API
  const queryParams = useMemo<Omit<ListTransactionsParams, "page">>(() => {
    const params: Omit<ListTransactionsParams, "page"> = {
      accountId: activeAccountId || "",
      size: 20,
    };

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    if (filters.transactionType) {
      params.type = filters.transactionType;
    }

    if (filters.categoryIds.length === 1) {
      // API supports single categoryId
      params.categoryId = filters.categoryIds[0];
    }

    if (filters.tagIds.length > 0) {
      params.tagIds = filters.tagIds.join(",");
    }

    if (filters.startDate) {
      params.startDate = formatDateISO(filters.startDate);
    }

    if (filters.endDate) {
      params.endDate = formatDateISO(filters.endDate);
    }

    return params;
  }, [activeAccountId, debouncedSearchQuery, filters]);

  // Determine if we should enable the query
  const shouldSearch = useMemo(() => {
    return !!(
      debouncedSearchQuery.trim() ||
      filters.categoryIds.length > 0 ||
      filters.tagIds.length > 0 ||
      filters.transactionType ||
      filters.startDate ||
      filters.endDate
    );
  }, [debouncedSearchQuery, filters]);

  // Fetch transactions with infinite query
  const {
    data,
    isLoading,
    isRefetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteTransactions(queryParams, {
    enabled: !!activeAccountId && shouldSearch,
  });

  // Update hasSearched when search is triggered
  React.useEffect(() => {
    if (shouldSearch) {
      setHasSearched(true);
    }
  }, [shouldSearch]);

  // Flatten pages into single array
  const transactions = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.content);
  }, [data?.pages]);

  // Get summary from first page
  const summary = data?.pages?.[0]?.summary;

  // Handlers
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setHasSearched(false);
  }, []);

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      Keyboard.dismiss();
      router.push(`/transactions/${transaction.id}`);
    },
    [router]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Search Header */}
        <View className="px-4 pt-4">
          <SearchBar
            ref={searchInputRef}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onClear={handleSearchClear}
            testID="search-bar"
          />
        </View>

        {/* Filter Panel */}
        <View className="px-4">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearAll={handleClearAllFilters}
            testID="filter-panel"
          />
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100" />

        {/* Search Results */}
        <SearchResults
          transactions={transactions}
          summary={summary}
          isLoading={isLoading}
          isRefreshing={isRefetching}
          error={error}
          hasSearched={hasSearched}
          searchQuery={debouncedSearchQuery}
          onTransactionPress={handleTransactionPress}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          testID="search-results"
        />
      </View>
    </SafeAreaView>
  );
}
