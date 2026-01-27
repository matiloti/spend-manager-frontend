import React from "react";
import { render } from "@testing-library/react-native";
import {
  PasswordRequirements,
  validatePassword,
} from "@/components/auth/PasswordRequirements";

describe("validatePassword", () => {
  describe("minLength requirement", () => {
    it("fails if password is less than 8 characters", () => {
      const { requirements } = validatePassword("Short1!");
      expect(requirements.minLength).toBe(false);
    });

    it("passes if password is exactly 8 characters", () => {
      const { requirements } = validatePassword("Exactly8");
      expect(requirements.minLength).toBe(true);
    });

    it("passes if password is more than 8 characters", () => {
      const { requirements } = validatePassword("LongerPassword123");
      expect(requirements.minLength).toBe(true);
    });
  });

  describe("uppercase requirement", () => {
    it("fails if password has no uppercase letters", () => {
      const { requirements } = validatePassword("lowercase123!");
      expect(requirements.hasUppercase).toBe(false);
    });

    it("passes if password has at least one uppercase letter", () => {
      const { requirements } = validatePassword("Uppercase123!");
      expect(requirements.hasUppercase).toBe(true);
    });

    it("passes with multiple uppercase letters", () => {
      const { requirements } = validatePassword("MULTIPLE123!");
      expect(requirements.hasUppercase).toBe(true);
    });
  });

  describe("lowercase requirement", () => {
    it("fails if password has no lowercase letters", () => {
      const { requirements } = validatePassword("UPPERCASE123!");
      expect(requirements.hasLowercase).toBe(false);
    });

    it("passes if password has at least one lowercase letter", () => {
      const { requirements } = validatePassword("Lowercase123!");
      expect(requirements.hasLowercase).toBe(true);
    });
  });

  describe("number requirement", () => {
    it("fails if password has no numbers", () => {
      const { requirements } = validatePassword("NoNumbers!");
      expect(requirements.hasNumber).toBe(false);
    });

    it("passes if password has at least one number", () => {
      const { requirements } = validatePassword("HasNumber1!");
      expect(requirements.hasNumber).toBe(true);
    });

    it("passes with multiple numbers", () => {
      const { requirements } = validatePassword("Numbers123!");
      expect(requirements.hasNumber).toBe(true);
    });
  });

  describe("special character requirement", () => {
    it("fails if password has no special characters", () => {
      const { requirements } = validatePassword("NoSpecialChar1");
      expect(requirements.hasSpecialChar).toBe(false);
    });

    it("passes with exclamation mark", () => {
      const { requirements } = validatePassword("Password1!");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with at sign", () => {
      const { requirements } = validatePassword("Password1@");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with hash", () => {
      const { requirements } = validatePassword("Password1#");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with dollar sign", () => {
      const { requirements } = validatePassword("Password1$");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with percent", () => {
      const { requirements } = validatePassword("Password1%");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with caret", () => {
      const { requirements } = validatePassword("Password1^");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with ampersand", () => {
      const { requirements } = validatePassword("Password1&");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with asterisk", () => {
      const { requirements } = validatePassword("Password1*");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with parentheses", () => {
      const { requirements: req1 } = validatePassword("Password1(");
      const { requirements: req2 } = validatePassword("Password1)");
      expect(req1.hasSpecialChar).toBe(true);
      expect(req2.hasSpecialChar).toBe(true);
    });

    it("passes with comma or period", () => {
      const { requirements: req1 } = validatePassword("Password1,");
      const { requirements: req2 } = validatePassword("Password1.");
      expect(req1.hasSpecialChar).toBe(true);
      expect(req2.hasSpecialChar).toBe(true);
    });

    it("passes with question mark", () => {
      const { requirements } = validatePassword("Password1?");
      expect(requirements.hasSpecialChar).toBe(true);
    });

    it("passes with quotes", () => {
      const { requirements: req1 } = validatePassword('Password1"');
      const { requirements: req2 } = validatePassword("Password1:");
      expect(req1.hasSpecialChar).toBe(true);
      expect(req2.hasSpecialChar).toBe(true);
    });

    it("passes with braces and brackets", () => {
      const { requirements: req1 } = validatePassword("Password1{");
      const { requirements: req2 } = validatePassword("Password1}");
      const { requirements: req3 } = validatePassword("Password1|");
      const { requirements: req4 } = validatePassword("Password1<");
      const { requirements: req5 } = validatePassword("Password1>");
      expect(req1.hasSpecialChar).toBe(true);
      expect(req2.hasSpecialChar).toBe(true);
      expect(req3.hasSpecialChar).toBe(true);
      expect(req4.hasSpecialChar).toBe(true);
      expect(req5.hasSpecialChar).toBe(true);
    });
  });

  describe("isValid", () => {
    it("returns false if any requirement is not met", () => {
      // Missing uppercase
      expect(validatePassword("password123!").isValid).toBe(false);

      // Missing lowercase
      expect(validatePassword("PASSWORD123!").isValid).toBe(false);

      // Missing number
      expect(validatePassword("Password!!").isValid).toBe(false);

      // Missing special char
      expect(validatePassword("Password123").isValid).toBe(false);

      // Too short
      expect(validatePassword("Pass1!").isValid).toBe(false);
    });

    it("returns true when all requirements are met", () => {
      expect(validatePassword("Password123!").isValid).toBe(true);
      expect(validatePassword("MySecure@Pass1").isValid).toBe(true);
      expect(validatePassword("C0mplex!Password").isValid).toBe(true);
    });
  });

  describe("empty password", () => {
    it("fails all requirements for empty string", () => {
      const { isValid, requirements } = validatePassword("");
      expect(isValid).toBe(false);
      expect(requirements.minLength).toBe(false);
      expect(requirements.hasUppercase).toBe(false);
      expect(requirements.hasLowercase).toBe(false);
      expect(requirements.hasNumber).toBe(false);
      expect(requirements.hasSpecialChar).toBe(false);
    });
  });
});

