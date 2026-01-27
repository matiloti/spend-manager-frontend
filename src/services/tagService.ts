import api from "./api";
import { Tag, TagColorsResponse, DeleteTagResponse } from "@/types/models";
import {
  PageResponse,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
  DeleteTagParams,
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
   * Delete a tag with optional reassignment
   * @param id - Tag ID to delete
   * @param params - Optional action and replacement tag ID
   */
  delete: async (
    id: string,
    params?: DeleteTagParams
  ): Promise<DeleteTagResponse> => {
    const response = await api.delete<DeleteTagResponse>(`/tags/${id}`, {
      params,
    });
    return response.data;
  },

  /**
   * Get predefined color palette for tags
   */
  getColors: async (): Promise<TagColorsResponse> => {
    const response = await api.get<TagColorsResponse>("/tags/colors");
    return response.data;
  },
};

export default tagService;
