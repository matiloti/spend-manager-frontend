import React from "react";
import { render } from "@testing-library/react-native";
import { BalanceBar } from "@/components/home/BalanceBar";

describe("BalanceBar", () => {
  it("renders income and expense amounts", () => {
    const { getByText } = render(
      <BalanceBar
        income={100}
        expenses={60}
        expensePercentage={60}
        isOverspent={false}
      />
    );

    expect(getByText("$60.00")).toBeTruthy();
    expect(getByText("$40.00")).toBeTruthy();
    expect(getByText(/Income:/)).toBeTruthy();
    expect(getByText("$100.00")).toBeTruthy();
  });

  it("shows Remaining label when not overspent", () => {
    const { getByText } = render(
      <BalanceBar
        income={100}
        expenses={60}
        expensePercentage={60}
        isOverspent={false}
      />
    );

    expect(getByText("Remaining")).toBeTruthy();
  });

  it("shows Over by label when overspent", () => {
    const { getByText } = render(
      <BalanceBar
        income={100}
        expenses={150}
        expensePercentage={150}
        isOverspent={true}
      />
    );

    expect(getByText("Over by")).toBeTruthy();
    expect(getByText("$50.00")).toBeTruthy();
  });

  it("displays percentage labels", () => {
    const { getByText } = render(
      <BalanceBar
        income={100}
        expenses={60}
        expensePercentage={60}
        isOverspent={false}
      />
    );

    expect(getByText("60% spent")).toBeTruthy();
    expect(getByText("40% left")).toBeTruthy();
  });

  it("shows over budget percentage when overspent", () => {
    const { getByText } = render(
      <BalanceBar
        income={100}
        expenses={150}
        expensePercentage={150}
        isOverspent={true}
      />
    );

    expect(getByText("150% spent")).toBeTruthy();
    expect(getByText("50% over budget")).toBeTruthy();
  });

  it("renders with custom testID", () => {
    const { getByTestId } = render(
      <BalanceBar
        income={100}
        expenses={60}
        expensePercentage={60}
        isOverspent={false}
        testID="test-balance-bar"
      />
    );

    expect(getByTestId("test-balance-bar")).toBeTruthy();
  });
});
