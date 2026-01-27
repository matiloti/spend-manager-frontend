import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders label when provided", () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText("Email")).toBeTruthy();
  });

  it("renders placeholder text", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter email" />
    );
    expect(getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("calls onChangeText when text changes", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeTextMock} />
    );

    fireEvent.changeText(getByPlaceholderText("Enter text"), "new value");
    expect(onChangeTextMock).toHaveBeenCalledWith("new value");
  });

  it("displays error message when provided", () => {
    const { getByText } = render(<Input error="This field is required" />);
    expect(getByText("This field is required")).toBeTruthy();
  });

  it("displays helper text when provided", () => {
    const { getByText } = render(<Input helperText="Enter a valid email" />);
    expect(getByText("Enter a valid email")).toBeTruthy();
  });

  it("does not show helper text when error is present", () => {
    const { queryByText, getByText } = render(
      <Input helperText="Helper text" error="Error text" />
    );
    expect(getByText("Error text")).toBeTruthy();
    expect(queryByText("Helper text")).toBeNull();
  });

  it("applies disabled state correctly", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test" editable={false} />
    );
    const input = getByPlaceholderText("Test");
    expect(input.props.editable).toBe(false);
  });
});
