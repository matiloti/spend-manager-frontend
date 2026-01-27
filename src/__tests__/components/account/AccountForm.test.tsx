import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AccountForm } from "@/components/account/AccountForm";

describe("AccountForm", () => {
  it("renders all form fields", () => {
    const { getByText, getByTestId } = render(
      <AccountForm onSubmit={jest.fn()} />
    );

    expect(getByText("Account Name")).toBeTruthy();
    expect(getByText("Description (Optional)")).toBeTruthy();
    expect(getByText("Currency")).toBeTruthy();
    expect(getByText("Account Color")).toBeTruthy();
  });

  it("shows validation error when name is empty", async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId, findByText } = render(
      <AccountForm onSubmit={onSubmitMock} />
    );

    fireEvent.press(getByTestId("account-submit-button"));

    const error = await findByText("Account name is required");
    expect(error).toBeTruthy();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("calls onSubmit with form data when valid", async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId } = render(<AccountForm onSubmit={onSubmitMock} />);

    fireEvent.changeText(getByTestId("account-name-input"), "Test Account");
    fireEvent.press(getByTestId("account-submit-button"));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      const [formData] = onSubmitMock.mock.calls[0];
      expect(formData.name).toBe("Test Account");
      expect(formData.colorCode).toBeDefined();
    });
  });

  it("populates initial data when provided", () => {
    const initialData = {
      name: "Existing Account",
      description: "Test description",
      currency: "EUR",
      colorCode: "#22C55E",
    };

    const { getByTestId } = render(
      <AccountForm initialData={initialData} onSubmit={jest.fn()} />
    );

    expect(getByTestId("account-name-input").props.value).toBe("Existing Account");
    expect(getByTestId("account-description-input").props.value).toBe("Test description");
    expect(getByTestId("account-currency-input").props.value).toBe("EUR");
  });

  it("shows loading state on submit button when isLoading", () => {
    const { getByTestId } = render(
      <AccountForm onSubmit={jest.fn()} isLoading />
    );

    const button = getByTestId("account-submit-button");
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it("uses custom submit label when provided", () => {
    const { getByText } = render(
      <AccountForm onSubmit={jest.fn()} submitLabel="Create Account" />
    );

    expect(getByText("Create Account")).toBeTruthy();
  });

  it("validates name length", async () => {
    const longName = "a".repeat(51);
    const { getByTestId, findByText } = render(
      <AccountForm onSubmit={jest.fn()} />
    );

    fireEvent.changeText(getByTestId("account-name-input"), longName);
    fireEvent.press(getByTestId("account-submit-button"));

    const error = await findByText("Account name must be 50 characters or less");
    expect(error).toBeTruthy();
  });
});
