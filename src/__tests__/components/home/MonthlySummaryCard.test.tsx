import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MonthlySummaryCard } from "@/components/home/MonthlySummaryCard";
import {
  MonthlySummary,
  MonthComparison,
  TopCategory,
} from "@/services/homeService";

const mockSummary: MonthlySummary = {
  totalIncome: 3500,
  totalExpenses: 1245,
  netBalance: 2255,
  expenseCount: 47,
  incomeCount: 3,
  daysWithTransactions: 18,
};

const mockComparison: MonthComparison = {
  previousMonth: "2025-12",
  expenseChange: 12.5,
  expenseChangeAmount: 138.5,
  incomeChange: 0,
  incomeChangeAmount: 0,
};

const mockTopCategories: TopCategory[] = [
  {
    category: {
      id: "1",
      name: "Food",
      icon: "utensils",
      colorCode: "#F97316",
    },
    amount: 450,
    percentage: 36.1,
    transactionCount: 25,
  },
  {
    category: {
      id: "2",
      name: "Transport",
      icon: "car",
      colorCode: "#3B82F6",
    },
    amount: 300,
    percentage: 24.1,
    transactionCount: 12,
  },
  {
    category: {
      id: "3",
      name: "Shopping",
      icon: "shopping-bag",
      colorCode: "#EC4899",
    },
    amount: 250,
    percentage: 20.1,
    transactionCount: 5,
  },
];

describe("MonthlySummaryCard", () => {
  const defaultProps = {
    monthName: "January 2026",
    summary: mockSummary,
    comparison: mockComparison,
    topCategories: mockTopCategories,
    isExpanded: false,
    onToggleExpand: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders month name and basic info", () => {
    const { getByText } = render(<MonthlySummaryCard {...defaultProps} />);

    expect(getByText("January 2026")).toBeTruthy();
    expect(getByText("18 days with transactions")).toBeTruthy();
  });

  it("shows net balance in header", () => {
    const { getByText } = render(<MonthlySummaryCard {...defaultProps} />);

    expect(getByText("+$2,255.00")).toBeTruthy();
  });

  it("shows expense change indicator when positive", () => {
    const { getByText } = render(<MonthlySummaryCard {...defaultProps} />);

    expect(getByText("12.5%")).toBeTruthy();
  });

  it("calls onToggleExpand when header is pressed", () => {
    const onToggleExpand = jest.fn();
    const { getByTestId } = render(
      <MonthlySummaryCard {...defaultProps} onToggleExpand={onToggleExpand} />
    );

    fireEvent.press(getByTestId("monthly-header"));
    expect(onToggleExpand).toHaveBeenCalledTimes(1);
  });

  it("shows expanded content when isExpanded is true", () => {
    const { getByText } = render(
      <MonthlySummaryCard {...defaultProps} isExpanded={true} />
    );

    expect(getByText("Total Income")).toBeTruthy();
    expect(getByText("Total Expenses")).toBeTruthy();
    expect(getByText("Top Spending Categories")).toBeTruthy();
  });

  it("shows top categories when expanded", () => {
    const { getByText } = render(
      <MonthlySummaryCard {...defaultProps} isExpanded={true} />
    );

    expect(getByText("Food")).toBeTruthy();
    expect(getByText("Transport")).toBeTruthy();
    expect(getByText("Shopping")).toBeTruthy();
  });

  it("shows category percentages when expanded", () => {
    const { getByText } = render(
      <MonthlySummaryCard {...defaultProps} isExpanded={true} />
    );

    expect(getByText("36% of expenses")).toBeTruthy();
    expect(getByText("24% of expenses")).toBeTruthy();
  });

  it("handles empty categories gracefully", () => {
    const { getByText } = render(
      <MonthlySummaryCard
        {...defaultProps}
        topCategories={[]}
        isExpanded={true}
      />
    );

    expect(getByText("No expenses recorded this month")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <MonthlySummaryCard {...defaultProps} testID="monthly-card" />
    );

    expect(getByTestId("monthly-card")).toBeTruthy();
  });
});