describe("PasswordRequirements component", () => {
  describe("visibility", () => {
    it("renders when show is true (default)", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("Password requirements:")).toBeTruthy();
    });

    it("does not render when show is false", () => {
      const { queryByText } = render(
        <PasswordRequirements password="" show={false} />
      );
      expect(queryByText("Password requirements:")).toBeNull();
    });
  });

  describe("requirement labels", () => {
    it("displays minimum length requirement", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("At least 8 characters")).toBeTruthy();
    });

    it("displays uppercase requirement", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("At least one uppercase letter")).toBeTruthy();
    });

    it("displays lowercase requirement", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("At least one lowercase letter")).toBeTruthy();
    });

    it("displays number requirement", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("At least one number")).toBeTruthy();
    });

    it("displays special character requirement", () => {
      const { getByText } = render(<PasswordRequirements password="" />);
      expect(getByText("At least one special character")).toBeTruthy();
    });
  });

  describe("requirement icons", () => {
    it("shows X icon for unmet requirements", () => {
      const { getAllByTestId } = render(<PasswordRequirements password="" />);

      // All requirements unmet for empty password
      const xIcons = getAllByTestId("X-icon");
      expect(xIcons.length).toBe(5);
    });

    it("shows Check icon for met requirements", () => {
      const { getAllByTestId } = render(
        <PasswordRequirements password="Password123!" />
      );

      // All requirements met
      const checkIcons = getAllByTestId("Check-icon");
      expect(checkIcons.length).toBe(5);
    });

    it("shows mixed icons for partially met requirements", () => {
      // Only has lowercase and number, missing uppercase, special char, and length
      const { getAllByTestId } = render(
        <PasswordRequirements password="pass1" />
      );

      const xIcons = getAllByTestId("X-icon");
      const checkIcons = getAllByTestId("Check-icon");

      // Should have some of each
      expect(xIcons.length).toBeGreaterThan(0);
      expect(checkIcons.length).toBeGreaterThan(0);
    });
  });

  describe("real-time validation", () => {
    it("updates as password changes - empty to partial", () => {
      const { rerender, getAllByTestId } = render(
        <PasswordRequirements password="" />
      );

      // Initially all unmet
      expect(getAllByTestId("X-icon").length).toBe(5);

      // Add uppercase letter
      rerender(<PasswordRequirements password="A" />);

      // Now some requirements are met
      expect(getAllByTestId("Check-icon").length).toBeGreaterThan(0);
    });

    it("updates as password becomes fully valid", () => {
      const { rerender, getAllByTestId, queryAllByTestId } = render(
        <PasswordRequirements password="p" />
      );

      // Partially valid
      const initialCheckCount = getAllByTestId("Check-icon").length;
      expect(initialCheckCount).toBeGreaterThan(0);

      // Make fully valid
      rerender(<PasswordRequirements password="Password123!" />);

      // All requirements met
      expect(getAllByTestId("Check-icon").length).toBe(5);
      expect(queryAllByTestId("X-icon").length).toBe(0);
    });
  });
});
