import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TypeToggle } from "@/components/category/TypeToggle";

describe("TypeToggle", () => {
  it("renders expense and income options", () => {
    const { getByText } = render(
      <TypeToggle value="EXPENSE" onChange={jest.fn()} />
    );
    expect(getByText("Expense")).toBeTruthy();
    expect(getByText("Income")).toBeTruthy();
  });

  it("calls onChange with EXPENSE when expense is pressed", () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <TypeToggle value="INCOME" onChange={onChangeMock} />
    );

    fireEvent.press(getByText("Expense"));
    expect(onChangeMock).toHaveBeenCalledWith("EXPENSE");
  });

  it("calls onChange with INCOME when income is pressed", () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <TypeToggle value="EXPENSE" onChange={onChangeMock} />
    );

    fireEvent.press(getByText("Income"));
    expect(onChangeMock).toHaveBeenCalledWith("INCOME");
  });

  it("does not call onChange when disabled", () => {
    const onChangeMock = jest.fn();
    const { getByText } = render(
      <TypeToggle value="EXPENSE" onChange={onChangeMock} disabled />
    );

    fireEvent.press(getByText("Income"));
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it("expense button has selected state when value is EXPENSE", () => {
    const { getByLabelText } = render(
      <TypeToggle value="EXPENSE" onChange={jest.fn()} />
    );

    const expenseButton = getByLabelText("Expense category");
    expect(expenseButton.props.accessibilityState.selected).toBe(true);
  });

  it("income button has selected state when value is INCOME", () => {
    const { getByLabelText } = render(
      <TypeToggle value="INCOME" onChange={jest.fn()} />
    );

    const incomeButton = getByLabelText("Income category");
    expect(incomeButton.props.accessibilityState.selected).toBe(true);
  });
});
