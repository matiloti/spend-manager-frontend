import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DeleteAccountModal } from "@/components/account/DeleteAccountModal";
import { AccountWithBalance } from "@/services/accountService";

const mockAccountWithTransactions: AccountWithBalance = {
  id: "1",
  name: "Test Account",
  currency: "USD",
  colorCode: "#3B82F6",
  isActive: false,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
  transactionCount: 15,
};

const mockAccountEmpty: AccountWithBalance = {
  id: "2",
  name: "Empty Account",
  currency: "USD",
  colorCode: "#22C55E",
  isActive: false,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
  transactionCount: 0,
};

describe("DeleteAccountModal", () => {
  it("renders account name in title", () => {
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(getByText('Delete "Test Account"?')).toBeTruthy();
  });

  it("shows transaction warning when account has transactions", () => {
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(
      getByText("This account has 15 transactions that will also be deleted.")
    ).toBeTruthy();
  });

  it("requires name confirmation for account with transactions", () => {
    const { getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    const deleteButton = getByTestId("delete-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(true);
  });

  it("enables delete button when name is correctly typed", () => {
    const { getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.changeText(
      getByTestId("delete-confirm-input"),
      "Test Account"
    );

    const deleteButton = getByTestId("delete-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(false);
  });

  it("does not require confirmation for empty account", () => {
    const { queryByTestId, getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountEmpty}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(queryByTestId("delete-confirm-input")).toBeNull();
    const deleteButton = getByTestId("delete-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(false);
  });

  it("calls onClose when Cancel is pressed", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountEmpty}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.press(getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls onConfirm without name for empty account", () => {
    const onConfirmMock = jest.fn();
    const { getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountEmpty}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.press(getByTestId("delete-confirm-button"));
    expect(onConfirmMock).toHaveBeenCalledWith();
  });

  it("calls onConfirm with name for account with transactions", () => {
    const onConfirmMock = jest.fn();
    const { getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountWithTransactions}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.changeText(getByTestId("delete-confirm-input"), "Test Account");
    fireEvent.press(getByTestId("delete-confirm-button"));
    expect(onConfirmMock).toHaveBeenCalledWith("Test Account");
  });

  it("shows loading state when isDeleting", () => {
    const { getByTestId } = render(
      <DeleteAccountModal
        visible={true}
        account={mockAccountEmpty}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        isDeleting
      />
    );

    const deleteButton = getByTestId("delete-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(true);
  });
});
