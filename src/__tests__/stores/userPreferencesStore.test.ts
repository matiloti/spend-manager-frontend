import {
  useUserPreferencesStore,
  CURRENCIES,
  DATE_FORMATS,
  formatDateWithPreference,
  getCurrencySymbol,
  getCurrencyDisplayName,
  getDateFormatExample,
  Currency,
  DateFormat,
} from "@/stores/userPreferencesStore";

// Reset store between tests
beforeEach(() => {
  useUserPreferencesStore.getState().resetToDefaults();
});

describe("userPreferencesStore", () => {
  describe("initial state", () => {
    it("has USD as default currency", () => {
      const state = useUserPreferencesStore.getState();
      expect(state.currency).toBe("USD");
    });

    it("has MM/DD/YYYY as default date format", () => {
      const state = useUserPreferencesStore.getState();
      expect(state.dateFormat).toBe("MM/DD/YYYY");
    });
  });

  describe("setCurrency", () => {
    it("sets currency to EUR", () => {
      useUserPreferencesStore.getState().setCurrency("EUR");
      expect(useUserPreferencesStore.getState().currency).toBe("EUR");
    });

    it("sets currency to GBP", () => {
      useUserPreferencesStore.getState().setCurrency("GBP");
      expect(useUserPreferencesStore.getState().currency).toBe("GBP");
    });

    it("sets currency to JPY", () => {
      useUserPreferencesStore.getState().setCurrency("JPY");
      expect(useUserPreferencesStore.getState().currency).toBe("JPY");
    });

    it("sets currency to any supported currency", () => {
      const currencies: Currency[] = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "MXN"];
      currencies.forEach((currency) => {
        useUserPreferencesStore.getState().setCurrency(currency);
        expect(useUserPreferencesStore.getState().currency).toBe(currency);
      });
    });
  });

  describe("setDateFormat", () => {
    it("sets date format to DD/MM/YYYY", () => {
      useUserPreferencesStore.getState().setDateFormat("DD/MM/YYYY");
      expect(useUserPreferencesStore.getState().dateFormat).toBe("DD/MM/YYYY");
    });

    it("sets date format to YYYY-MM-DD", () => {
      useUserPreferencesStore.getState().setDateFormat("YYYY-MM-DD");
      expect(useUserPreferencesStore.getState().dateFormat).toBe("YYYY-MM-DD");
    });

    it("sets date format to MM/DD/YYYY", () => {
      useUserPreferencesStore.getState().setDateFormat("YYYY-MM-DD");
      useUserPreferencesStore.getState().setDateFormat("MM/DD/YYYY");
      expect(useUserPreferencesStore.getState().dateFormat).toBe("MM/DD/YYYY");
    });
  });

  describe("resetToDefaults", () => {
    it("resets currency to USD", () => {
      useUserPreferencesStore.getState().setCurrency("EUR");
      useUserPreferencesStore.getState().resetToDefaults();
      expect(useUserPreferencesStore.getState().currency).toBe("USD");
    });

    it("resets date format to MM/DD/YYYY", () => {
      useUserPreferencesStore.getState().setDateFormat("YYYY-MM-DD");
      useUserPreferencesStore.getState().resetToDefaults();
      expect(useUserPreferencesStore.getState().dateFormat).toBe("MM/DD/YYYY");
    });

    it("resets all preferences at once", () => {
      useUserPreferencesStore.getState().setCurrency("GBP");
      useUserPreferencesStore.getState().setDateFormat("DD/MM/YYYY");

      useUserPreferencesStore.getState().resetToDefaults();

      const state = useUserPreferencesStore.getState();
      expect(state.currency).toBe("USD");
      expect(state.dateFormat).toBe("MM/DD/YYYY");
    });
  });
});

describe("CURRENCIES", () => {
  it("has 10 currency options", () => {
    expect(CURRENCIES).toHaveLength(10);
  });

  it("includes USD as first option", () => {
    expect(CURRENCIES[0]).toEqual({
      code: "USD",
      name: "US Dollar",
      symbol: "$",
    });
  });

  it("includes EUR", () => {
    const eur = CURRENCIES.find((c) => c.code === "EUR");
    expect(eur).toEqual({
      code: "EUR",
      name: "Euro",
      symbol: "\u20AC",
    });
  });

  it("includes GBP", () => {
    const gbp = CURRENCIES.find((c) => c.code === "GBP");
    expect(gbp).toEqual({
      code: "GBP",
      name: "British Pound",
      symbol: "\u00A3",
    });
  });

  it("includes all supported currencies", () => {
    const codes = CURRENCIES.map((c) => c.code);
    expect(codes).toEqual([
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "INR",
      "MXN",
    ]);
  });

  it("each currency has required fields", () => {
    CURRENCIES.forEach((currency) => {
      expect(currency).toHaveProperty("code");
      expect(currency).toHaveProperty("name");
      expect(currency).toHaveProperty("symbol");
      expect(currency.code).toBeTruthy();
      expect(currency.name).toBeTruthy();
      expect(currency.symbol).toBeTruthy();
    });
  });
});

