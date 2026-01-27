import api from "./api";
import { Tag } from "@/types/models";
import {
  PageResponse,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
} from "@/types/api";

export const tagService = {
  /**
   * Get all tags with pagination and optional search
   */
  getAll: async (params?: ListTagsParams): Promise<PageResponse<Tag>> => {
    const response = await api.get<PageResponse<Tag>>("/tags", { params });
    return response.data;
  },

  /**
   * Get a single tag by ID
   */
  getById: async (id: string): Promise<Tag> => {
    const response = await api.get<Tag>(`/tags/${id}`);
    return response.data;
  },

  /**
   * Create a new tag
   */
  create: async (data: CreateTagRequest): Promise<Tag> => {
    const response = await api.post<Tag>("/tags", data);
    return response.data;
  },

  /**
   * Update an existing tag
   */
  update: async (id: string, data: UpdateTagRequest): Promise<Tag> => {
    const response = await api.put<Tag>(`/tags/${id}`, data);
    return response.data;
  },

  /**
   * Delete a tag
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};

export default tagService;
