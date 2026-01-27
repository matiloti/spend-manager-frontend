import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeleteCategoryModal } from "@/components/category/DeleteCategoryModal";
import { Category } from "@/types/models";

// Mock the useCategories hook
jest.mock("@/hooks/api/useCategories", () => ({
  useCategoriesByType: jest.fn(() => ({
    data: {
      content: [
        {
          id: "2",
          name: "Transport",
          icon: "car",
          colorCode: "#3B82F6",
          type: "EXPENSE",
          isDefault: false,
          transactionCount: 5,
        },
        {
          id: "3",
          name: "Shopping",
          icon: "shopping-bag",
          colorCode: "#EC4899",
          type: "EXPENSE",
          isDefault: false,
          transactionCount: 8,
        },
      ],
      page: { number: 0, size: 50, totalElements: 2, totalPages: 1 },
    },
    isLoading: false,
  })),
}));

const mockCategoryWithTransactions: Category = {
  id: "1",
  name: "Food",
  icon: "utensils",
  colorCode: "#F97316",
  type: "EXPENSE",
  isDefault: false,
  transactionCount: 12,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

const mockCategoryWithoutTransactions: Category = {
  ...mockCategoryWithTransactions,
  transactionCount: 0,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("DeleteCategoryModal", () => {
  it("renders nothing when category is null", () => {
    const { queryByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={null}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(queryByText("Delete Category")).toBeNull();
  });

  it("renders category name in confirmation message", () => {
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(getByText('Delete "Food"?')).toBeTruthy();
  });

  it("shows transaction count warning when category has transactions", () => {
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    // Check that the warning message contains the transaction count
    expect(getByText(/This category has/)).toBeTruthy();
    expect(getByText(/12/)).toBeTruthy();
  });

  it("shows safe deletion message when category has no transactions", () => {
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithoutTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(
      getByText(/This category has no transactions and can be deleted safely/)
    ).toBeTruthy();
  });

  it("shows replacement category selection when category has transactions", () => {
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    expect(getByText("Move transactions to:")).toBeTruthy();
    expect(getByText("Transport")).toBeTruthy();
    expect(getByText("Shopping")).toBeTruthy();
  });

  it("calls onClose when cancel is pressed", () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithoutTransactions}
        onClose={onCloseMock}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.press(getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm without replacement when no transactions", () => {
    const onConfirmMock = jest.fn();
    const { getByText } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithoutTransactions}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />,
      { wrapper: createWrapper() }
    );

    fireEvent.press(getByText("Delete"));
    expect(onConfirmMock).toHaveBeenCalledWith(undefined);
  });

  it("delete button is disabled when replacement is required but not selected", () => {
    const { getByTestId } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper: createWrapper() }
    );

    const deleteButton = getByTestId("delete-category-confirm-button");
    expect(deleteButton.props.accessibilityState.disabled).toBe(true);
  });

  it("calls onConfirm with replacement ID when selected and delete pressed", async () => {
    const onConfirmMock = jest.fn();
    const { getByText, getByTestId } = render(
      <DeleteCategoryModal
        visible={true}
        category={mockCategoryWithTransactions}
        onClose={jest.fn()}
        onConfirm={onConfirmMock}
      />,
      { wrapper: createWrapper() }
    );

    // Select a replacement category
    fireEvent.press(getByText("Transport"));

    // Now the delete button should be enabled
    await waitFor(() => {
      fireEvent.press(getByTestId("delete-category-confirm-button"));
      expect(onConfirmMock).toHaveBeenCalledWith("2");
    });
  });
});
