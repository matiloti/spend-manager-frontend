import React from "react";
import { render } from "@testing-library/react-native";
import { DailySummaryCard } from "@/components/home/DailySummaryCard";
import { DailyBalance } from "@/services/homeService";

describe("DailySummaryCard", () => {
  const positiveBalance: DailyBalance = {
    totalIncome: 150,
    totalExpenses: 50,
    netBalance: 100,
    incomeCount: 1,
    expenseCount: 3,
  };

  const negativeBalance: DailyBalance = {
    totalIncome: 50,
    totalExpenses: 150,
    netBalance: -100,
    incomeCount: 1,
    expenseCount: 5,
  };

  const zeroBalance: DailyBalance = {
    totalIncome: 100,
    totalExpenses: 100,
    netBalance: 0,
    incomeCount: 1,
    expenseCount: 2,
  };

  it("renders positive balance correctly", () => {
    const { getByTestId, getByText } = render(
      <DailySummaryCard
        date="2026-01-27"
        balance={positiveBalance}
        testID="daily-card"
      />
    );

    expect(getByTestId("daily-card")).toBeTruthy();
    expect(getByTestId("net-balance")).toBeTruthy();
    expect(getByText("+$100.00")).toBeTruthy();
  });

  it("renders negative balance correctly", () => {
    const { getByText } = render(
      <DailySummaryCard date="2026-01-27" balance={negativeBalance} />
    );

    expect(getByText("-$100.00")).toBeTruthy();
  });

  it("renders zero balance correctly", () => {
    const { getByText } = render(
      <DailySummaryCard date="2026-01-27" balance={zeroBalance} />
    );

    expect(getByText("$0.00")).toBeTruthy();
  });

  it("shows income and expense amounts", () => {
    const { getByTestId } = render(
      <DailySummaryCard date="2026-01-27" balance={positiveBalance} />
    );

    expect(getByTestId("income-amount").props.children).toContain("+");
    expect(getByTestId("expense-amount").props.children).toContain("-");
  });

  it("shows transaction counts when provided", () => {
    const { getByText } = render(
      <DailySummaryCard date="2026-01-27" balance={positiveBalance} />
    );

    expect(getByText("1 transaction")).toBeTruthy();
    expect(getByText("3 transactions")).toBeTruthy();
  });

  it("formats date correctly", () => {
    const { getByText } = render(
      <DailySummaryCard date="2026-01-27" balance={positiveBalance} />
    );

    // Should show weekday and date - format is "Tuesday, Jan 27"
    expect(getByText(/Tuesday/)).toBeTruthy();
    expect(getByText(/Jan/)).toBeTruthy();
    expect(getByText(/27/)).toBeTruthy();
  });
});
