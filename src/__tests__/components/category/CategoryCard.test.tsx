import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Category } from "@/types/models";

const mockCategory: Category = {
  id: "1",
  name: "Food",
  icon: "utensils",
  colorCode: "#F97316",
  type: "EXPENSE",
  isDefault: true,
  transactionCount: 12,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

describe("CategoryCard", () => {
  it("renders category name", () => {
    const { getByText } = render(<CategoryCard category={mockCategory} />);
    expect(getByText("Food")).toBeTruthy();
  });

  it("shows Default badge when category is default", () => {
    const { getByText } = render(<CategoryCard category={mockCategory} />);
    expect(getByText("Default")).toBeTruthy();
  });

  it("does not show Default badge when category is not default", () => {
    const nonDefaultCategory = { ...mockCategory, isDefault: false };
    const { queryByText } = render(
      <CategoryCard category={nonDefaultCategory} />
    );
    expect(queryByText("Default")).toBeNull();
  });

  it("renders transaction count correctly", () => {
    const { getByText } = render(<CategoryCard category={mockCategory} />);
    expect(getByText("12 transactions")).toBeTruthy();
  });

  it("renders singular transaction text for count of 1", () => {
    const singleTransactionCategory = {
      ...mockCategory,
      transactionCount: 1,
    };
    const { getByText } = render(
      <CategoryCard category={singleTransactionCategory} />
    );
    expect(getByText("1 transaction")).toBeTruthy();
  });

  it("renders 'No transactions' for count of 0", () => {
    const noTransactionsCategory = {
      ...mockCategory,
      transactionCount: 0,
    };
    const { getByText } = render(
      <CategoryCard category={noTransactionsCategory} />
    );
    expect(getByText("No transactions")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <CategoryCard category={mockCategory} onPress={onPressMock} />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long pressed", () => {
    const onLongPressMock = jest.fn();
    const { getByRole } = render(
      <CategoryCard category={mockCategory} onLongPress={onLongPressMock} />
    );

    fireEvent(getByRole("button"), "longPress");
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility label", () => {
    const { getByRole } = render(<CategoryCard category={mockCategory} />);
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toContain("Category Food");
    expect(card.props.accessibilityLabel).toContain("default");
  });

  it("does not include default in accessibility label when not default", () => {
    const nonDefaultCategory = { ...mockCategory, isDefault: false };
    const { getByRole } = render(
      <CategoryCard category={nonDefaultCategory} />
    );
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).not.toContain("default");
  });
});
