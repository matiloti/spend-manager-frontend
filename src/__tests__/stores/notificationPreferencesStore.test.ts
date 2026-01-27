import {
  useNotificationPreferencesStore,
  formatTime,
  DAYS_OF_WEEK,
  BUDGET_THRESHOLDS,
} from "@/stores/notificationPreferencesStore";

// Reset store between tests
beforeEach(() => {
  useNotificationPreferencesStore.getState().resetToDefaults();
});

describe("notificationPreferencesStore", () => {
  describe("initial state", () => {
    it("has notifications disabled by default", () => {
      const state = useNotificationPreferencesStore.getState();
      expect(state.notificationsEnabled).toBe(false);
    });

    it("has all individual toggles disabled by default", () => {
      const state = useNotificationPreferencesStore.getState();
      expect(state.dailyReminderEnabled).toBe(false);
      expect(state.weeklySummaryEnabled).toBe(false);
      expect(state.budgetAlertsEnabled).toBe(false);
      expect(state.transactionConfirmationsEnabled).toBe(false);
    });

    it("has default time of 8:00 PM for daily reminder", () => {
      const state = useNotificationPreferencesStore.getState();
      expect(state.dailyReminderTime).toEqual({ hour: 20, minute: 0 });
    });

    it("has default weekly summary on Sunday at 10:00 AM", () => {
      const state = useNotificationPreferencesStore.getState();
      expect(state.weeklySummaryDay).toBe(0); // Sunday
      expect(state.weeklySummaryTime).toEqual({ hour: 10, minute: 0 });
    });

    it("has default budget alert threshold of 80%", () => {
      const state = useNotificationPreferencesStore.getState();
      expect(state.budgetAlertThreshold).toBe(80);
    });
  });

  describe("setNotificationsEnabled", () => {
    it("enables master notifications toggle", () => {
      useNotificationPreferencesStore.getState().setNotificationsEnabled(true);
      expect(
        useNotificationPreferencesStore.getState().notificationsEnabled
      ).toBe(true);
    });

    it("disables all toggles when master is disabled", () => {
      const store = useNotificationPreferencesStore.getState();
      store.setNotificationsEnabled(true);
      store.setDailyReminderEnabled(true);
      store.setWeeklySummaryEnabled(true);
      store.setBudgetAlertsEnabled(true);
      store.setTransactionConfirmationsEnabled(true);

      useNotificationPreferencesStore.getState().setNotificationsEnabled(false);

      const state = useNotificationPreferencesStore.getState();
      expect(state.notificationsEnabled).toBe(false);
      expect(state.dailyReminderEnabled).toBe(false);
      expect(state.weeklySummaryEnabled).toBe(false);
      expect(state.budgetAlertsEnabled).toBe(false);
      expect(state.transactionConfirmationsEnabled).toBe(false);
    });
  });

  describe("setDailyReminderEnabled", () => {
    it("enables daily reminder", () => {
      useNotificationPreferencesStore.getState().setDailyReminderEnabled(true);
      expect(
        useNotificationPreferencesStore.getState().dailyReminderEnabled
      ).toBe(true);
    });
  });

  describe("setDailyReminderTime", () => {
    it("sets daily reminder time", () => {
      useNotificationPreferencesStore
        .getState()
        .setDailyReminderTime({ hour: 9, minute: 30 });
      expect(
        useNotificationPreferencesStore.getState().dailyReminderTime
      ).toEqual({ hour: 9, minute: 30 });
    });
  });

  describe("setWeeklySummaryEnabled", () => {
    it("enables weekly summary", () => {
      useNotificationPreferencesStore.getState().setWeeklySummaryEnabled(true);
      expect(
        useNotificationPreferencesStore.getState().weeklySummaryEnabled
      ).toBe(true);
    });
  });

  describe("setWeeklySummaryDay", () => {
    it("sets weekly summary day", () => {
      useNotificationPreferencesStore.getState().setWeeklySummaryDay(5); // Friday
      expect(useNotificationPreferencesStore.getState().weeklySummaryDay).toBe(
        5
      );
    });
  });

  describe("setWeeklySummaryTime", () => {
    it("sets weekly summary time", () => {
      useNotificationPreferencesStore
        .getState()
        .setWeeklySummaryTime({ hour: 14, minute: 15 });
      expect(
        useNotificationPreferencesStore.getState().weeklySummaryTime
      ).toEqual({ hour: 14, minute: 15 });
    });
  });

  describe("setBudgetAlertsEnabled", () => {
    it("enables budget alerts", () => {
      useNotificationPreferencesStore.getState().setBudgetAlertsEnabled(true);
      expect(
        useNotificationPreferencesStore.getState().budgetAlertsEnabled
      ).toBe(true);
    });
  });

  describe("setBudgetAlertThreshold", () => {
    it("sets budget alert threshold", () => {
      useNotificationPreferencesStore.getState().setBudgetAlertThreshold(90);
      expect(
        useNotificationPreferencesStore.getState().budgetAlertThreshold
      ).toBe(90);
    });
  });

  describe("setTransactionConfirmationsEnabled", () => {
    it("enables transaction confirmations", () => {
      useNotificationPreferencesStore
        .getState()
        .setTransactionConfirmationsEnabled(true);
      expect(
        useNotificationPreferencesStore.getState().transactionConfirmationsEnabled
      ).toBe(true);
    });
  });

  describe("resetToDefaults", () => {
    it("resets all preferences to defaults", () => {
      const store = useNotificationPreferencesStore.getState();
      store.setNotificationsEnabled(true);
      store.setDailyReminderEnabled(true);
      store.setDailyReminderTime({ hour: 15, minute: 45 });
      store.setWeeklySummaryEnabled(true);
      store.setWeeklySummaryDay(3);
      store.setWeeklySummaryTime({ hour: 8, minute: 0 });
      store.setBudgetAlertsEnabled(true);
      store.setBudgetAlertThreshold(100);
      store.setTransactionConfirmationsEnabled(true);

      useNotificationPreferencesStore.getState().resetToDefaults();

      const state = useNotificationPreferencesStore.getState();
      expect(state.notificationsEnabled).toBe(false);
      expect(state.dailyReminderEnabled).toBe(false);
      expect(state.dailyReminderTime).toEqual({ hour: 20, minute: 0 });
      expect(state.weeklySummaryEnabled).toBe(false);
      expect(state.weeklySummaryDay).toBe(0);
      expect(state.weeklySummaryTime).toEqual({ hour: 10, minute: 0 });
      expect(state.budgetAlertsEnabled).toBe(false);
      expect(state.budgetAlertThreshold).toBe(80);
      expect(state.transactionConfirmationsEnabled).toBe(false);
    });
  });
});

