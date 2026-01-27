import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import tagService from "@/services/tagService";
import { Tag } from "@/types/models";
import {
  PageResponse,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
  ApiError,
} from "@/types/api";

// Query keys for cache management
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (params?: ListTagsParams) => [...tagKeys.lists(), params] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
};

/**
 * Hook to fetch all tags with pagination and optional search
 */
export function useTags(
  params?: ListTagsParams,
  options?: Omit<
    UseQueryOptions<PageResponse<Tag>, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: tagKeys.list(params),
    queryFn: () => tagService.getAll(params),
    ...options,
  });
}

/**
 * Hook to fetch a single tag by ID
 */
export function useTag(
  id: string,
  options?: Omit<UseQueryOptions<Tag, ApiError>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => tagService.getById(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook to create a new tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation<Tag, ApiError, CreateTagRequest>({
    mutationFn: tagService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

/**
 * Hook to update an existing tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation<Tag, ApiError, { id: string; data: UpdateTagRequest }>({
    mutationFn: ({ id, data }) => tagService.update(id, data),
    onSuccess: (updatedTag) => {
      queryClient.setQueryData(tagKeys.detail(updatedTag.id), updatedTag);
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}

/**
 * Hook to delete a tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: tagService.delete,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: tagKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
  });
}
