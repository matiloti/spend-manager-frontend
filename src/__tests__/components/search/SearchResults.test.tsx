import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchResults } from "@/components/search/SearchResults";
import { Transaction, TransactionListSummary } from "@/types/models";

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    accountId: "account-1",
    categoryId: "category-1",
    type: "EXPENSE",
    amount: 50.0,
    date: "2026-01-27",
    description: "Lunch",
    createdAt: "2026-01-27T10:00:00Z",
    updatedAt: "2026-01-27T10:00:00Z",
    category: {
      id: "category-1",
      name: "Food",
      icon: "utensils",
      colorCode: "#F97316",
      type: "EXPENSE",
    },
    tags: [],
  },
  {
    id: "2",
    accountId: "account-1",
    categoryId: "category-2",
    type: "INCOME",
    amount: 1000.0,
    date: "2026-01-26",
    description: "Salary",
    createdAt: "2026-01-26T09:00:00Z",
    updatedAt: "2026-01-26T09:00:00Z",
    category: {
      id: "category-2",
      name: "Salary",
      icon: "briefcase",
      colorCode: "#22C55E",
      type: "INCOME",
    },
    tags: [],
  },
];

const mockSummary: TransactionListSummary = {
  totalExpenses: 50.0,
  totalIncome: 1000.0,
  transactionCount: 2,
};

describe("SearchResults", () => {
  const defaultProps = {
    transactions: [],
    isLoading: false,
    hasSearched: false,
    searchQuery: "",
    onTransactionPress: jest.fn(),
  };

  it("shows initial state when no search has been performed", () => {
    const { getByText } = render(<SearchResults {...defaultProps} />);

    expect(getByText("Search Transactions")).toBeTruthy();
    expect(
      getByText("Enter a search term or use filters to find transactions")
    ).toBeTruthy();
  });

  it("shows loading state when searching", () => {
    const { getByText } = render(
      <SearchResults {...defaultProps} isLoading hasSearched />
    );

    expect(getByText("Searching...")).toBeTruthy();
  });

  it("shows empty state when no results found", () => {
    const { getByText } = render(
      <SearchResults
        {...defaultProps}
        hasSearched
        searchQuery="nonexistent"
      />
    );

    expect(getByText("No Results Found")).toBeTruthy();
    expect(getByText('No transactions match "nonexistent"')).toBeTruthy();
  });

  it("shows empty state with filters message when no search query", () => {
    const { getByText } = render(
      <SearchResults {...defaultProps} hasSearched searchQuery="" />
    );

    expect(getByText("No Results Found")).toBeTruthy();
    expect(
      getByText("No transactions match the selected filters")
    ).toBeTruthy();
  });

  it("shows error state when there is an error", () => {
    const { getByText } = render(
      <SearchResults
        {...defaultProps}
        error={{ message: "Network error" }}
        hasSearched
      />
    );

    expect(getByText("Something went wrong")).toBeTruthy();
    expect(getByText("Network error")).toBeTruthy();
  });

  it("renders transactions list correctly", () => {
    const { getByText, getAllByText } = render(
      <SearchResults
        {...defaultProps}
        transactions={mockTransactions}
        summary={mockSummary}
        hasSearched
      />
    );

    expect(getByText("2 results")).toBeTruthy();
    expect(getByText("Food")).toBeTruthy();
    // Salary appears as both category name and description
    expect(getAllByText("Salary").length).toBeGreaterThanOrEqual(1);
  });

  it("shows summary with expense and income totals", () => {
    const { getAllByText } = render(
      <SearchResults
        {...defaultProps}
        transactions={mockTransactions}
        summary={mockSummary}
        hasSearched
      />
    );

    // Amount appears in both summary and card
    expect(getAllByText("-$50.00").length).toBeGreaterThanOrEqual(1);
    expect(getAllByText("+$1,000.00").length).toBeGreaterThanOrEqual(1);
  });

  it("calls onTransactionPress when transaction is tapped", () => {
    const onTransactionPressMock = jest.fn();
    const { getByText } = render(
      <SearchResults
        {...defaultProps}
        transactions={mockTransactions}
        hasSearched
        onTransactionPress={onTransactionPressMock}
      />
    );

    fireEvent.press(getByText("Food"));
    expect(onTransactionPressMock).toHaveBeenCalledWith(mockTransactions[0]);
  });

  it("shows singular result text for single transaction", () => {
    const singleSummary: TransactionListSummary = {
      totalExpenses: 50.0,
      totalIncome: 0,
      transactionCount: 1,
    };

    const { getByText } = render(
      <SearchResults
        {...defaultProps}
        transactions={[mockTransactions[0]]}
        summary={singleSummary}
        hasSearched
      />
    );

    expect(getByText("1 result")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <SearchResults
        {...defaultProps}
        transactions={mockTransactions}
        hasSearched
        testID="search-results"
      />
    );

    expect(getByTestId("search-results")).toBeTruthy();
  });
});
