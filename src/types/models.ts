// Domain model types

export type TransactionType = "EXPENSE" | "INCOME";
export type CategoryType = "EXPENSE" | "INCOME";

export interface Account {
  id: string;
  name: string;
  description?: string;
  currency: string;
  colorCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  balance?: number;
  totalIncome?: number;
  totalExpenses?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  colorCode: string;
  type: CategoryType;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Populated from relations
  category?: Category;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
