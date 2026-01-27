import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TransactionCard } from "@/components/transaction/TransactionCard";
import { Transaction } from "@/types/models";

const mockExpenseTransaction: Transaction = {
  id: "1",
  accountId: "acc-1",
  categoryId: "cat-1",
  type: "EXPENSE",
  amount: 25.5,
  date: "2026-01-27",
  description: "Coffee and snacks",
  createdAt: "2026-01-27T10:30:00Z",
  updatedAt: "2026-01-27T10:30:00Z",
  category: {
    id: "cat-1",
    name: "Food",
    icon: "utensils",
    colorCode: "#F97316",
    type: "EXPENSE",
  },
  tags: [
    { id: "tag-1", name: "work", createdAt: "2026-01-01T00:00:00Z" },
    { id: "tag-2", name: "coffee", createdAt: "2026-01-01T00:00:00Z" },
  ],
};

const mockIncomeTransaction: Transaction = {
  id: "2",
  accountId: "acc-1",
  categoryId: "cat-2",
  type: "INCOME",
  amount: 1500.0,
  date: "2026-01-15",
  description: "Freelance payment",
  createdAt: "2026-01-15T09:00:00Z",
  updatedAt: "2026-01-15T09:00:00Z",
  category: {
    id: "cat-2",
    name: "Freelance",
    icon: "briefcase",
    colorCode: "#22C55E",
    type: "INCOME",
  },
  tags: [],
};

describe("TransactionCard", () => {
  it("renders expense transaction with correct amount format", () => {
    const { getByText } = render(
      <TransactionCard transaction={mockExpenseTransaction} />
    );
    expect(getByText("-$25.50")).toBeTruthy();
  });

  it("renders income transaction with correct amount format", () => {
    const { getByText } = render(
      <TransactionCard transaction={mockIncomeTransaction} />
    );
    expect(getByText("+$1,500.00")).toBeTruthy();
  });

  it("renders category name", () => {
    const { getByText } = render(
      <TransactionCard transaction={mockExpenseTransaction} />
    );
    expect(getByText("Food")).toBeTruthy();
  });

  it("renders description when provided", () => {
    const { getByText } = render(
      <TransactionCard transaction={mockExpenseTransaction} />
    );
    expect(getByText("Coffee and snacks")).toBeTruthy();
  });

  it("renders tags when present", () => {
    const { getByText } = render(
      <TransactionCard transaction={mockExpenseTransaction} />
    );
    expect(getByText("work")).toBeTruthy();
    expect(getByText("coffee")).toBeTruthy();
  });

  it("does not render tags section when no tags", () => {
    const { queryByText } = render(
      <TransactionCard transaction={mockIncomeTransaction} />
    );
    expect(queryByText("work")).toBeNull();
  });

  it("truncates tags display when more than 3 tags", () => {
    const transactionWithManyTags: Transaction = {
      ...mockExpenseTransaction,
      tags: [
        { id: "1", name: "tag1", createdAt: "2026-01-01T00:00:00Z" },
        { id: "2", name: "tag2", createdAt: "2026-01-01T00:00:00Z" },
        { id: "3", name: "tag3", createdAt: "2026-01-01T00:00:00Z" },
        { id: "4", name: "tag4", createdAt: "2026-01-01T00:00:00Z" },
        { id: "5", name: "tag5", createdAt: "2026-01-01T00:00:00Z" },
      ],
    };
    const { getByText, queryByText } = render(
      <TransactionCard transaction={transactionWithManyTags} />
    );
    expect(getByText("tag1")).toBeTruthy();
    expect(getByText("tag2")).toBeTruthy();
    expect(getByText("tag3")).toBeTruthy();
    expect(getByText("+2")).toBeTruthy();
    expect(queryByText("tag4")).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <TransactionCard
        transaction={mockExpenseTransaction}
        onPress={onPressMock}
      />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long pressed", () => {
    const onLongPressMock = jest.fn();
    const { getByRole } = render(
      <TransactionCard
        transaction={mockExpenseTransaction}
        onLongPress={onLongPressMock}
      />
    );

    fireEvent(getByRole("button"), "longPress");
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility label", () => {
    const { getByRole } = render(
      <TransactionCard transaction={mockExpenseTransaction} />
    );
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toContain("EXPENSE");
    expect(card.props.accessibilityLabel).toContain("Food");
  });

  it("handles transaction without category gracefully", () => {
    const transactionNoCategory: Transaction = {
      ...mockExpenseTransaction,
      category: undefined,
    };
    const { getByText } = render(
      <TransactionCard transaction={transactionNoCategory} />
    );
    expect(getByText("Unknown Category")).toBeTruthy();
  });
});
