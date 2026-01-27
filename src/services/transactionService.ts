import api from "./api";
import { Transaction, TransactionListResponse } from "@/types/models";
import {
  CreateTransactionRequest,
  UpdateTransactionRequest,
  ListTransactionsParams,
  BulkDeleteTransactionsRequest,
  BulkDeleteTransactionsResponse,
} from "@/types/api";

export const transactionService = {
  /**
   * Get all transactions with filtering and pagination
   */
  getAll: async (params: ListTransactionsParams): Promise<TransactionListResponse> => {
    const response = await api.get<TransactionListResponse>("/transactions", {
      params,
    });
    return response.data;
  },

  /**
   * Get a single transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Create a new transaction
   */
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", data);
    return response.data;
  },

  /**
   * Update an existing transaction
   */
  update: async (id: string, data: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Delete a transaction
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  /**
   * Bulk delete transactions
   */
  bulkDelete: async (
    data: BulkDeleteTransactionsRequest
  ): Promise<BulkDeleteTransactionsResponse> => {
    const response = await api.delete<BulkDeleteTransactionsResponse>("/transactions", {
      data,
    });
    return response.data;
  },
};

export default transactionService;
