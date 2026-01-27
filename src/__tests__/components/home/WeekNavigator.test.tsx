import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { WeekNavigator } from "@/components/home/WeekNavigator";
import { DaySummary } from "@/services/homeService";

const mockDays: DaySummary[] = [
  {
    date: "2026-01-24",
    dayOfWeek: "SATURDAY",
    hasTransactions: false,
    expenseTotal: 0,
    incomeTotal: 0,
    transactionCount: 0,
  },
  {
    date: "2026-01-25",
    dayOfWeek: "SUNDAY",
    hasTransactions: true,
    expenseTotal: 50,
    incomeTotal: 100,
    transactionCount: 2,
  },
  {
    date: "2026-01-26",
    dayOfWeek: "MONDAY",
    hasTransactions: true,
    expenseTotal: 25,
    incomeTotal: 0,
    transactionCount: 1,
  },
  {
    date: "2026-01-27",
    dayOfWeek: "TUESDAY",
    hasTransactions: false,
    expenseTotal: 0,
    incomeTotal: 0,
    transactionCount: 0,
  },
  {
    date: "2026-01-28",
    dayOfWeek: "WEDNESDAY",
    hasTransactions: false,
    expenseTotal: 0,
    incomeTotal: 0,
    transactionCount: 0,
  },
  {
    date: "2026-01-29",
    dayOfWeek: "THURSDAY",
    hasTransactions: false,
    expenseTotal: 0,
    incomeTotal: 0,
    transactionCount: 0,
  },
  {
    date: "2026-01-30",
    dayOfWeek: "FRIDAY",
    hasTransactions: false,
    expenseTotal: 0,
    incomeTotal: 0,
    transactionCount: 0,
  },
];

describe("WeekNavigator", () => {
  const defaultProps = {
    days: mockDays,
    weekStart: "2026-01-24",
    weekEnd: "2026-01-30",
    selectedDate: "2026-01-26",
    onSelectDate: jest.fn(),
    onPreviousWeek: jest.fn(),
    onNextWeek: jest.fn(),
    canGoNext: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all days of the week", () => {
    const { getByText } = render(<WeekNavigator {...defaultProps} />);

    expect(getByText("Sat")).toBeTruthy();
    expect(getByText("Sun")).toBeTruthy();
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Tue")).toBeTruthy();
    expect(getByText("Wed")).toBeTruthy();
    expect(getByText("Thu")).toBeTruthy();
    expect(getByText("Fri")).toBeTruthy();
  });

  it("renders day numbers", () => {
    const { getByText } = render(<WeekNavigator {...defaultProps} />);

    expect(getByText("24")).toBeTruthy();
    expect(getByText("25")).toBeTruthy();
    expect(getByText("26")).toBeTruthy();
    expect(getByText("27")).toBeTruthy();
  });

  it("calls onSelectDate when day is pressed", () => {
    const onSelectDate = jest.fn();
    const { getByTestId } = render(
      <WeekNavigator {...defaultProps} onSelectDate={onSelectDate} />
    );

    fireEvent.press(getByTestId("day-2026-01-25"));
    expect(onSelectDate).toHaveBeenCalledWith("2026-01-25");
  });

  it("calls onPreviousWeek when previous button is pressed", () => {
    const onPreviousWeek = jest.fn();
    const { getByTestId } = render(
      <WeekNavigator {...defaultProps} onPreviousWeek={onPreviousWeek} />
    );

    fireEvent.press(getByTestId("previous-week-button"));
    expect(onPreviousWeek).toHaveBeenCalledTimes(1);
  });

  it("calls onNextWeek when next button is pressed", () => {
    const onNextWeek = jest.fn();
    const { getByTestId } = render(
      <WeekNavigator {...defaultProps} onNextWeek={onNextWeek} canGoNext={true} />
    );

    fireEvent.press(getByTestId("next-week-button"));
    expect(onNextWeek).toHaveBeenCalledTimes(1);
  });

  it("disables next button when canGoNext is false", () => {
    const onNextWeek = jest.fn();
    const { getByTestId } = render(
      <WeekNavigator {...defaultProps} onNextWeek={onNextWeek} canGoNext={false} />
    );

    const nextButton = getByTestId("next-week-button");
    expect(nextButton.props.accessibilityState.disabled).toBe(true);
  });

  it("shows transaction indicator for days with transactions", () => {
    const { getByTestId, queryByTestId } = render(
      <WeekNavigator {...defaultProps} />
    );

    // Day with transactions should have indicator
    expect(getByTestId("indicator-2026-01-25")).toBeTruthy();
    expect(getByTestId("indicator-2026-01-26")).toBeTruthy();

    // Day without transactions should not have indicator
    expect(queryByTestId("indicator-2026-01-24")).toBeNull();
  });
});
