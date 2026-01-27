import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday = 0, Saturday = 6
export type BudgetThreshold = 50 | 75 | 80 | 90 | 100;

export interface NotificationPreferences {
  // Master toggle
  notificationsEnabled: boolean;

  // Daily spending reminder
  dailyReminderEnabled: boolean;
  dailyReminderTime: { hour: number; minute: number }; // 24-hour format

  // Weekly summary
  weeklySummaryEnabled: boolean;
  weeklySummaryDay: DayOfWeek;
  weeklySummaryTime: { hour: number; minute: number };

  // Budget alerts
  budgetAlertsEnabled: boolean;
  budgetAlertThreshold: BudgetThreshold;

  // Transaction confirmations
  transactionConfirmationsEnabled: boolean;
}

interface NotificationPreferencesState extends NotificationPreferences {
  // Actions
  setNotificationsEnabled: (enabled: boolean) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: { hour: number; minute: number }) => void;
  setWeeklySummaryEnabled: (enabled: boolean) => void;
  setWeeklySummaryDay: (day: DayOfWeek) => void;
  setWeeklySummaryTime: (time: { hour: number; minute: number }) => void;
  setBudgetAlertsEnabled: (enabled: boolean) => void;
  setBudgetAlertThreshold: (threshold: BudgetThreshold) => void;
  setTransactionConfirmationsEnabled: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  notificationsEnabled: false,
  dailyReminderEnabled: false,
  dailyReminderTime: { hour: 20, minute: 0 }, // 8:00 PM
  weeklySummaryEnabled: false,
  weeklySummaryDay: 0, // Sunday
  weeklySummaryTime: { hour: 10, minute: 0 }, // 10:00 AM
  budgetAlertsEnabled: false,
  budgetAlertThreshold: 80,
  transactionConfirmationsEnabled: false,
};

export const useNotificationPreferencesStore =
  create<NotificationPreferencesState>()(
    persist(
      (set) => ({
        ...DEFAULT_PREFERENCES,

        setNotificationsEnabled: (enabled) =>
          set((state) => {
            // If disabling master toggle, disable all individual toggles too
            if (!enabled) {
              return {
                notificationsEnabled: false,
                dailyReminderEnabled: false,
                weeklySummaryEnabled: false,
                budgetAlertsEnabled: false,
                transactionConfirmationsEnabled: false,
              };
            }
            return { notificationsEnabled: enabled };
          }),

        setDailyReminderEnabled: (enabled) =>
          set({ dailyReminderEnabled: enabled }),

        setDailyReminderTime: (time) => set({ dailyReminderTime: time }),

        setWeeklySummaryEnabled: (enabled) =>
          set({ weeklySummaryEnabled: enabled }),

        setWeeklySummaryDay: (day) => set({ weeklySummaryDay: day }),

        setWeeklySummaryTime: (time) => set({ weeklySummaryTime: time }),

        setBudgetAlertsEnabled: (enabled) =>
          set({ budgetAlertsEnabled: enabled }),

        setBudgetAlertThreshold: (threshold) =>
          set({ budgetAlertThreshold: threshold }),

        setTransactionConfirmationsEnabled: (enabled) =>
          set({ transactionConfirmationsEnabled: enabled }),

        resetToDefaults: () => set(DEFAULT_PREFERENCES),
      }),
      {
        name: "notification-preferences-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  );

// Helper functions
export const DAYS_OF_WEEK = [
  { value: 0 as DayOfWeek, label: "Sunday" },
  { value: 1 as DayOfWeek, label: "Monday" },
  { value: 2 as DayOfWeek, label: "Tuesday" },
  { value: 3 as DayOfWeek, label: "Wednesday" },
  { value: 4 as DayOfWeek, label: "Thursday" },
  { value: 5 as DayOfWeek, label: "Friday" },
  { value: 6 as DayOfWeek, label: "Saturday" },
];

export const BUDGET_THRESHOLDS = [
  { value: 50 as BudgetThreshold, label: "50%" },
  { value: 75 as BudgetThreshold, label: "75%" },
  { value: 80 as BudgetThreshold, label: "80%" },
  { value: 90 as BudgetThreshold, label: "90%" },
  { value: 100 as BudgetThreshold, label: "100%" },
];

export function formatTime(time: { hour: number; minute: number }): string {
  const period = time.hour >= 12 ? "PM" : "AM";
  const hour12 = time.hour % 12 || 12;
  const minuteStr = time.minute.toString().padStart(2, "0");
  return `${hour12}:${minuteStr} ${period}`;
}
