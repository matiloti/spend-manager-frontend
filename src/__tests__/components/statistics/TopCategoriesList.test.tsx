import React from "react";
import { render } from "@testing-library/react-native";
import { TopCategoriesList } from "@/components/statistics/TopCategoriesList";
import { CategoryStatistic } from "@/services/statisticsService";

const mockCategories: CategoryStatistic[] = [
  {
    category: {
      id: "1",
      name: "Food",
      icon: "utensils",
      colorCode: "#F97316",
      type: "EXPENSE",
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
      type: "EXPENSE",
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
      type: "EXPENSE",
    },
    amount: 250,
    percentage: 20.1,
    transactionCount: 5,
  },
  {
    category: {
      id: "4",
      name: "Entertainment",
      icon: "film",
      colorCode: "#A855F7",
      type: "EXPENSE",
    },
    amount: 145,
    percentage: 11.6,
    transactionCount: 8,
  },
  {
    category: {
      id: "5",
      name: "Bills",
      icon: "zap",
      colorCode: "#EF4444",
      type: "EXPENSE",
    },
    amount: 100,
    percentage: 8.1,
    transactionCount: 3,
  },
];

describe("TopCategoriesList", () => {
  it("renders all categories", () => {
    const { getByText } = render(
      <TopCategoriesList categories={mockCategories} testID="top-categories" />
    );

    expect(getByText("Food")).toBeTruthy();
    expect(getByText("Transport")).toBeTruthy();
    expect(getByText("Shopping")).toBeTruthy();
    expect(getByText("Entertainment")).toBeTruthy();
    expect(getByText("Bills")).toBeTruthy();
  });

  it("renders amounts correctly", () => {
    const { getByText } = render(
      <TopCategoriesList categories={mockCategories} testID="top-categories" />
    );

    expect(getByText("$450.00")).toBeTruthy();
    expect(getByText("$300.00")).toBeTruthy();
    expect(getByText("$250.00")).toBeTruthy();
  });

  it("renders percentages", () => {
    const { getByText } = render(
      <TopCategoriesList categories={mockCategories} testID="top-categories" />
    );

    expect(getByText("36%")).toBeTruthy();
    expect(getByText("24%")).toBeTruthy();
    expect(getByText("20%")).toBeTruthy();
  });

  it("renders transaction counts", () => {
    const { getByText } = render(
      <TopCategoriesList categories={mockCategories} testID="top-categories" />
    );

    expect(getByText("25 transactions")).toBeTruthy();
    expect(getByText("12 transactions")).toBeTruthy();
    expect(getByText("5 transactions")).toBeTruthy();
  });

  it("renders singular transaction text", () => {
    const singleTransactionCategory: CategoryStatistic[] = [
      {
        category: {
          id: "1",
          name: "Test",
          icon: "utensils",
          colorCode: "#F97316",
          type: "EXPENSE",
        },
        amount: 100,
        percentage: 100,
        transactionCount: 1,
      },
    ];

    const { getByText } = render(
      <TopCategoriesList
        categories={singleTransactionCategory}
        testID="single-transaction"
      />
    );

    expect(getByText("1 transaction")).toBeTruthy();
  });

  it("renders empty state when no categories", () => {
    const { getByText } = render(
      <TopCategoriesList categories={[]} testID="empty-categories" />
    );

    expect(getByText("No categories to display")).toBeTruthy();
  });

  it("renders category test IDs", () => {
    const { getByTestId } = render(
      <TopCategoriesList categories={mockCategories} testID="top-categories" />
    );

    expect(getByTestId("statistics-top-category-0")).toBeTruthy();
    expect(getByTestId("statistics-top-category-1")).toBeTruthy();
    expect(getByTestId("statistics-top-category-2")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <TopCategoriesList categories={mockCategories} testID="categories-list" />
    );

    expect(getByTestId("categories-list")).toBeTruthy();
  });
});
