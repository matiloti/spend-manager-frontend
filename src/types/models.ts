// Domain model types

export type TransactionType = "EXPENSE" | "INCOME";
export type CategoryType = "EXPENSE" | "INCOME";

export interface BalanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface Account {
  id: string;
  name: string;
  description?: string;
  currency: string;
  colorCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  balance?: BalanceSummary;
  transactionCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  colorCode: string;
  type: CategoryType;
  isDefault: boolean;
  transactionCount?: number;
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryIcon {
  name: string;
  label: string;
  category: string;
}

export interface CategoryIconsResponse {
  icons: CategoryIcon[];
  categories: string[];
}

export interface CategoryColor {
  code: string;
  name: string;
}

export interface CategoryColorsResponse {
  colors: CategoryColor[];
}

export interface SeedCategoriesResponse {
  expenseCategories: number;
  incomeCategories: number;
  message: string;
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
