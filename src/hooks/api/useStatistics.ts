import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import statisticsService, {
  StatisticsOverviewResponse,
  CategoryBreakdownResponse,
  TimeSeriesResponse,
  ComparisonResponse,
  CategoryTrendResponse,
  TrendsResponse,
  PresetsResponse,
  StatisticsRequestParams,
  CategoryStatisticsParams,
  TimeSeriesParams,
  ComparisonParams,
  CategoryTrendParams,
} from "@/services/statisticsService";
import { ApiError } from "@/types/api";

// Query keys for cache management
export const statisticsKeys = {
  all: ["statistics"] as const,
  overview: (params?: StatisticsRequestParams) =>
    [...statisticsKeys.all, "overview", params] as const,
  categories: (params?: CategoryStatisticsParams) =>
    [...statisticsKeys.all, "categories", params] as const,
  timeSeries: (params?: TimeSeriesParams) =>
    [...statisticsKeys.all, "time-series", params] as const,
  comparison: (params?: ComparisonParams) =>
    [...statisticsKeys.all, "comparison", params] as const,
  categoryTrend: (params?: CategoryTrendParams) =>
    [...statisticsKeys.all, "category-trend", params] as const,
  trends: (params?: StatisticsRequestParams) =>
    [...statisticsKeys.all, "trends", params] as const,
  presets: () => [...statisticsKeys.all, "presets"] as const,
};

/**
 * Hook to fetch statistics overview (main hook for the statistics page)
 */
export function useStatisticsOverview(
  params?: StatisticsRequestParams,
  options?: Omit<
    UseQueryOptions<StatisticsOverviewResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.overview(params),
    queryFn: () => statisticsService.getOverview(params),
    staleTime: 5 * 60 * 1000, // 5 minutes for current period data
    ...options,
  });
}

/**
 * Hook to fetch category breakdown for charts
 */
export function useCategoryBreakdown(
  params?: CategoryStatisticsParams,
  options?: Omit<
    UseQueryOptions<CategoryBreakdownResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.categories(params),
    queryFn: () => statisticsService.getCategories(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch time series data for line/bar charts
 */
export function useTimeSeries(
  params?: TimeSeriesParams,
  options?: Omit<
    UseQueryOptions<TimeSeriesResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.timeSeries(params),
    queryFn: () => statisticsService.getTimeSeries(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch period comparison data
 */
export function useComparison(
  params?: ComparisonParams,
  options?: Omit<
    UseQueryOptions<ComparisonResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.comparison(params),
    queryFn: () => statisticsService.getComparison(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch category trend data over time
 */
export function useCategoryTrend(
  params?: CategoryTrendParams,
  options?: Omit<
    UseQueryOptions<CategoryTrendResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.categoryTrend(params),
    queryFn: () => statisticsService.getCategoryTrend(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch spending trends and patterns
 */
export function useTrends(
  params?: StatisticsRequestParams,
  options?: Omit<
    UseQueryOptions<TrendsResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.trends(params),
    queryFn: () => statisticsService.getTrends(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to fetch available date range presets
 */
export function useDateRangePresets(
  options?: Omit<
    UseQueryOptions<PresetsResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: statisticsKeys.presets(),
    queryFn: () => statisticsService.getPresets(),
    staleTime: 60 * 60 * 1000, // 1 hour - presets rarely change
    ...options,
  });
}
