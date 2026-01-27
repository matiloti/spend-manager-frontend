import React from "react";
import { render } from "@testing-library/react-native";
import { ComparisonCard } from "@/components/statistics/ComparisonCard";

describe("ComparisonCard", () => {
  it("renders expense comparison with increase", () => {
    const { getByText } = render(
      <ComparisonCard
        title="Expenses"
        type="expense"
        current={1245}
        previous={1106.5}
        trend="UP"
        changePercentage={12.5}
        changeAmount={138.5}
        testID="comparison-expense"
      />
    );

    expect(getByText("Expenses")).toBeTruthy();
    expect(getByText(/12\.5/)).toBeTruthy();
    expect(getByText(/\$138\.50/)).toBeTruthy();
    expect(getByText(/This period: \$1,245\.00/)).toBeTruthy();
    expect(getByText(/Last period: \$1,106\.50/)).toBeTruthy();
  });

  it("renders income comparison with decrease", () => {
    const { getByText } = render(
      <ComparisonCard
        title="Income"
        type="income"
        current={3000}
        previous={3500}
        trend="DOWN"
        changePercentage={-14.29}
        changeAmount={-500}
        testID="comparison-income"
      />
    );

    expect(getByText("Income")).toBeTruthy();
    expect(getByText(/-14\.3/)).toBeTruthy();
    expect(getByText(/This period: \$3,000\.00/)).toBeTruthy();
    expect(getByText(/Last period: \$3,500\.00/)).toBeTruthy();
  });

  it("renders flat comparison", () => {
    const { getByText, getByTestId, getAllByText } = render(
      <ComparisonCard
        title="Income"
        type="income"
        current={3500}
        previous={3500}
        trend="FLAT"
        changePercentage={0}
        changeAmount={0}
        testID="comparison-flat"
      />
    );

    // Both current and previous periods will have same value, so check icon indicates flat trend
    expect(getByTestId("Minus-icon")).toBeTruthy();
    expect(getByText("Income")).toBeTruthy();
  });

  it("renders up trend icon for increase", () => {
    const { getByTestId } = render(
      <ComparisonCard
        title="Expenses"
        type="expense"
        current={1245}
        previous={1000}
        trend="UP"
        changePercentage={24.5}
        changeAmount={245}
        testID="comparison-up"
      />
    );

    expect(getByTestId("TrendingUp-icon")).toBeTruthy();
  });

  it("renders down trend icon for decrease", () => {
    const { getByTestId } = render(
      <ComparisonCard
        title="Expenses"
        type="expense"
        current={800}
        previous={1000}
        trend="DOWN"
        changePercentage={-20}
        changeAmount={-200}
        testID="comparison-down"
      />
    );

    expect(getByTestId("TrendingDown-icon")).toBeTruthy();
  });

  it("handles zero values gracefully", () => {
    const { getByText } = render(
      <ComparisonCard
        title="Income"
        type="income"
        current={0}
        previous={0}
        trend="FLAT"
        changePercentage={0}
        changeAmount={0}
        testID="comparison-zero"
      />
    );

    expect(getByText(/This period: \$0\.00/)).toBeTruthy();
    expect(getByText(/Last period: \$0\.00/)).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <ComparisonCard
        title="Test"
        type="expense"
        current={100}
        previous={100}
        trend="FLAT"
        changePercentage={0}
        changeAmount={0}
        testID="test-comparison"
      />
    );

    expect(getByTestId("test-comparison")).toBeTruthy();
  });
});
