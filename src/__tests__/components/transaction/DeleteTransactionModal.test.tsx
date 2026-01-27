import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DeleteTransactionModal } from "@/components/transaction/DeleteTransactionModal";
import { Transaction } from "@/types/models";

const mockTransaction: Transaction = {
  id: "1",
  accountId: "acc-1",
  categoryId: "cat-1",
  type: "EXPENSE",
  amount: 45.0,
  date: "2026-01-27",
  description: "Lunch with team",
  createdAt: "2026-01-27T10:30:00Z",
  updatedAt: "2026-01-27T10:30:00Z",
  category: {
    id: "cat-1",
    name: "Food",
    icon: "utensils",
    colorCode: "#F97316",
    type: "EXPENSE",
  },
};

describe("DeleteTransactionModal", () => {
  it("renders nothing when transaction is null", () => {
    const { queryByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={null}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(queryByText("Delete this transaction?")).toBeNull();
  });

  it("renders modal content when visible and transaction provided", () => {
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(getByText("Delete this transaction?")).toBeTruthy();
  });

  it("displays transaction amount correctly", () => {
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(getByText("-$45.00")).toBeTruthy();
  });

  it("displays transaction category", () => {
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(getByText("Food")).toBeTruthy();
  });

  it("displays transaction description when present", () => {
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(getByText("Lunch with team")).toBeTruthy();
  });

  it("calls onClose when Cancel button is pressed", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
      />
    );

    fireEvent.press(getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when Delete button is pressed", () => {
    const onConfirmMock = jest.fn();
    const { getByTestId } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />
    );

    fireEvent.press(getByTestId("delete-transaction-confirm-button"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it("shows loading state when isDeleting is true", () => {
    const { getByTestId } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={mockTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        isDeleting={true}
      />
    );

    const deleteButton = getByTestId("delete-transaction-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(true);
  });

  it("displays income transaction with positive amount", () => {
    const incomeTransaction: Transaction = {
      ...mockTransaction,
      type: "INCOME",
      amount: 1000,
    };
    const { getByText } = render(
      <DeleteTransactionModal
        visible={true}
        transaction={incomeTransaction}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />
    );
    expect(getByText("+$1,000.00")).toBeTruthy();
  });
});
