import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccountFilter } from "@/components/statistics/AccountFilter";
import { Account } from "@/types/models";

const mockAccounts: Account[] = [
  {
    id: "1",
    name: "Personal",
    colorCode: "#3B82F6",
    currency: "USD",
    isActive: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    name: "Business",
    colorCode: "#22C55E",
    currency: "USD",
    isActive: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "3",
    name: "Savings",
    colorCode: "#A855F7",
    currency: "USD",
    isActive: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
];

describe("AccountFilter", () => {
  const defaultProps = {
    accounts: mockAccounts,
    selectedAccountId: null,
    onAccountChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders All Accounts chip", () => {
    const { getByText } = render(<AccountFilter {...defaultProps} />);

    expect(getByText("All Accounts")).toBeTruthy();
  });

  it("renders all account chips", () => {
    const { getByText } = render(<AccountFilter {...defaultProps} />);

    expect(getByText("Personal")).toBeTruthy();
    expect(getByText("Business")).toBeTruthy();
    expect(getByText("Savings")).toBeTruthy();
  });

  it("calls onAccountChange with null when All Accounts is pressed", () => {
    const onAccountChange = jest.fn();
    const { getByTestId } = render(
      <AccountFilter
        {...defaultProps}
        selectedAccountId="1"
        onAccountChange={onAccountChange}
      />
    );

    fireEvent.press(getByTestId("statistics-account-all"));
    expect(onAccountChange).toHaveBeenCalledWith(null);
  });

  it("calls onAccountChange with account ID when account is pressed", () => {
    const onAccountChange = jest.fn();
    const { getByTestId } = render(
      <AccountFilter {...defaultProps} onAccountChange={onAccountChange} />
    );

    fireEvent.press(getByTestId("statistics-account-1"));
    expect(onAccountChange).toHaveBeenCalledWith("1");
  });

  it("shows All Accounts as selected when selectedAccountId is null", () => {
    const { getByTestId } = render(
      <AccountFilter {...defaultProps} selectedAccountId={null} />
    );

    const allAccountsChip = getByTestId("statistics-account-all");
    expect(allAccountsChip.props.accessibilityState.selected).toBe(true);
  });

  it("shows specific account as selected when selectedAccountId matches", () => {
    const { getByTestId } = render(
      <AccountFilter {...defaultProps} selectedAccountId="2" />
    );

    const businessChip = getByTestId("statistics-account-2");
    expect(businessChip.props.accessibilityState.selected).toBe(true);

    const allAccountsChip = getByTestId("statistics-account-all");
    expect(allAccountsChip.props.accessibilityState.selected).toBe(false);
  });

  it("renders empty when no accounts", () => {
    const { getByText, queryByText } = render(
      <AccountFilter {...defaultProps} accounts={[]} />
    );

    expect(getByText("All Accounts")).toBeTruthy();
    expect(queryByText("Personal")).toBeNull();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <AccountFilter {...defaultProps} testID="account-filter" />
    );

    expect(getByTestId("account-filter")).toBeTruthy();
  });
});
