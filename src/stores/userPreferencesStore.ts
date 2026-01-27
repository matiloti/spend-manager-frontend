import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supported currencies
export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "CNY" | "INR" | "MXN";

// Date format options
export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
}

export interface DateFormatOption {
  value: DateFormat;
  label: string;
  example: string;
}

export interface UserPreferences {
  currency: Currency;
  dateFormat: DateFormat;
}

interface UserPreferencesState extends UserPreferences {
  // Actions
  setCurrency: (currency: Currency) => void;
  setDateFormat: (format: DateFormat) => void;
  resetToDefaults: () => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,

      setCurrency: (currency) => set({ currency }),

      setDateFormat: (dateFormat) => set({ dateFormat }),

      resetToDefaults: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "user-preferences-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Currency options
export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "\u20AC" },
  { code: "GBP", name: "British Pound", symbol: "\u00A3" },
  { code: "JPY", name: "Japanese Yen", symbol: "\u00A5" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", name: "Chinese Yuan", symbol: "\u00A5" },
  { code: "INR", name: "Indian Rupee", symbol: "\u20B9" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$" },
];

// Date format options
export const DATE_FORMATS: DateFormatOption[] = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY", example: "01/27/2026" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY", example: "27/01/2026" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD", example: "2026-01-27" },
];

// Helper function to format date according to user preference
export function formatDateWithPreference(
  dateString: string,
  format: DateFormat
): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "MM/DD/YYYY":
    default:
      return `${month}/${day}/${year}`;
  }
}

// Helper function to get currency symbol
export function getCurrencySymbol(currency: Currency): string {
  const currencyOption = CURRENCIES.find((c) => c.code === currency);
  return currencyOption?.symbol || "$";
}

// Helper function to get currency display name
export function getCurrencyDisplayName(currency: Currency): string {
  const currencyOption = CURRENCIES.find((c) => c.code === currency);
  return currencyOption ? `${currencyOption.code} - ${currencyOption.name}` : currency;
}

// Helper function to get date format example
export function getDateFormatExample(format: DateFormat): string {
  const formatOption = DATE_FORMATS.find((f) => f.value === format);
  return formatOption?.example || format;
}

export default useUserPreferencesStore;
