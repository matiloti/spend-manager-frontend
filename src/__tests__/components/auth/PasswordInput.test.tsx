import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { PasswordInput } from "@/components/auth/PasswordInput";

describe("PasswordInput", () => {
  const defaultProps = {
    value: "",
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders with default label", () => {
      const { getByText } = render(<PasswordInput {...defaultProps} />);
      expect(getByText("Password")).toBeTruthy();
    });

    it("renders with custom label", () => {
      const { getByText } = render(
        <PasswordInput {...defaultProps} label="Confirm Password" />
      );
      expect(getByText("Confirm Password")).toBeTruthy();
    });

    it("renders with default placeholder", () => {
      const { getByPlaceholderText } = render(<PasswordInput {...defaultProps} />);
      expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    });

    it("renders with custom placeholder", () => {
      const { getByPlaceholderText } = render(
        <PasswordInput {...defaultProps} placeholder="Type password here" />
      );
      expect(getByPlaceholderText("Type password here")).toBeTruthy();
    });

    it("displays the provided value", () => {
      const { getByDisplayValue } = render(
        <PasswordInput {...defaultProps} value="mypassword123" />
      );
      expect(getByDisplayValue("mypassword123")).toBeTruthy();
    });

    it("displays error message when provided", () => {
      const { getByText } = render(
        <PasswordInput {...defaultProps} error="Password is required" />
      );
      expect(getByText("Password is required")).toBeTruthy();
    });

    it("displays helper text when provided", () => {
      const { getByText } = render(
        <PasswordInput {...defaultProps} helperText="Enter a strong password" />
      );
      expect(getByText("Enter a strong password")).toBeTruthy();
    });
  });

  describe("password visibility toggle", () => {
    it("hides password by default (secureTextEntry true)", () => {
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      const input = getByTestId("password-field");
      expect(input.props.secureTextEntry).toBe(true);
    });

    it("shows Eye icon when password is hidden", () => {
      const { getByTestId } = render(<PasswordInput {...defaultProps} />);
      expect(getByTestId("Eye-icon")).toBeTruthy();
    });

    it("toggles visibility when toggle button is pressed", () => {
      const { getByTestId, getByLabelText } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      // Initially hidden
      expect(getByTestId("password-field").props.secureTextEntry).toBe(true);

      // Press toggle button
      const toggleButton = getByLabelText("Show password");
      fireEvent.press(toggleButton);

      // Now visible
      expect(getByTestId("password-field").props.secureTextEntry).toBe(false);
    });

    it("shows EyeOff icon when password is visible", () => {
      const { getByTestId, getByLabelText } = render(<PasswordInput {...defaultProps} />);

      // Press toggle to show password
      fireEvent.press(getByLabelText("Show password"));

      // EyeOff icon should be visible
      expect(getByTestId("EyeOff-icon")).toBeTruthy();
    });

    it("toggles back to hidden when pressed again", () => {
      const { getByTestId, getByLabelText } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      // Press toggle twice
      const toggleButton = getByLabelText("Show password");
      fireEvent.press(toggleButton);

      const hideButton = getByLabelText("Hide password");
      fireEvent.press(hideButton);

      // Back to hidden
      expect(getByTestId("password-field").props.secureTextEntry).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("has accessibility label for show password button", () => {
      const { getByLabelText } = render(<PasswordInput {...defaultProps} />);
      expect(getByLabelText("Show password")).toBeTruthy();
    });

    it("has accessibility label for hide password button when visible", () => {
      const { getByLabelText } = render(<PasswordInput {...defaultProps} />);

      // Show password first
      fireEvent.press(getByLabelText("Show password"));

      // Now check for hide label
      expect(getByLabelText("Hide password")).toBeTruthy();
    });
  });

  describe("input handling", () => {
    it("calls onChangeText when text changes", () => {
      const onChangeText = jest.fn();
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} onChangeText={onChangeText} testID="password-field" />
      );

      fireEvent.changeText(getByTestId("password-field"), "newpassword");

      expect(onChangeText).toHaveBeenCalledWith("newpassword");
    });

    it("calls onBlur when input loses focus", () => {
      const onBlur = jest.fn();
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} onBlur={onBlur} testID="password-field" />
      );

      fireEvent(getByTestId("password-field"), "blur");

      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe("input configuration", () => {
    it("has autoCapitalize set to none", () => {
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      expect(getByTestId("password-field").props.autoCapitalize).toBe("none");
    });

    it("has autoCorrect disabled", () => {
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      expect(getByTestId("password-field").props.autoCorrect).toBe(false);
    });
  });

  describe("autoFocus", () => {
    it("does not autoFocus by default", () => {
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} testID="password-field" />
      );

      expect(getByTestId("password-field").props.autoFocus).toBe(false);
    });

    it("autoFocuses when autoFocus prop is true", () => {
      const { getByTestId } = render(
        <PasswordInput {...defaultProps} testID="password-field" autoFocus />
      );

      expect(getByTestId("password-field").props.autoFocus).toBe(true);
    });
  });
});
