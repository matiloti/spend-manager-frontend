import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";
import transactionService from "@/services/transactionService";
import { Transaction, TransactionListResponse } from "@/types/models";
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  ListTransactionsParams,
  BulkDeleteTransactionsRequest,
  BulkDeleteTransactionsResponse,
  ApiError,
} from "@/types/api";

// Query keys for cache management
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params: ListTransactionsParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

/**
 * Hook to fetch transactions with filtering and pagination
 */
export function useTransactions(
  params: ListTransactionsParams,
  options?: Omit<
    UseQueryOptions<TransactionListResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => transactionService.getAll(params),
    enabled: !!params.accountId,
    ...options,
  });
}

/**
 * Hook to fetch transactions with infinite scroll
 */
export function useInfiniteTransactions(
  params: Omit<ListTransactionsParams, "page">,
  options?: { enabled?: boolean }
) {
  return useInfiniteQuery<TransactionListResponse, ApiError>({
    queryKey: transactionKeys.list({ ...params, page: 0 }),
    queryFn: ({ pageParam = 0 }) =>
      transactionService.getAll({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page } = lastPage;
      if (page.number < page.totalPages - 1) {
        return page.number + 1;
      }
      return undefined;
    },
    enabled: !!params.accountId && options?.enabled !== false,
  });
}

/**
 * Hook to fetch a single transaction by ID
 */
export function useTransaction(
  id: string,
  options?: Omit<UseQueryOptions<Transaction, ApiError>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation<Transaction, ApiError, CreateTransactionRequest>({
    mutationFn: transactionService.create,
    onSuccess: () => {
      // Invalidate all transaction lists to refresh with new data
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation<
    Transaction,
    ApiError,
    { id: string; data: UpdateTransactionRequest }
  >({
    mutationFn: ({ id, data }) => transactionService.update(id, data),
    onSuccess: (updatedTransaction) => {
      // Update the specific transaction in cache
      queryClient.setQueryData(
        transactionKeys.detail(updatedTransaction.id),
        updatedTransaction
      );
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

/**
 * Hook to delete a transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: transactionService.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

/**
 * Hook to bulk delete transactions
 */
export function useBulkDeleteTransactions() {
  const queryClient = useQueryClient();

  return useMutation<
    BulkDeleteTransactionsResponse,
    ApiError,
    BulkDeleteTransactionsRequest
  >({
    mutationFn: transactionService.bulkDelete,
    onSuccess: (_, { transactionIds }) => {
      // Remove deleted transactions from cache
      transactionIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });
      });
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}
