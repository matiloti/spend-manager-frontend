import React from "react";
import { render } from "@testing-library/react-native";
import { KPICard, SecondaryKPICard } from "@/components/statistics/KPICard";
import { Hash } from "lucide-react-native";

describe("KPICard", () => {
  it("renders expense card with correct amount", () => {
    const { getByText } = render(
      <KPICard
        label="Total Expenses"
        amount={1245}
        type="expense"
        testID="kpi-expense"
      />
    );

    expect(getByText("Total Expenses")).toBeTruthy();
    expect(getByText("-$1,245.00")).toBeTruthy();
  });

  it("renders income card with positive sign", () => {
    const { getByText } = render(
      <KPICard
        label="Total Income"
        amount={3500}
        type="income"
        testID="kpi-income"
      />
    );

    expect(getByText("Total Income")).toBeTruthy();
    expect(getByText("+$3,500.00")).toBeTruthy();
  });

  it("renders balance card with correct sign based on value", () => {
    const { getByText } = render(
      <KPICard
        label="Net Balance"
        amount={2255}
        type="balance"
        testID="kpi-balance"
      />
    );

    expect(getByText("Net Balance")).toBeTruthy();
    expect(getByText("$2,255.00")).toBeTruthy();
  });

  it("renders negative balance correctly", () => {
    const { getByText } = render(
      <KPICard
        label="Net Balance"
        amount={-500}
        type="balance"
        testID="kpi-balance-negative"
      />
    );

    expect(getByText("$500.00")).toBeTruthy();
  });

  it("renders trend indicator when provided", () => {
    const { getByText, getByTestId } = render(
      <KPICard
        label="Total Expenses"
        amount={1245}
        type="expense"
        trend="UP"
        trendPercentage={12.5}
        testID="kpi-expense-trend"
      />
    );

    expect(getByText("12.5%")).toBeTruthy();
    expect(getByTestId("TrendingUp-icon")).toBeTruthy();
  });

  it("renders down trend correctly", () => {
    const { getByText, getByTestId } = render(
      <KPICard
        label="Total Expenses"
        amount={1000}
        type="expense"
        trend="DOWN"
        trendPercentage={10.2}
        testID="kpi-expense-down"
      />
    );

    expect(getByText("10.2%")).toBeTruthy();
    expect(getByTestId("TrendingDown-icon")).toBeTruthy();
  });

  it("renders flat trend with minus icon", () => {
    const { getByText, getByTestId } = render(
      <KPICard
        label="Total Income"
        amount={3500}
        type="income"
        trend="FLAT"
        trendPercentage={0}
        testID="kpi-income-flat"
      />
    );

    expect(getByText("0.0%")).toBeTruthy();
    expect(getByTestId("Minus-icon")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <KPICard
        label="Test"
        amount={100}
        type="expense"
        testID="kpi-test"
      />
    );

    expect(getByTestId("kpi-test")).toBeTruthy();
  });
});

describe("SecondaryKPICard", () => {
  it("renders label and value", () => {
    const { getByText } = render(
      <SecondaryKPICard
        icon={<Hash size={20} />}
        label="Transactions"
        value={47}
        testID="secondary-kpi"
      />
    );

    expect(getByText("Transactions")).toBeTruthy();
    expect(getByText("47")).toBeTruthy();
  });

  it("renders string value", () => {
    const { getByText } = render(
      <SecondaryKPICard
        icon={<Hash size={20} />}
        label="Avg Daily"
        value="$46.11"
        testID="secondary-kpi-string"
      />
    );

    expect(getByText("Avg Daily")).toBeTruthy();
    expect(getByText("$46.11")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <SecondaryKPICard
        icon={<Hash size={20} />}
        label="Test"
        value={0}
        testID="secondary-test"
      />
    );

    expect(getByTestId("secondary-test")).toBeTruthy();
  });
});
