import {
  useSecurityPreferencesStore,
  APP_LOCK_TIMEOUTS,
  getAppLockTimeoutLabel,
  AppLockTimeout,
} from "@/stores/securityPreferencesStore";

// Reset store between tests
beforeEach(() => {
  useSecurityPreferencesStore.getState().resetToDefaults();
});

describe("securityPreferencesStore", () => {
  describe("initial state", () => {
    it("has biometrics disabled by default", () => {
      const state = useSecurityPreferencesStore.getState();
      expect(state.biometricsEnabled).toBe(false);
    });

    it("has app lock disabled by default", () => {
      const state = useSecurityPreferencesStore.getState();
      expect(state.appLockEnabled).toBe(false);
    });

    it("has app lock timeout set to immediately by default", () => {
      const state = useSecurityPreferencesStore.getState();
      expect(state.appLockTimeout).toBe("immediately");
    });

    it("has null lastBackgroundTimestamp by default", () => {
      const state = useSecurityPreferencesStore.getState();
      expect(state.lastBackgroundTimestamp).toBeNull();
    });
  });

  describe("setBiometricsEnabled", () => {
    it("enables biometrics", () => {
      useSecurityPreferencesStore.getState().setBiometricsEnabled(true);
      expect(useSecurityPreferencesStore.getState().biometricsEnabled).toBe(true);
    });

    it("disables biometrics", () => {
      useSecurityPreferencesStore.getState().setBiometricsEnabled(true);
      useSecurityPreferencesStore.getState().setBiometricsEnabled(false);
      expect(useSecurityPreferencesStore.getState().biometricsEnabled).toBe(false);
    });
  });

  describe("setAppLockEnabled", () => {
    it("enables app lock", () => {
      useSecurityPreferencesStore.getState().setAppLockEnabled(true);
      expect(useSecurityPreferencesStore.getState().appLockEnabled).toBe(true);
    });

    it("disables app lock", () => {
      useSecurityPreferencesStore.getState().setAppLockEnabled(true);
      useSecurityPreferencesStore.getState().setAppLockEnabled(false);
      expect(useSecurityPreferencesStore.getState().appLockEnabled).toBe(false);
    });

    it("disables biometrics when app lock is disabled", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setBiometricsEnabled(true);

      useSecurityPreferencesStore.getState().setAppLockEnabled(false);

      const state = useSecurityPreferencesStore.getState();
      expect(state.appLockEnabled).toBe(false);
      expect(state.biometricsEnabled).toBe(false);
    });

    it("does not affect biometrics when enabling app lock", () => {
      useSecurityPreferencesStore.getState().setBiometricsEnabled(false);
      useSecurityPreferencesStore.getState().setAppLockEnabled(true);
      expect(useSecurityPreferencesStore.getState().biometricsEnabled).toBe(false);
    });
  });

  describe("setAppLockTimeout", () => {
    it("sets timeout to immediately", () => {
      useSecurityPreferencesStore.getState().setAppLockTimeout("1min");
      useSecurityPreferencesStore.getState().setAppLockTimeout("immediately");
      expect(useSecurityPreferencesStore.getState().appLockTimeout).toBe("immediately");
    });

    it("sets timeout to 1 minute", () => {
      useSecurityPreferencesStore.getState().setAppLockTimeout("1min");
      expect(useSecurityPreferencesStore.getState().appLockTimeout).toBe("1min");
    });

    it("sets timeout to 5 minutes", () => {
      useSecurityPreferencesStore.getState().setAppLockTimeout("5min");
      expect(useSecurityPreferencesStore.getState().appLockTimeout).toBe("5min");
    });

    it("sets timeout to never", () => {
      useSecurityPreferencesStore.getState().setAppLockTimeout("never");
      expect(useSecurityPreferencesStore.getState().appLockTimeout).toBe("never");
    });
  });

  describe("setLastBackgroundTimestamp", () => {
    it("sets timestamp to a specific value", () => {
      const timestamp = Date.now();
      useSecurityPreferencesStore.getState().setLastBackgroundTimestamp(timestamp);
      expect(useSecurityPreferencesStore.getState().lastBackgroundTimestamp).toBe(timestamp);
    });

    it("sets timestamp to null", () => {
      useSecurityPreferencesStore.getState().setLastBackgroundTimestamp(Date.now());
      useSecurityPreferencesStore.getState().setLastBackgroundTimestamp(null);
      expect(useSecurityPreferencesStore.getState().lastBackgroundTimestamp).toBeNull();
    });
  });

  describe("shouldLockApp", () => {
    it("returns false when app lock is disabled", () => {
      useSecurityPreferencesStore.getState().setAppLockEnabled(false);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(false);
    });

    it("returns false when timeout is set to never", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("never");
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(false);
    });

    it("returns true when timeout is immediately and app lock is enabled", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("immediately");
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(true);
    });

    it("returns false when no background timestamp is set for timed timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("1min");
      store.setLastBackgroundTimestamp(null);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(false);
    });

    it("returns false when less than 1 minute has elapsed for 1min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("1min");
      // Set timestamp to 30 seconds ago
      store.setLastBackgroundTimestamp(Date.now() - 30000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(false);
    });

    it("returns true when more than 1 minute has elapsed for 1min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("1min");
      // Set timestamp to 90 seconds ago
      store.setLastBackgroundTimestamp(Date.now() - 90000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(true);
    });

    it("returns false when less than 5 minutes has elapsed for 5min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("5min");
      // Set timestamp to 2 minutes ago
      store.setLastBackgroundTimestamp(Date.now() - 120000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(false);
    });

    it("returns true when more than 5 minutes has elapsed for 5min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("5min");
      // Set timestamp to 6 minutes ago
      store.setLastBackgroundTimestamp(Date.now() - 360000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(true);
    });

    it("returns true when exactly 1 minute has elapsed for 1min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("1min");
      // Set timestamp to exactly 60 seconds ago
      store.setLastBackgroundTimestamp(Date.now() - 60000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(true);
    });

    it("returns true when exactly 5 minutes has elapsed for 5min timeout", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("5min");
      // Set timestamp to exactly 5 minutes ago
      store.setLastBackgroundTimestamp(Date.now() - 300000);
      expect(useSecurityPreferencesStore.getState().shouldLockApp()).toBe(true);
    });
  });

  describe("resetToDefaults", () => {
    it("resets all preferences to defaults", () => {
      const store = useSecurityPreferencesStore.getState();
      store.setBiometricsEnabled(true);
      store.setAppLockEnabled(true);
      store.setAppLockTimeout("5min");
      store.setLastBackgroundTimestamp(Date.now());

      useSecurityPreferencesStore.getState().resetToDefaults();

      const state = useSecurityPreferencesStore.getState();
      expect(state.biometricsEnabled).toBe(false);
      expect(state.appLockEnabled).toBe(false);
      expect(state.appLockTimeout).toBe("immediately");
      expect(state.lastBackgroundTimestamp).toBeNull();
    });
  });
});

