import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "@/components/search/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={jest.fn()} />
    );
    expect(getByPlaceholderText("Search transactions...")).toBeTruthy();
  });

  it("displays the value correctly", () => {
    const { getByDisplayValue } = render(
      <SearchBar value="test query" onChangeText={jest.fn()} />
    );
    expect(getByDisplayValue("test query")).toBeTruthy();
  });

  it("calls onChangeText when text is entered", () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeTextMock} />
    );

    fireEvent.changeText(getByPlaceholderText("Search transactions..."), "new search");
    expect(onChangeTextMock).toHaveBeenCalledWith("new search");
  });

  it("shows clear button when value is not empty", () => {
    const { getByLabelText } = render(
      <SearchBar value="some text" onChangeText={jest.fn()} testID="search" />
    );
    expect(getByLabelText("Clear search")).toBeTruthy();
  });

  it("hides clear button when value is empty", () => {
    const { queryByLabelText } = render(
      <SearchBar value="" onChangeText={jest.fn()} testID="search" />
    );
    expect(queryByLabelText("Clear search")).toBeNull();
  });

  it("clears text when clear button is pressed", () => {
    const onChangeTextMock = jest.fn();
    const onClearMock = jest.fn();
    const { getByLabelText } = render(
      <SearchBar
        value="some text"
        onChangeText={onChangeTextMock}
        onClear={onClearMock}
      />
    );

    fireEvent.press(getByLabelText("Clear search"));
    expect(onChangeTextMock).toHaveBeenCalledWith("");
    expect(onClearMock).toHaveBeenCalled();
  });

  it("has correct accessibility label", () => {
    const { getByLabelText } = render(
      <SearchBar value="" onChangeText={jest.fn()} />
    );
    expect(getByLabelText("Search transactions")).toBeTruthy();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <SearchBar value="" onChangeText={jest.fn()} testID="search-bar" />
    );
    expect(getByTestId("search-bar")).toBeTruthy();
  });
});
