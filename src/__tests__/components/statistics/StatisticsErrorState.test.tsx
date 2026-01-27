import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StatisticsErrorState } from "@/components/statistics/StatisticsErrorState";

describe("StatisticsErrorState", () => {
  it("renders error state message", () => {
    const { getByText } = render(<StatisticsErrorState />);

    expect(getByText("Couldn't load statistics")).toBeTruthy();
    expect(
      getByText("Please check your connection and try again.")
    ).toBeTruthy();
  });

  it("renders try again button when callback provided", () => {
    const onRetry = jest.fn();
    const { getByText } = render(<StatisticsErrorState onRetry={onRetry} />);

    expect(getByText("Try Again")).toBeTruthy();
  });

  it("calls onRetry when button is pressed", () => {
    const onRetry = jest.fn();
    const { getByText } = render(<StatisticsErrorState onRetry={onRetry} />);

    fireEvent.press(getByText("Try Again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render button when no callback provided", () => {
    const { queryByText } = render(<StatisticsErrorState />);

    expect(queryByText("Try Again")).toBeNull();
  });

  it("renders with default testID", () => {
    const { getByTestId } = render(<StatisticsErrorState />);

    expect(getByTestId("statistics-error")).toBeTruthy();
  });

  it("renders with custom testID", () => {
    const { getByTestId } = render(
      <StatisticsErrorState testID="custom-error" />
    );

    expect(getByTestId("custom-error")).toBeTruthy();
  });

  it("renders warning icon", () => {
    const { getByTestId } = render(<StatisticsErrorState />);

    expect(getByTestId("AlertTriangle-icon")).toBeTruthy();
  });
});
