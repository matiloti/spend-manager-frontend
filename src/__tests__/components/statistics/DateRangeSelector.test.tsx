import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DateRangeSelector } from "@/components/statistics/DateRangeSelector";

describe("DateRangeSelector", () => {
  const defaultProps = {
    selectedPreset: "THIS_MONTH" as const,
    onPresetChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all preset options", () => {
    const { getByText } = render(<DateRangeSelector {...defaultProps} />);

    expect(getByText("Week")).toBeTruthy();
    expect(getByText("Month")).toBeTruthy();
    expect(getByText("Year")).toBeTruthy();
    expect(getByText("Custom")).toBeTruthy();
  });

  it("shows selected preset as highlighted", () => {
    const { getByTestId } = render(<DateRangeSelector {...defaultProps} />);

    const monthButton = getByTestId("statistics-date-this_month");
    expect(monthButton).toBeTruthy();
  });

  it("calls onPresetChange when preset is selected", () => {
    const onPresetChange = jest.fn();
    const { getByTestId } = render(
      <DateRangeSelector {...defaultProps} onPresetChange={onPresetChange} />
    );

    fireEvent.press(getByTestId("statistics-date-this_week"));
    expect(onPresetChange).toHaveBeenCalledWith("THIS_WEEK");
  });

  it("calls onPresetChange for year preset", () => {
    const onPresetChange = jest.fn();
    const { getByTestId } = render(
      <DateRangeSelector {...defaultProps} onPresetChange={onPresetChange} />
    );

    fireEvent.press(getByTestId("statistics-date-this_year"));
    expect(onPresetChange).toHaveBeenCalledWith("THIS_YEAR");
  });

  it("renders with custom date range when selected", () => {
    const { getByText } = render(
      <DateRangeSelector
        {...defaultProps}
        selectedPreset="CUSTOM"
        customStartDate="2026-01-01"
        customEndDate="2026-01-15"
      />
    );

    // Should display formatted custom date range
    expect(getByText(/Jan/)).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <DateRangeSelector {...defaultProps} testID="date-range-selector" />
    );

    expect(getByTestId("date-range-selector")).toBeTruthy();
  });

  it("has correct accessibility state for selected preset", () => {
    const { getByTestId } = render(
      <DateRangeSelector {...defaultProps} selectedPreset="THIS_WEEK" />
    );

    const weekButton = getByTestId("statistics-date-this_week");
    expect(weekButton.props.accessibilityState.selected).toBe(true);
  });

  it("has correct accessibility state for unselected preset", () => {
    const { getByTestId } = render(
      <DateRangeSelector {...defaultProps} selectedPreset="THIS_MONTH" />
    );

    const weekButton = getByTestId("statistics-date-this_week");
    expect(weekButton.props.accessibilityState.selected).toBe(false);
  });
});
