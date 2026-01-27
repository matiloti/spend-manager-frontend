import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import categoryService, { ListCategoriesParams } from "@/services/categoryService";
import {
  Category,
  CategoryType,
  CategoryIconsResponse,
  CategoryColorsResponse,
} from "@/types/models";
import {
  PageResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ApiError,
} from "@/types/api";

// Query keys for cache management
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params?: ListCategoriesParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  icons: () => [...categoryKeys.all, "icons"] as const,
  colors: () => [...categoryKeys.all, "colors"] as const,
};

/**
 * Hook to fetch all categories with pagination and optional type filter
 */
export function useCategories(
  params?: ListCategoriesParams,
  options?: Omit<
    UseQueryOptions<PageResponse<Category>, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch categories by type
 */
export function useCategoriesByType(
  type: CategoryType,
  options?: Omit<
    UseQueryOptions<PageResponse<Category>, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.list({ type, includeCount: true }),
    queryFn: () => categoryService.getAll({ type, includeCount: true }),
    ...options,
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(
  id: string,
  options?: Omit<UseQueryOptions<Category, ApiError>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to fetch available icons
 */
export function useCategoryIcons(
  options?: Omit<
    UseQueryOptions<CategoryIconsResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.icons(),
    queryFn: () => categoryService.getIcons(),
    staleTime: 24 * 60 * 60 * 1000, // Icons rarely change, cache for 24 hours
    ...options,
  });
}

/**
 * Hook to fetch available colors
 */
export function useCategoryColors(
  options?: Omit<
    UseQueryOptions<CategoryColorsResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: categoryKeys.colors(),
    queryFn: () => categoryService.getColors(),
    staleTime: 24 * 60 * 60 * 1000, // Colors rarely change, cache for 24 hours
    ...options,
  });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, ApiError, CreateCategoryRequest>({
    mutationFn: categoryService.create,
    onSuccess: (newCategory) => {
      // Invalidate all category lists
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    ApiError,
    { id: string; data: UpdateCategoryRequest }
  >({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate list to refresh
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { id: string; replacementCategoryId?: string }>({
    mutationFn: ({ id, replacementCategoryId }) =>
      categoryService.delete(id, replacementCategoryId),
    onSuccess: (_, { id }) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

/**
 * Hook to seed default categories
 */
export function useSeedCategories() {
  const queryClient = useQueryClient();

  return useMutation<{ expenseCategories: number; incomeCategories: number; message: string }, ApiError, boolean | undefined>({
    mutationFn: (force) => categoryService.seed(force),
    onSuccess: () => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
