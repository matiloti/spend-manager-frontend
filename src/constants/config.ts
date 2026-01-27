// App configuration constants

export const APP_CONFIG = {
  name: "Spend Manager",
  version: "0.0.1",
  defaultCurrency: "USD",
  defaultColorCode: "#3B82F6",
  maxDescriptionLength: 200,
  maxAccountNameLength: 50,
  maxCategoryNameLength: 30,
  maxTagNameLength: 30,
  pageSize: 20,
  maxPageSize: 100,
};

export const API_ENDPOINTS = {
  accounts: "/accounts",
  categories: "/categories",
  transactions: "/transactions",
  tags: "/tags",
  home: "/home",
  statistics: "/statistics",
  search: "/search",
  auth: "/auth",
};
