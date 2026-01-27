import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import homeService, {
  DailySummaryResponse,
  WeekSummaryResponse,
  MonthlySummaryResponse,
  BalanceBarResponse,
  HomeStateResponse,
  DailySummaryParams,
  WeekSummaryParams,
  MonthlySummaryParams,
  BalanceBarParams,
  HomeStateParams,
} from "@/services/homeService";
import { ApiError } from "@/types/api";
import { useAccountStore } from "@/stores/accountStore";

// Query keys for cache management
export const homeKeys = {
  all: ["home"] as const,
  daily: (params?: DailySummaryParams) =>
    [...homeKeys.all, "daily", params] as const,
  week: (params?: WeekSummaryParams) =>
    [...homeKeys.all, "week", params] as const,
  monthly: (params?: MonthlySummaryParams) =>
    [...homeKeys.all, "monthly", params] as const,
  balanceBar: (params?: BalanceBarParams) =>
    [...homeKeys.all, "balance-bar", params] as const,
  state: (params?: HomeStateParams) =>
    [...homeKeys.all, "state", params] as const,
};

/**
 * Hook to fetch daily summary
 */
export function useDailySummary(
  params?: DailySummaryParams,
  options?: Omit<
    UseQueryOptions<DailySummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  const { activeAccountId } = useAccountStore();
  const queryParams = {
    ...params,
    accountId: params?.accountId || activeAccountId || undefined,
  };

  return useQuery({
    queryKey: homeKeys.daily(queryParams),
    queryFn: () => homeService.getDailySummary(queryParams),
    enabled: !!queryParams.accountId,
    ...options,
  });
}

/**
 * Hook to fetch week summary
 */
export function useWeekSummary(
  params?: WeekSummaryParams,
  options?: Omit<
    UseQueryOptions<WeekSummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  const { activeAccountId } = useAccountStore();
  const queryParams = {
    ...params,
    accountId: params?.accountId || activeAccountId || undefined,
  };

  return useQuery({
    queryKey: homeKeys.week(queryParams),
    queryFn: () => homeService.getWeekSummary(queryParams),
    enabled: !!queryParams.accountId,
    ...options,
  });
}

/**
 * Hook to fetch monthly summary
 */
export function useMonthlySummary(
  params?: MonthlySummaryParams,
  options?: Omit<
    UseQueryOptions<MonthlySummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  const { activeAccountId } = useAccountStore();
  const queryParams = {
    ...params,
    accountId: params?.accountId || activeAccountId || undefined,
  };

  return useQuery({
    queryKey: homeKeys.monthly(queryParams),
    queryFn: () => homeService.getMonthlySummary(queryParams),
    enabled: !!queryParams.accountId,
    ...options,
  });
}

/**
 * Hook to fetch balance bar data
 */
export function useBalanceBar(
  params?: BalanceBarParams,
  options?: Omit<
    UseQueryOptions<BalanceBarResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  const { activeAccountId } = useAccountStore();
  const queryParams = {
    ...params,
    accountId: params?.accountId || activeAccountId || undefined,
  };

  return useQuery({
    queryKey: homeKeys.balanceBar(queryParams),
    queryFn: () => homeService.getBalanceBar(queryParams),
    enabled: !!queryParams.accountId,
    ...options,
  });
}

/**
 * Hook to fetch complete home screen state
 */
export function useHomeState(
  params?: HomeStateParams,
  options?: Omit<
    UseQueryOptions<HomeStateResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  const { activeAccountId } = useAccountStore();
  const queryParams = {
    ...params,
    accountId: params?.accountId || activeAccountId || undefined,
  };

  return useQuery({
    queryKey: homeKeys.state(queryParams),
    queryFn: () => homeService.getHomeState(queryParams),
    enabled: !!queryParams.accountId,
    ...options,
  });
}
