import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AmountInput } from "@/components/forms/AmountInput";

describe("AmountInput", () => {
  it("renders with label", () => {
    const { getByText } = render(
      <AmountInput value={undefined} onChange={jest.fn()} label="Amount" />
    );
    expect(getByText("Amount")).toBeTruthy();
  });

  it("displays initial value formatted correctly", () => {
    const { getByTestId } = render(
      <AmountInput
        value={25.5}
        onChange={jest.fn()}
        testID="amount-input"
      />
    );
    const input = getByTestId("amount-input-input");
    expect(input.props.value).toBe("25.50");
  });

  it("calls onChange with parsed number", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <AmountInput
        value={undefined}
        onChange={onChangeMock}
        testID="amount-input"
      />
    );

    const input = getByTestId("amount-input-input");
    fireEvent.changeText(input, "42.50");
    expect(onChangeMock).toHaveBeenCalledWith(42.5);
  });

  it("displays error message when provided", () => {
    const { getByText } = render(
      <AmountInput
        value={undefined}
        onChange={jest.fn()}
        error="Amount is required"
      />
    );
    expect(getByText("Amount is required")).toBeTruthy();
  });

  it("displays custom currency symbol", () => {
    const { getByText } = render(
      <AmountInput value={undefined} onChange={jest.fn()} currency="EUR" />
    );
    expect(getByText("EUR")).toBeTruthy();
  });

  it("strips non-numeric characters", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <AmountInput
        value={undefined}
        onChange={onChangeMock}
        testID="amount-input"
      />
    );

    const input = getByTestId("amount-input-input");
    fireEvent.changeText(input, "$50.abc00");
    expect(onChangeMock).toHaveBeenCalledWith(50);
  });

  it("limits decimal places to 2", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <AmountInput
        value={undefined}
        onChange={onChangeMock}
        testID="amount-input"
      />
    );

    const input = getByTestId("amount-input-input");
    fireEvent.changeText(input, "25.999");

    // Should only have 2 decimal places
    expect(input.props.value).toBe("25.99");
  });

  it("handles empty input", () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = render(
      <AmountInput
        value={100}
        onChange={onChangeMock}
        testID="amount-input"
      />
    );

    const input = getByTestId("amount-input-input");
    fireEvent.changeText(input, "");
    expect(onChangeMock).toHaveBeenCalledWith(undefined);
  });

  it("has correct accessibility label", () => {
    const { getByTestId } = render(
      <AmountInput
        value={undefined}
        onChange={jest.fn()}
        label="Enter amount"
        testID="amount-input"
      />
    );
    const input = getByTestId("amount-input-input");
    expect(input.props.accessibilityLabel).toBe("Enter amount");
  });
});
