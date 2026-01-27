import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DeleteTagModal } from "@/components/tag/DeleteTagModal";
import { Tag } from "@/types/models";

// Mock the useTags hook
jest.mock("@/hooks/api/useTags", () => ({
  useTags: () => ({
    data: {
      content: [
        {
          id: "2",
          name: "replacement-tag",
          colorCode: "#22C55E",
          transactionCount: 3,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-27T00:00:00Z",
        },
        {
          id: "3",
          name: "another-tag",
          colorCode: "#EF4444",
          transactionCount: 0,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-27T00:00:00Z",
        },
      ],
    },
    isLoading: false,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockTagWithTransactions: Tag = {
  id: "1",
  name: "work-expenses",
  colorCode: "#3B82F6",
  transactionCount: 5,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

const mockTagWithoutTransactions: Tag = {
  id: "1",
  name: "empty-tag",
  colorCode: "#3B82F6",
  transactionCount: 0,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

describe("DeleteTagModal", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("renders nothing when tag is null", () => {
    const { queryByText } = render(
      <DeleteTagModal
        visible={true}
        tag={null}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    expect(queryByText("Delete Tag")).toBeNull();
  });

  it("renders tag name in confirmation message", () => {
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    expect(getByText('Delete "work-expenses"?')).toBeTruthy();
  });

  it("shows transaction count warning for tag with transactions", () => {
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    expect(getByText(/5/)).toBeTruthy();
  });

  it("shows safe delete message for tag without transactions", () => {
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithoutTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    expect(
      getByText(/has no transactions and can be deleted safely/)
    ).toBeTruthy();
  });

  it("calls onClose when Cancel button is pressed", () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={onClose}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    fireEvent.press(getByText("Cancel"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm with remove action for tag without transactions", () => {
    const onConfirm = jest.fn();
    const { getByTestId } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithoutTransactions}
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />,
      { wrapper }
    );

    fireEvent.press(getByTestId("delete-tag-confirm-button"));
    expect(onConfirm).toHaveBeenCalledWith("remove", undefined);
  });

  it("shows action options for tag with transactions", () => {
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    expect(getByText("Remove tag from all transactions")).toBeTruthy();
    expect(getByText("Replace with another tag")).toBeTruthy();
  });

  it("calls onConfirm with remove action when remove option is selected", () => {
    const onConfirm = jest.fn();
    const { getByTestId } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />,
      { wrapper }
    );

    // Remove option is selected by default
    fireEvent.press(getByTestId("delete-tag-confirm-button"));
    expect(onConfirm).toHaveBeenCalledWith("remove", undefined);
  });

  it("shows replacement tag list when reassign option is selected", async () => {
    const { getByText } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
      { wrapper }
    );

    fireEvent.press(getByText("Replace with another tag"));

    await waitFor(() => {
      expect(getByText("Select replacement tag:")).toBeTruthy();
      expect(getByText("replacement-tag")).toBeTruthy();
      expect(getByText("another-tag")).toBeTruthy();
    });
  });

  it("shows loading state when isDeleting is true", () => {
    const { getByTestId } = render(
      <DeleteTagModal
        visible={true}
        tag={mockTagWithTransactions}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        isDeleting={true}
      />,
      { wrapper }
    );

    const deleteButton = getByTestId("delete-tag-confirm-button");
    expect(deleteButton).toBeTruthy();
  });
});
