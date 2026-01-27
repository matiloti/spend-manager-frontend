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
  colorCode: string;
  type: "EXPENSE" | "INCOME";
}

export interface UpdateCategoryRequest {
  name: string;
  icon: string;
  colorCode: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  date?: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateTransactionRequest {
  accountId?: string;
  categoryId: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  date: string;
  description?: string;
  tagIds?: string[];
}

export interface ListTransactionsParams {
  accountId: string;
  type?: "EXPENSE" | "INCOME";
  date?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  tagIds?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface BulkDeleteTransactionsRequest {
  transactionIds: string[];
}

export interface BulkDeleteTransactionsResponse {
  deletedCount: number;
  failedIds: string[];
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

export interface ListTagsParams {
  search?: string;
  page?: number;
  size?: number;
}
