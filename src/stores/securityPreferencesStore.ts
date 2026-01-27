import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AppLockTimeout = "immediately" | "1min" | "5min" | "never";

export interface SecurityPreferences {
  // Biometric authentication
  biometricsEnabled: boolean;

  // App lock settings
  appLockEnabled: boolean;
  appLockTimeout: AppLockTimeout;

  // Track when app went to background for lock timeout
  lastBackgroundTimestamp: number | null;
}

interface SecurityPreferencesState extends SecurityPreferences {
  // Actions
  setBiometricsEnabled: (enabled: boolean) => void;
  setAppLockEnabled: (enabled: boolean) => void;
  setAppLockTimeout: (timeout: AppLockTimeout) => void;
  setLastBackgroundTimestamp: (timestamp: number | null) => void;
  shouldLockApp: () => boolean;
  resetToDefaults: () => void;
}

const DEFAULT_PREFERENCES: SecurityPreferences = {
  biometricsEnabled: false,
  appLockEnabled: false,
  appLockTimeout: "immediately",
  lastBackgroundTimestamp: null,
};

export const useSecurityPreferencesStore = create<SecurityPreferencesState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PREFERENCES,

      setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),

      setAppLockEnabled: (enabled) => {
        // If disabling app lock, also disable biometrics
        if (!enabled) {
          set({
            appLockEnabled: false,
            biometricsEnabled: false,
          });
        } else {
          set({ appLockEnabled: enabled });
        }
      },

      setAppLockTimeout: (timeout) => set({ appLockTimeout: timeout }),

      setLastBackgroundTimestamp: (timestamp) =>
        set({ lastBackgroundTimestamp: timestamp }),

      shouldLockApp: () => {
        const state = get();

        if (!state.appLockEnabled) {
          return false;
        }

        if (state.appLockTimeout === "never") {
          return false;
        }

        if (state.appLockTimeout === "immediately") {
          return true;
        }

        const lastTimestamp = state.lastBackgroundTimestamp;
        if (!lastTimestamp) {
          return false;
        }

        const now = Date.now();
        const elapsed = now - lastTimestamp;

        // Convert timeout to milliseconds
        const timeoutMs = state.appLockTimeout === "1min" ? 60000 : 300000; // 1 min or 5 min

        return elapsed >= timeoutMs;
      },

      resetToDefaults: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: "security-preferences-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper constants
export const APP_LOCK_TIMEOUTS = [
  { value: "immediately" as AppLockTimeout, label: "Immediately" },
  { value: "1min" as AppLockTimeout, label: "After 1 minute" },
  { value: "5min" as AppLockTimeout, label: "After 5 minutes" },
  { value: "never" as AppLockTimeout, label: "Never" },
];

export function getAppLockTimeoutLabel(timeout: AppLockTimeout): string {
  return APP_LOCK_TIMEOUTS.find((t) => t.value === timeout)?.label || "Immediately";
}
