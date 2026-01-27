import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccountCard } from "@/components/account/AccountCard";
import { AccountWithBalance } from "@/services/accountService";

const mockAccount: AccountWithBalance = {
  id: "1",
  name: "Personal",
  description: "My personal account",
  currency: "USD",
  colorCode: "#3B82F6",
  isActive: false,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
  balance: {
    totalIncome: 1000,
    totalExpenses: 500,
    netBalance: 500,
  },
};

describe("AccountCard", () => {
  it("renders account name", () => {
    const { getByText } = render(<AccountCard account={mockAccount} />);
    expect(getByText("Personal")).toBeTruthy();
  });

  it("renders account description when provided", () => {
    const { getByText } = render(<AccountCard account={mockAccount} />);
    expect(getByText("My personal account")).toBeTruthy();
  });

  it("renders balance correctly", () => {
    const { getByText } = render(<AccountCard account={mockAccount} />);
    expect(getByText("$500.00")).toBeTruthy();
  });

  it("shows Active badge when account is active", () => {
    const activeAccount = { ...mockAccount, isActive: true };
    const { getByText } = render(<AccountCard account={activeAccount} />);
    expect(getByText("Active")).toBeTruthy();
  });

  it("does not show Active badge when account is not active", () => {
    const { queryByText } = render(<AccountCard account={mockAccount} />);
    expect(queryByText("Active")).toBeNull();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <AccountCard account={mockAccount} onPress={onPressMock} />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long pressed", () => {
    const onLongPressMock = jest.fn();
    const { getByRole } = render(
      <AccountCard account={mockAccount} onLongPress={onLongPressMock} />
    );

    fireEvent(getByRole("button"), "longPress");
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });

  it("renders negative balance with expense color", () => {
    const negativeBalanceAccount = {
      ...mockAccount,
      balance: {
        totalIncome: 500,
        totalExpenses: 1000,
        netBalance: -500,
      },
    };
    const { getByText } = render(
      <AccountCard account={negativeBalanceAccount} />
    );
    expect(getByText("-$500.00")).toBeTruthy();
  });

  it("has correct accessibility label", () => {
    const { getByRole } = render(<AccountCard account={mockAccount} />);
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toContain("Account Personal");
  });

  it("includes active in accessibility label when active", () => {
    const activeAccount = { ...mockAccount, isActive: true };
    const { getByRole } = render(<AccountCard account={activeAccount} />);
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toContain("active");
  });
});