describe("formatTime", () => {
  it("formats morning time correctly", () => {
    expect(formatTime({ hour: 9, minute: 0 })).toBe("9:00 AM");
  });

  it("formats afternoon time correctly", () => {
    expect(formatTime({ hour: 14, minute: 30 })).toBe("2:30 PM");
  });

  it("formats noon correctly", () => {
    expect(formatTime({ hour: 12, minute: 0 })).toBe("12:00 PM");
  });

  it("formats midnight correctly", () => {
    expect(formatTime({ hour: 0, minute: 0 })).toBe("12:00 AM");
  });

  it("formats evening time correctly", () => {
    expect(formatTime({ hour: 20, minute: 15 })).toBe("8:15 PM");
  });

  it("pads single-digit minutes", () => {
    expect(formatTime({ hour: 9, minute: 5 })).toBe("9:05 AM");
  });
});

describe("DAYS_OF_WEEK", () => {
  it("has 7 days", () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
  });

  it("starts with Sunday as 0", () => {
    expect(DAYS_OF_WEEK[0]).toEqual({ value: 0, label: "Sunday" });
  });

  it("ends with Saturday as 6", () => {
    expect(DAYS_OF_WEEK[6]).toEqual({ value: 6, label: "Saturday" });
  });
});

describe("BUDGET_THRESHOLDS", () => {
  it("has 5 threshold options", () => {
    expect(BUDGET_THRESHOLDS).toHaveLength(5);
  });

  it("includes 50%, 75%, 80%, 90%, and 100%", () => {
    const values = BUDGET_THRESHOLDS.map((t) => t.value);
    expect(values).toEqual([50, 75, 80, 90, 100]);
  });
});
