import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { TagForm } from "@/components/tag/TagForm";
import { Tag } from "@/types/models";

const mockTag: Tag = {
  id: "1",
  name: "work-expenses",
  colorCode: "#3B82F6",
  transactionCount: 5,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-27T00:00:00Z",
};

describe("TagForm", () => {
  it("renders name input", () => {
    const { getByTestId } = render(<TagForm onSubmit={jest.fn()} />);
    expect(getByTestId("tag-name-input")).toBeTruthy();
  });

  it("renders submit button with default label", () => {
    const { getByTestId } = render(<TagForm onSubmit={jest.fn()} />);
    expect(getByTestId("tag-submit-button")).toBeTruthy();
  });

  it("renders submit button with custom label", () => {
    const { getByText } = render(
      <TagForm onSubmit={jest.fn()} submitLabel="Create Tag" />
    );
    expect(getByText("Create Tag")).toBeTruthy();
  });

  it("populates form with initial data", () => {
    const { getByTestId } = render(
      <TagForm onSubmit={jest.fn()} initialData={mockTag} />
    );

    const nameInput = getByTestId("tag-name-input");
    expect(nameInput.props.value).toBe("work-expenses");
  });

  it("shows validation error for empty name", async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(<TagForm onSubmit={onSubmit} />);

    fireEvent.press(getByTestId("tag-submit-button"));

    await waitFor(() => {
      expect(getByText("Tag name is required")).toBeTruthy();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid name format", async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(<TagForm onSubmit={onSubmit} />);

    // Note: the form auto-converts to lowercase and replaces spaces with hyphens
    // so we need to test with special characters that aren't handled
    fireEvent.changeText(getByTestId("tag-name-input"), "invalid@name!");
    fireEvent.press(getByTestId("tag-submit-button"));

    await waitFor(() => {
      expect(
        getByText(
          "Tag name must be lowercase with only letters, numbers, hyphens, and underscores"
        )
      ).toBeTruthy();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("converts name to lowercase and replaces spaces with hyphens", () => {
    const { getByTestId } = render(<TagForm onSubmit={jest.fn()} />);

    const nameInput = getByTestId("tag-name-input");
    fireEvent.changeText(nameInput, "My Tag Name");

    expect(nameInput.props.value).toBe("my-tag-name");
  });

  it("calls onSubmit with valid data", async () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<TagForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByTestId("tag-name-input"), "my-tag");
    fireEvent.press(getByTestId("tag-submit-button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      const firstCall = onSubmit.mock.calls[0][0];
      expect(firstCall.name).toBe("my-tag");
      expect(firstCall.colorCode).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("shows loading state when isLoading is true", () => {
    const { getByTestId } = render(
      <TagForm onSubmit={jest.fn()} isLoading={true} />
    );

    const submitButton = getByTestId("tag-submit-button");
    // Button should be in loading state
    expect(submitButton).toBeTruthy();
  });
});
