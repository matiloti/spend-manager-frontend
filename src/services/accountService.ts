import api from "./api";
import { Account, BalanceSummary } from "@/types/models";
import {
  PageResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types/api";

// Re-export for convenience
export type AccountBalance = BalanceSummary;

// AccountWithBalance is now just Account since balance is part of Account
export type AccountWithBalance = Account;

export interface ListAccountsParams {
  page?: number;
  size?: number;
  sort?: string;
  includeBalance?: boolean;
}

export const accountService = {
  /**
   * Get all accounts with pagination
   */
  getAll: async (
    params?: ListAccountsParams
  ): Promise<PageResponse<AccountWithBalance>> => {
    const response = await api.get<PageResponse<AccountWithBalance>>(
      "/accounts",
      { params }
    );
    return response.data;
  },

  /**
   * Get a single account by ID
   */
  getById: async (id: string): Promise<AccountWithBalance> => {
    const response = await api.get<AccountWithBalance>(`/accounts/${id}`);
    return response.data;
  },

  /**
   * Get the currently active account
   */
  getActive: async (): Promise<AccountWithBalance> => {
    const response = await api.get<AccountWithBalance>("/accounts/active");
    return response.data;
  },

  /**
   * Create a new account
   */
  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<Account>("/accounts", data);
    return response.data;
  },

  /**
   * Update an existing account
   */
  update: async (id: string, data: UpdateAccountRequest): Promise<Account> => {
    const response = await api.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  /**
   * Delete an account
   */
  delete: async (id: string, confirmName?: string): Promise<void> => {
    await api.delete(`/accounts/${id}`, {
      params: confirmName ? { confirmName } : undefined,
    });
  },

  /**
   * Set an account as active
   */
  activate: async (id: string): Promise<Account> => {
    const response = await api.post<Account>(`/accounts/${id}/activate`);
    return response.data;
  },
};

export default accountService;
