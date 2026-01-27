// API response types

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageResponse<T> {
  content: T[];
  page: PageInfo;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: FieldError[];
}

export interface FieldError {
  field: string;
  message: string;
}

// API Error type for catch blocks
export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: FieldError[];
}

// Request types
export interface CreateAccountRequest {
  name: string;
  description?: string;
  currency?: string;
  colorCode?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  description?: string;
  colorCode?: string;
}

export interface CreateCategoryRequest {
  name: string;
  icon: string;
  colorCode?: string;
  type: "EXPENSE" | "INCOME";
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  date: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateTransactionRequest {
  categoryId?: string;
  amount?: number;
  date?: string;
  description?: string;
  tagIds?: string[];
}