describe("APP_LOCK_TIMEOUTS", () => {
  it("has 4 timeout options", () => {
    expect(APP_LOCK_TIMEOUTS).toHaveLength(4);
  });

  it("includes immediately option", () => {
    const immediately = APP_LOCK_TIMEOUTS.find((t) => t.value === "immediately");
    expect(immediately).toEqual({
      value: "immediately",
      label: "Immediately",
    });
  });

  it("includes 1 minute option", () => {
    const oneMin = APP_LOCK_TIMEOUTS.find((t) => t.value === "1min");
    expect(oneMin).toEqual({
      value: "1min",
      label: "After 1 minute",
    });
  });

  it("includes 5 minute option", () => {
    const fiveMin = APP_LOCK_TIMEOUTS.find((t) => t.value === "5min");
    expect(fiveMin).toEqual({
      value: "5min",
      label: "After 5 minutes",
    });
  });

  it("includes never option", () => {
    const never = APP_LOCK_TIMEOUTS.find((t) => t.value === "never");
    expect(never).toEqual({
      value: "never",
      label: "Never",
    });
  });

  it("has correct order of options", () => {
    const values = APP_LOCK_TIMEOUTS.map((t) => t.value);
    expect(values).toEqual(["immediately", "1min", "5min", "never"]);
  });
});

describe("getAppLockTimeoutLabel", () => {
  it("returns Immediately for immediately timeout", () => {
    expect(getAppLockTimeoutLabel("immediately")).toBe("Immediately");
  });

  it("returns After 1 minute for 1min timeout", () => {
    expect(getAppLockTimeoutLabel("1min")).toBe("After 1 minute");
  });

  it("returns After 5 minutes for 5min timeout", () => {
    expect(getAppLockTimeoutLabel("5min")).toBe("After 5 minutes");
  });

  it("returns Never for never timeout", () => {
    expect(getAppLockTimeoutLabel("never")).toBe("Never");
  });

  it("returns Immediately as fallback for unknown timeout", () => {
    // @ts-ignore - Testing invalid timeout
    const result = getAppLockTimeoutLabel("unknown");
    expect(result).toBe("Immediately");
  });
});
