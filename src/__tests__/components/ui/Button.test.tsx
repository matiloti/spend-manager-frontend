import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children correctly", () => {
    const { getByText } = render(<Button onPress={() => {}}>Test Button</Button>);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button onPress={onPressMock}>Press Me</Button>
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button onPress={onPressMock} disabled>
        Disabled Button
      </Button>
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it("shows loading indicator when loading", () => {
    const { queryByText, getByRole } = render(
      <Button onPress={() => {}} loading>
        Loading Button
      </Button>
    );

    expect(queryByText("Loading Button")).toBeNull();
  });

  it("does not call onPress when loading", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <Button onPress={onPressMock} loading>
        Loading
      </Button>
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it("applies correct accessibility props", () => {
    const { getByRole } = render(
      <Button onPress={() => {}} disabled>
        Accessible Button
      </Button>
    );

    const button = getByRole("button");
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
