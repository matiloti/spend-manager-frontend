import api from "./api";
import {
  Category,
  CategoryType,
  CategoryIconsResponse,
  CategoryColorsResponse,
  SeedCategoriesResponse,
} from "@/types/models";
import {
  PageResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/api";

export interface ListCategoriesParams {
  type?: CategoryType;
  page?: number;
  size?: number;
  sort?: string;
  includeCount?: boolean;
}

export const categoryService = {
  /**
   * Get all categories with pagination and optional type filter
   */
  getAll: async (params?: ListCategoriesParams): Promise<PageResponse<Category>> => {
    const response = await api.get<PageResponse<Category>>("/categories", {
      params,
    });
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>("/categories", data);
    return response.data;
  },

  /**
   * Update an existing category
   */
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category
   */
  delete: async (id: string, replacementCategoryId?: string): Promise<void> => {
    await api.delete(`/categories/${id}`, {
      params: replacementCategoryId ? { replacementCategoryId } : undefined,
    });
  },

  /**
   * Get available icons for categories
   */
  getIcons: async (): Promise<CategoryIconsResponse> => {
    const response = await api.get<CategoryIconsResponse>("/categories/icons");
    return response.data;
  },

  /**
   * Get predefined color palette for categories
   */
  getColors: async (): Promise<CategoryColorsResponse> => {
    const response = await api.get<CategoryColorsResponse>("/categories/colors");
    return response.data;
  },

  /**
   * Seed default categories
   */
  seed: async (force?: boolean): Promise<SeedCategoriesResponse> => {
    const response = await api.post<SeedCategoriesResponse>("/categories/seed", null, {
      params: force ? { force: true } : undefined,
    });
    return response.data;
  },
};

export default categoryService;
