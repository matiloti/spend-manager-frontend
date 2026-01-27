import { create } from "zustand";

interface HomeState {
  // Selected date for daily view
  selectedDate: string;
  // Whether monthly summary is expanded
  isMonthlyExpanded: boolean;

  // Actions
  setSelectedDate: (date: string) => void;
  setToday: () => void;
  toggleMonthlyExpanded: () => void;
  setMonthlyExpanded: (expanded: boolean) => void;
}

/**
 * Get current date in ISO format (YYYY-MM-DD)
 */
function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export const useHomeStore = create<HomeState>((set) => ({
  selectedDate: getTodayISO(),
  isMonthlyExpanded: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setToday: () => set({ selectedDate: getTodayISO() }),
  toggleMonthlyExpanded: () =>
    set((state) => ({ isMonthlyExpanded: !state.isMonthlyExpanded })),
  setMonthlyExpanded: (expanded) => set({ isMonthlyExpanded: expanded }),
}));
