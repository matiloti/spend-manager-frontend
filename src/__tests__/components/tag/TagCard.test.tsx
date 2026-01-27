import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TagCard } from "@/components/tag/TagCard";
import { Tag } from "@/types/models";

const mockTag: Tag = {
  id: "1",
  name: "work-expenses",
  colorCode: "#3B82F6",
  transactionCount: 12,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

describe("TagCard", () => {
  it("renders tag name", () => {
    const { getByText } = render(<TagCard tag={mockTag} />);
    expect(getByText("work-expenses")).toBeTruthy();
  });

  it("renders transaction count correctly", () => {
    const { getByText } = render(<TagCard tag={mockTag} />);
    expect(getByText("12 transactions")).toBeTruthy();
  });

  it("renders singular transaction text for count of 1", () => {
    const singleTransactionTag = { ...mockTag, transactionCount: 1 };
    const { getByText } = render(<TagCard tag={singleTransactionTag} />);
    expect(getByText("1 transaction")).toBeTruthy();
  });

  it("renders 'No transactions' for count of 0", () => {
    const noTransactionsTag = { ...mockTag, transactionCount: 0 };
    const { getByText } = render(<TagCard tag={noTransactionsTag} />);
    expect(getByText("No transactions")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByRole } = render(
      <TagCard tag={mockTag} onPress={onPressMock} />
    );

    fireEvent.press(getByRole("button"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long pressed", () => {
    const onLongPressMock = jest.fn();
    const { getByRole } = render(
      <TagCard tag={mockTag} onLongPress={onLongPressMock} />
    );

    fireEvent(getByRole("button"), "longPress");
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
  });

  it("has correct accessibility label", () => {
    const { getByRole } = render(<TagCard tag={mockTag} />);
    const card = getByRole("button");
    expect(card.props.accessibilityLabel).toBe("Tag work-expenses");
  });

  it("does not show transaction count when showTransactionCount is false", () => {
    const { queryByText } = render(
      <TagCard tag={mockTag} showTransactionCount={false} />
    );
    expect(queryByText("12 transactions")).toBeNull();
  });

  it("does not show chevron when showChevron is false", () => {
    const { queryByTestId } = render(
      <TagCard tag={mockTag} showChevron={false} />
    );
    expect(queryByTestId("ChevronRight-icon")).toBeNull();
  });
});
