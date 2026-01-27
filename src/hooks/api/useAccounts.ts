import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import accountService, {
  AccountWithBalance,
  ListAccountsParams,
} from "@/services/accountService";
import { Account } from "@/types/models";
import {
  PageResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
  ApiError,
} from "@/types/api";
import { useAccountStore } from "@/stores/accountStore";

// Query keys for cache management
export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params?: ListAccountsParams) =>
    [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  active: () => [...accountKeys.all, "active"] as const,
};

/**
 * Hook to fetch all accounts with pagination
 */
export function useAccounts(
  params?: ListAccountsParams,
  options?: Omit<
    UseQueryOptions<PageResponse<AccountWithBalance>, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountService.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch a single account by ID
 */
export function useAccount(
  id: string,
  options?: Omit<
    UseQueryOptions<AccountWithBalance, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch the active account
 */
export function useActiveAccount(
  options?: Omit<
    UseQueryOptions<AccountWithBalance, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: accountKeys.active(),
    queryFn: () => accountService.getActive(),
    ...options,
  });
}

/**
 * Hook to create a new account
 */
export function useCreateAccount() {
  const queryClient = useQueryClient();
  const { setActiveAccount, activeAccountId } = useAccountStore();

  return useMutation<Account, ApiError, CreateAccountRequest>({
    mutationFn: accountService.create,
    onSuccess: (newAccount) => {
      // Invalidate account list
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });

      // If this is the first account (no active account), set it as active
      if (!activeAccountId && newAccount.isActive) {
        setActiveAccount(newAccount.id);
        queryClient.invalidateQueries({ queryKey: accountKeys.active() });
      }
    },
  });
}

/**
 * Hook to update an existing account
 */
export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation<
    Account,
    ApiError,
    { id: string; data: UpdateAccountRequest }
  >({
    mutationFn: ({ id, data }) => accountService.update(id, data),
    onSuccess: (updatedAccount) => {
      // Update the specific account in cache
      queryClient.setQueryData(
        accountKeys.detail(updatedAccount.id),
        updatedAccount
      );
      // Invalidate list to refresh
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      // If it's the active account, invalidate active query too
      if (updatedAccount.isActive) {
        queryClient.invalidateQueries({ queryKey: accountKeys.active() });
      }
    },
  });
}

/**
 * Hook to delete an account
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { activeAccountId, clearActiveAccount } = useAccountStore();

  return useMutation<void, ApiError, { id: string; confirmName?: string }>({
    mutationFn: ({ id, confirmName }) => accountService.delete(id, confirmName),
    onSuccess: (_, { id }) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: accountKeys.detail(id) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      // If deleted account was active, clear it and fetch new active
      if (activeAccountId === id) {
        clearActiveAccount();
        queryClient.invalidateQueries({ queryKey: accountKeys.active() });
      }
    },
  });
}

/**
 * Hook to set an account as active
 */
export function useActivateAccount() {
  const queryClient = useQueryClient();
  const { setActiveAccount } = useAccountStore();

  return useMutation<Account, ApiError, string>({
    mutationFn: accountService.activate,
    onSuccess: (activatedAccount) => {
      // Update local state
      setActiveAccount(activatedAccount.id);
      // Invalidate queries to refresh isActive flags
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.active() });
      // Update the specific account detail
      queryClient.setQueryData(
        accountKeys.detail(activatedAccount.id),
        activatedAccount
      );
    },
  });
}
