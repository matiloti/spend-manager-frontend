import { renderHook, act } from "@testing-library/react-native";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("returns debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Update value
    rerender({ value: "updated" });

    // Value should still be initial (not yet debounced)
    expect(result.current).toBe("initial");

    // Fast-forward past debounce delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now value should be updated
    expect(result.current).toBe("updated");
  });

  it("resets timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "initial" } }
    );

    // Update value multiple times rapidly
    rerender({ value: "first" });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "second" });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "third" });

    // Value should still be initial
    expect(result.current).toBe("initial");

    // Advance past debounce delay from last change
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Value should be the last one
    expect(result.current).toBe("third");
  });

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });

    // At 299ms, still initial
    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe("initial");

    // At 300ms, updated
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("works with objects", () => {
    const initialObj = { name: "test" };
    const updatedObj = { name: "updated" };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: initialObj } }
    );

    rerender({ value: updatedObj });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(updatedObj);
  });

  it("cleans up timeout on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("value", 300));

    // Unmount before timeout completes
    unmount();

    // No errors should occur when advancing timers
    expect(() => {
      act(() => {
        jest.advanceTimersByTime(500);
      });
    }).not.toThrow();
  });
});
