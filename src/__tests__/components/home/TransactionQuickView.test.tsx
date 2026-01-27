import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TransactionQuickView } from "@/components/home/TransactionQuickView";
import { TransactionSummary } from "@/services/homeService";

const mockExpenseTransaction: TransactionSummary = {
  id: "1",
  type: "EXPENSE",
  amount: 42.0,
  category: {
    id: "cat-1",
    name: "Restaurant",
    icon: "utensils",
    colorCode: "#F97316",
  },
  description: "Lunch with team",
  time: "12:30:00",
  tagCount: 2,
};

const mockIncomeTransaction: TransactionSummary = {
  id: "2",
  type: "INCOME",
  amount: 1500.0,
  category: {
    id: "cat-2",
    name: "Salary",
    icon: "briefcase",
    colorCode: "#22C55E",
  },
  description: null,
  time: "09:00:00",
  tagCount: 0,
};

describe("TransactionQuickView", () => {
  it("renders expense transaction correctly", () => {
    const { getByText } = render(
      <TransactionQuickView transaction={mockExpenseTransaction} />
    );

    expect(getByText("Restaurant")).toBeTruthy();
    expect(getByText("-$42.00")).toBeTruthy();
    expect(getByText("Lunch with team")).toBeTruthy();
  });

  it("renders income transaction correctly", () => {
    const { getByText } = render(
      <TransactionQuickView transaction={mockIncomeTransaction} />
    );

    expect(getByText("Salary")).toBeTruthy();
    expect(getByText("+$1,500.00")).toBeTruthy();
  });

  it("shows time when no description", () => {
    const { getByText } = render(
      <TransactionQuickView transaction={mockIncomeTransaction} />
    );

    expect(getByText("9:00 AM")).toBeTruthy();
  });

  it("shows description instead of time when available", () => {
    const { getByText, queryByText } = render(
      <TransactionQuickView transaction={mockExpenseTransaction} />
    );

    expect(getByText("Lunch with team")).toBeTruthy();
    expect(queryByText("12:30 PM")).toBeNull();
  });

  it("shows tag count indicator when tags exist", () => {
    const { getByText } = render(
      <TransactionQuickView transaction={mockExpenseTransaction} />
    );

    expect(getByText("2")).toBeTruthy();
  });

  it("does not show tag indicator when no tags", () => {
    const { queryByText } = render(
      <TransactionQuickView transaction={mockIncomeTransaction} />
    );

    // Tag count of 0 should not show indicator
    const tagIndicator = queryByText("0");
    expect(tagIndicator).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <TransactionQuickView
        transaction={mockExpenseTransaction}
        onPress={onPress}
      />
    );

    fireEvent.press(getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility label", () => {
    const { getByRole } = render(
      <TransactionQuickView transaction={mockExpenseTransaction} />
    );

    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toContain("EXPENSE");
    expect(card.props.accessibilityLabel).toContain("$42.00");
    expect(card.props.accessibilityLabel).toContain("Restaurant");
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <TransactionQuickView
        transaction={mockExpenseTransaction}
        testID="quick-view"
      />
    );

    expect(getByTestId("quick-view")).toBeTruthy();
  });
});
