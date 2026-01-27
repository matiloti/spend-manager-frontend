import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterPanel, SearchFilters } from "@/components/search/FilterPanel";

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const INITIAL_FILTERS: SearchFilters = {
  categoryIds: [],
  tagIds: [],
  transactionType: null,
  startDate: null,
  endDate: null,
};

describe("FilterPanel", () => {
  const defaultProps = {
    filters: INITIAL_FILTERS,
    onFiltersChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders filter toggle button", () => {
    const { getByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(getByText("Filters")).toBeTruthy();
  });

  it("expands filter panel when toggle is pressed", () => {
    const { getByText, queryByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Initially collapsed - Transaction Type should not be visible
    expect(queryByText("Transaction Type")).toBeNull();

    // Expand
    fireEvent.press(getByText("Filters"));

    // Now Transaction Type should be visible
    expect(getByText("Transaction Type")).toBeTruthy();
  });

  it("shows active filter count badge when filters are applied", () => {
    const filtersWithType: SearchFilters = {
      ...INITIAL_FILTERS,
      transactionType: "EXPENSE",
    };

    const { getByText } = render(
      <FilterPanel {...defaultProps} filters={filtersWithType} />,
      { wrapper: createWrapper() }
    );

    expect(getByText("1")).toBeTruthy();
  });

  it("changes transaction type when type button is pressed", () => {
    const onFiltersChangeMock = jest.fn();
    const { getByText } = render(
      <FilterPanel {...defaultProps} onFiltersChange={onFiltersChangeMock} />,
      { wrapper: createWrapper() }
    );

    // Expand panel
    fireEvent.press(getByText("Filters"));

    // Press Expense button
    fireEvent.press(getByText("Expense"));

    expect(onFiltersChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionType: "EXPENSE",
      })
    );
  });

  it("shows All type as selected by default", () => {
    const { getByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Expand panel
    fireEvent.press(getByText("Filters"));

    // All button should be rendered
    expect(getByText("All")).toBeTruthy();
  });

  it("shows clear all button when filters are active", () => {
    const onClearAllMock = jest.fn();
    const filtersWithType: SearchFilters = {
      ...INITIAL_FILTERS,
      transactionType: "EXPENSE",
    };

    const { getByText } = render(
      <FilterPanel
        {...defaultProps}
        filters={filtersWithType}
        onClearAll={onClearAllMock}
      />,
      { wrapper: createWrapper() }
    );

    // Expand panel
    fireEvent.press(getByText("Filters"));

    // Clear all should be visible
    fireEvent.press(getByText("Clear all filters"));
    expect(onClearAllMock).toHaveBeenCalled();
  });

  it("hides clear all button when no filters are active", () => {
    const { getByText, queryByText } = render(
      <FilterPanel {...defaultProps} onClearAll={jest.fn()} />,
      { wrapper: createWrapper() }
    );

    // Expand panel
    fireEvent.press(getByText("Filters"));

    // Clear all should not be visible
    expect(queryByText("Clear all filters")).toBeNull();
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <FilterPanel {...defaultProps} testID="filter-panel" />,
      { wrapper: createWrapper() }
    );

    expect(getByTestId("filter-panel")).toBeTruthy();
  });

  it("shows date range section when expanded", () => {
    const { getByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Expand panel
    fireEvent.press(getByText("Filters"));

    expect(getByText("Date Range")).toBeTruthy();
    expect(getByText("Start date")).toBeTruthy();
    expect(getByText("End date")).toBeTruthy();
  });

  it("shows categories section when expanded", () => {
    const { getByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Expand panel
    fireEvent.press(getByText("Filters"));

    expect(getByText("Categories")).toBeTruthy();
    expect(getByText("All categories")).toBeTruthy();
  });

  it("shows tags section when expanded", () => {
    const { getByText } = render(<FilterPanel {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Expand panel
    fireEvent.press(getByText("Filters"));

    expect(getByText("Tags")).toBeTruthy();
    expect(getByText("All tags")).toBeTruthy();
  });
});
