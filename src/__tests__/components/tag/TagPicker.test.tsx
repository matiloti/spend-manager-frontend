import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TagPicker } from "@/components/tag/TagPicker";
import { Tag } from "@/types/models";

const mockTags: Tag[] = [
  {
    id: "1",
    name: "work-expenses",
    colorCode: "#3B82F6",
    transactionCount: 5,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-27T00:00:00Z",
  },
  {
    id: "2",
    name: "personal",
    colorCode: "#22C55E",
    transactionCount: 10,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-27T00:00:00Z",
  },
  {
    id: "3",
    name: "vacation",
    colorCode: "#EF4444",
    transactionCount: 3,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-27T00:00:00Z",
  },
];

// Mock the useTags and useCreateTag hooks
jest.mock("@/hooks/api/useTags", () => ({
  useTags: () => ({
    data: { content: mockTags },
    isLoading: false,
  }),
  useCreateTag: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      id: "new-id",
      name: "new-tag",
      colorCode: "#F97316",
    }),
    isPending: false,
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

describe("TagPicker", () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it("renders with placeholder when no tags selected", () => {
    const { getByText } = render(
      <TagPicker selectedTagIds={[]} onChange={jest.fn()} />,
      { wrapper }
    );

    expect(getByText("Add tags (optional)")).toBeTruthy();
  });

  it("renders label", () => {
    const { getByText } = render(
      <TagPicker selectedTagIds={[]} onChange={jest.fn()} label="Custom Tags" />,
      { wrapper }
    );

    expect(getByText("Custom Tags")).toBeTruthy();
  });

  it("displays selected tags", () => {
    const { getByText } = render(
      <TagPicker selectedTagIds={["1", "2"]} onChange={jest.fn()} />,
      { wrapper }
    );

    expect(getByText("work-expenses")).toBeTruthy();
    expect(getByText("personal")).toBeTruthy();
  });

  it("shows error message when error prop is provided", () => {
    const { getByText } = render(
      <TagPicker
        selectedTagIds={[]}
        onChange={jest.fn()}
        error="Too many tags selected"
      />,
      { wrapper }
    );

    expect(getByText("Too many tags selected")).toBeTruthy();
  });

  it("opens modal when trigger is pressed", async () => {
    const { getByText, getByTestId } = render(
      <TagPicker
        selectedTagIds={[]}
        onChange={jest.fn()}
        testID="tag-picker"
      />,
      { wrapper }
    );

    fireEvent.press(getByTestId("tag-picker-trigger"));

    await waitFor(() => {
      expect(getByText("Select Tags")).toBeTruthy();
    });
  });

  it("shows all available tags in modal", async () => {
    const { getByText, getByTestId } = render(
      <TagPicker
        selectedTagIds={[]}
        onChange={jest.fn()}
        testID="tag-picker"
      />,
      { wrapper }
    );

    fireEvent.press(getByTestId("tag-picker-trigger"));

    await waitFor(() => {
      expect(getByText("work-expenses")).toBeTruthy();
      expect(getByText("personal")).toBeTruthy();
      expect(getByText("vacation")).toBeTruthy();
    });
  });

  it("removes tag when X button is pressed on selected tag", () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <TagPicker
        selectedTagIds={["1"]}
        onChange={onChange}
        testID="tag-picker"
      />,
      { wrapper }
    );

    fireEvent.press(getByLabelText("Remove work-expenses"));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("shows selected count in modal header", async () => {
    const { getByText, getByTestId } = render(
      <TagPicker
        selectedTagIds={["1", "2"]}
        onChange={jest.fn()}
        testID="tag-picker"
      />,
      { wrapper }
    );

    fireEvent.press(getByTestId("tag-picker-trigger"));

    await waitFor(() => {
      expect(getByText("2/10 selected")).toBeTruthy();
    });
  });
});
