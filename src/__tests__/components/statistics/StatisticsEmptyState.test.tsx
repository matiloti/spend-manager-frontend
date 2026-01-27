import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StatisticsEmptyState } from "@/components/statistics/StatisticsEmptyState";

describe("StatisticsEmptyState", () => {
  it("renders empty state message", () => {
    const { getByText } = render(<StatisticsEmptyState />);

    expect(getByText("No data for this period")).toBeTruthy();
    expect(
      getByText(
        "Try selecting a different date range or account to see your statistics."
      )
    ).toBeTruthy();
  });

  it("renders change date range button when callback provided", () => {
    const onChangeDateRange = jest.fn();
    const { getByText } = render(
      <StatisticsEmptyState onChangeDateRange={onChangeDateRange} />
    );

    expect(getByText("Change Date Range")).toBeTruthy();
  });

  it("calls onChangeDateRange when button is pressed", () => {
    const onChangeDateRange = jest.fn();
    const { getByText } = render(
      <StatisticsEmptyState onChangeDateRange={onChangeDateRange} />
    );

    fireEvent.press(getByText("Change Date Range"));
    expect(onChangeDateRange).toHaveBeenCalledTimes(1);
  });

  it("does not render button when no callback provided", () => {
    const { queryByText } = render(<StatisticsEmptyState />);

    expect(queryByText("Change Date Range")).toBeNull();
  });

  it("renders with default testID", () => {
    const { getByTestId } = render(<StatisticsEmptyState />);

    expect(getByTestId("statistics-empty")).toBeTruthy();
  });

  it("renders with custom testID", () => {
    const { getByTestId } = render(
      <StatisticsEmptyState testID="custom-empty" />
    );

    expect(getByTestId("custom-empty")).toBeTruthy();
  });

  it("renders chart icon", () => {
    const { getByTestId } = render(<StatisticsEmptyState />);

    expect(getByTestId("BarChart3-icon")).toBeTruthy();
  });
});