describe("DATE_FORMATS", () => {
  it("has 3 date format options", () => {
    expect(DATE_FORMATS).toHaveLength(3);
  });

  it("includes MM/DD/YYYY format", () => {
    const format = DATE_FORMATS.find((f) => f.value === "MM/DD/YYYY");
    expect(format).toBeDefined();
    expect(format?.label).toBe("MM/DD/YYYY");
  });

  it("includes DD/MM/YYYY format", () => {
    const format = DATE_FORMATS.find((f) => f.value === "DD/MM/YYYY");
    expect(format).toBeDefined();
    expect(format?.label).toBe("DD/MM/YYYY");
  });

  it("includes YYYY-MM-DD format (ISO)", () => {
    const format = DATE_FORMATS.find((f) => f.value === "YYYY-MM-DD");
    expect(format).toBeDefined();
    expect(format?.label).toBe("YYYY-MM-DD");
  });

  it("each format has an example", () => {
    DATE_FORMATS.forEach((format) => {
      expect(format.example).toBeTruthy();
      expect(format.example).toMatch(/\d{2,4}/); // Contains digits
    });
  });
});

describe("formatDateWithPreference", () => {
  const testDate = "2026-03-15T12:00:00Z";

  it("formats date in MM/DD/YYYY format", () => {
    const result = formatDateWithPreference(testDate, "MM/DD/YYYY");
    expect(result).toBe("03/15/2026");
  });

  it("formats date in DD/MM/YYYY format", () => {
    const result = formatDateWithPreference(testDate, "DD/MM/YYYY");
    expect(result).toBe("15/03/2026");
  });

  it("formats date in YYYY-MM-DD format (ISO)", () => {
    const result = formatDateWithPreference(testDate, "YYYY-MM-DD");
    expect(result).toBe("2026-03-15");
  });

  it("pads single-digit month and day", () => {
    const earlyDate = "2026-01-05T12:00:00Z";
    expect(formatDateWithPreference(earlyDate, "MM/DD/YYYY")).toBe("01/05/2026");
    expect(formatDateWithPreference(earlyDate, "DD/MM/YYYY")).toBe("05/01/2026");
    expect(formatDateWithPreference(earlyDate, "YYYY-MM-DD")).toBe("2026-01-05");
  });

  it("handles end of year dates", () => {
    // Use noon time to avoid timezone issues
    const endOfYear = "2026-12-31T12:00:00Z";
    expect(formatDateWithPreference(endOfYear, "MM/DD/YYYY")).toBe("12/31/2026");
    expect(formatDateWithPreference(endOfYear, "DD/MM/YYYY")).toBe("31/12/2026");
    expect(formatDateWithPreference(endOfYear, "YYYY-MM-DD")).toBe("2026-12-31");
  });

  it("defaults to MM/DD/YYYY for unknown format", () => {
    // @ts-ignore - Testing invalid format
    const result = formatDateWithPreference(testDate, "UNKNOWN");
    expect(result).toBe("03/15/2026");
  });
});

describe("getCurrencySymbol", () => {
  it("returns $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("returns correct symbols for major currencies", () => {
    expect(getCurrencySymbol("EUR")).toBe("\u20AC");
    expect(getCurrencySymbol("GBP")).toBe("\u00A3");
    expect(getCurrencySymbol("JPY")).toBe("\u00A5");
    expect(getCurrencySymbol("INR")).toBe("\u20B9");
  });

  it("returns multi-character symbols", () => {
    expect(getCurrencySymbol("CAD")).toBe("CA$");
    expect(getCurrencySymbol("AUD")).toBe("A$");
    expect(getCurrencySymbol("MXN")).toBe("MX$");
    expect(getCurrencySymbol("CHF")).toBe("CHF");
  });

  it("returns $ as fallback for unknown currency", () => {
    // @ts-ignore - Testing invalid currency
    const result = getCurrencySymbol("XYZ");
    expect(result).toBe("$");
  });
});

describe("getCurrencyDisplayName", () => {
  it("returns formatted display name for USD", () => {
    expect(getCurrencyDisplayName("USD")).toBe("USD - US Dollar");
  });

  it("returns formatted display name for EUR", () => {
    expect(getCurrencyDisplayName("EUR")).toBe("EUR - Euro");
  });

  it("returns formatted display name for GBP", () => {
    expect(getCurrencyDisplayName("GBP")).toBe("GBP - British Pound");
  });

  it("returns formatted display names for all currencies", () => {
    expect(getCurrencyDisplayName("JPY")).toBe("JPY - Japanese Yen");
    expect(getCurrencyDisplayName("CAD")).toBe("CAD - Canadian Dollar");
    expect(getCurrencyDisplayName("AUD")).toBe("AUD - Australian Dollar");
    expect(getCurrencyDisplayName("CHF")).toBe("CHF - Swiss Franc");
    expect(getCurrencyDisplayName("CNY")).toBe("CNY - Chinese Yuan");
    expect(getCurrencyDisplayName("INR")).toBe("INR - Indian Rupee");
    expect(getCurrencyDisplayName("MXN")).toBe("MXN - Mexican Peso");
  });

  it("returns currency code as fallback for unknown currency", () => {
    // @ts-ignore - Testing invalid currency
    const result = getCurrencyDisplayName("XYZ");
    expect(result).toBe("XYZ");
  });
});

describe("getDateFormatExample", () => {
  it("returns example for MM/DD/YYYY format", () => {
    const example = getDateFormatExample("MM/DD/YYYY");
    expect(example).toBe("01/27/2026");
  });

  it("returns example for DD/MM/YYYY format", () => {
    const example = getDateFormatExample("DD/MM/YYYY");
    expect(example).toBe("27/01/2026");
  });

  it("returns example for YYYY-MM-DD format", () => {
    const example = getDateFormatExample("YYYY-MM-DD");
    expect(example).toBe("2026-01-27");
  });

  it("returns format as fallback for unknown format", () => {
    // @ts-ignore - Testing invalid format
    const result = getDateFormatExample("UNKNOWN");
    expect(result).toBe("UNKNOWN");
  });
});
