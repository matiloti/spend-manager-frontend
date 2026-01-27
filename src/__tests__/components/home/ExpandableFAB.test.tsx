import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { ExpandableFAB } from "@/components/home/ExpandableFAB";
import * as Haptics from "expo-haptics";

describe("ExpandableFAB", () => {
  const mockOnAddExpense = jest.fn();
  const mockOnAddIncome = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders FAB button", () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    expect(getByTestId("fab")).toBeTruthy();
  });

  it("has correct accessibility label when collapsed", () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    const fab = getByTestId("fab");
    expect(fab.props.accessibilityLabel).toBe("Add transaction");
    expect(fab.props.accessibilityState.expanded).toBe(false);
  });

  it("expands when FAB is pressed", async () => {
    const { getByTestId, queryByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Initially no options visible
    expect(queryByTestId("fab-expense")).toBeNull();
    expect(queryByTestId("fab-income")).toBeNull();

    // Press FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    // Options should appear
    expect(getByTestId("fab-expense")).toBeTruthy();
    expect(getByTestId("fab-income")).toBeTruthy();
  });

  it("shows overlay when expanded", async () => {
    const { getByTestId, queryByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // No overlay initially
    expect(queryByTestId("fab-overlay")).toBeNull();

    // Press FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    // Overlay should appear
    expect(getByTestId("fab-overlay")).toBeTruthy();
  });

  it("has correct accessibility label when expanded", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    const fab = getByTestId("fab");
    expect(fab.props.accessibilityLabel).toBe("Close menu");
    expect(fab.props.accessibilityState.expanded).toBe(true);
  });

  it("calls onAddExpense when expense option is pressed", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    // Press expense option
    await act(async () => {
      fireEvent.press(getByTestId("fab-expense"));
      jest.runAllTimers();
    });

    expect(mockOnAddExpense).toHaveBeenCalled();
  });

  it("calls onAddIncome when income option is pressed", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    // Press income option
    await act(async () => {
      fireEvent.press(getByTestId("fab-income"));
      jest.runAllTimers();
    });

    expect(mockOnAddIncome).toHaveBeenCalled();
  });

  it("collapses when FAB is pressed while expanded", async () => {
    const { getByTestId, queryByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    expect(getByTestId("fab-expense")).toBeTruthy();

    // Press FAB again to collapse
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    expect(queryByTestId("fab-expense")).toBeNull();
  });

  it("expense option has correct accessibility label", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    const expenseButton = getByTestId("fab-expense");
    expect(expenseButton.props.accessibilityLabel).toBe("Add Expense");
  });

  it("income option has correct accessibility label", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    const incomeButton = getByTestId("fab-income");
    expect(incomeButton.props.accessibilityLabel).toBe("Add Income");
  });

  it("triggers light haptic feedback on expand", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light
    );
  });

  it("triggers medium haptic feedback on option selection", async () => {
    const { getByTestId } = render(
      <ExpandableFAB
        onAddExpense={mockOnAddExpense}
        onAddIncome={mockOnAddIncome}
        testID="fab"
      />
    );

    // Expand FAB
    await act(async () => {
      fireEvent.press(getByTestId("fab"));
      jest.runAllTimers();
    });

    // Clear the light haptic from expand
    (Haptics.impactAsync as jest.Mock).mockClear();

    // Press expense option
    await act(async () => {
      fireEvent.press(getByTestId("fab-expense"));
      jest.runAllTimers();
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium
    );
  });
});
