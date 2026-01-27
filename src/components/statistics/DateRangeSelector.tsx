import React, { useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, Pressable, Modal, Platform, StyleSheet } from "react-native";
import { Calendar, X } from "lucide-react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { DateRangePreset } from "@/services/statisticsService";
import { Button } from "@/components/ui/Button";

interface DateRangeSelectorProps {
  selectedPreset: DateRangePreset;
  onPresetChange: (preset: DateRangePreset) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomDateChange?: (startDate: string, endDate: string) => void;
  testID?: string;
}

export interface DateRangeSelectorRef {
  openCustomPicker: () => void;
}

interface PresetOption {
  id: DateRangePreset;
  label: string;
}

const PRESETS: PresetOption[] = [
  { id: "THIS_WEEK", label: "Week" },
  { id: "THIS_MONTH", label: "Month" },
  { id: "THIS_YEAR", label: "Year" },
  { id: "CUSTOM", label: "Custom" },
];

// Colors for fallback styling
const COLORS = {
  primary: "#3B82F6",
  textWhite: "#FFFFFF",
  textSecondary: "#6B7280",
  bgSecondary: "#F3F4F6",
  bgInput: "#F9FAFB",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textTertiary: "#9CA3AF",
};

export const DateRangeSelector = forwardRef<DateRangeSelectorRef, DateRangeSelectorProps>(
  function DateRangeSelector(
    {
      selectedPreset,
      onPresetChange,
      customStartDate,
      customEndDate,
      onCustomDateChange,
      testID,
    },
    ref
  ) {
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(
      customStartDate ? new Date(customStartDate) : new Date()
    );
    const [tempEndDate, setTempEndDate] = useState<Date>(
      customEndDate ? new Date(customEndDate) : new Date()
    );
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Expose openCustomPicker method via ref
    useImperativeHandle(ref, () => ({
      openCustomPicker: () => {
        setShowCustomPicker(true);
      },
    }));

    const handlePresetPress = (preset: DateRangePreset) => {
      if (preset === "CUSTOM") {
        setShowCustomPicker(true);
      } else {
        onPresetChange(preset);
      }
    };

    const handleApplyCustomRange = () => {
      if (tempStartDate && tempEndDate && onCustomDateChange) {
        const startStr = tempStartDate.toISOString().split("T")[0];
        const endStr = tempEndDate.toISOString().split("T")[0];
        onCustomDateChange(startStr, endStr);
        onPresetChange("CUSTOM");
      }
      setShowCustomPicker(false);
    };

    const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === "android") {
        setShowStartDatePicker(false);
      }
      if (date) {
        setTempStartDate(date);
      }
    };

    const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === "android") {
        setShowEndDatePicker(false);
      }
      if (date) {
        setTempEndDate(date);
      }
    };

    const formatDateForDisplay = (date: Date): string => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const formatCustomLabel = () => {
      if (customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return `${start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      }
      return "Custom";
    };

    // Calculate max date (today) and min date (1 year ago)
    const maxDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);

    return (
      <View testID={testID}>
        {/* Segmented Control */}
        <View style={styles.segmentedControl} className="bg-bg-secondary rounded-lg p-1 flex-row">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            const displayLabel =
              preset.id === "CUSTOM" && selectedPreset === "CUSTOM"
                ? formatCustomLabel()
                : preset.label;

            return (
              <Pressable
                key={preset.id}
                onPress={() => handlePresetPress(preset.id)}
                style={[
                  styles.segmentButton,
                  isSelected && styles.segmentButtonSelected,
                ]}
                className={`flex-1 px-3 py-2 rounded-md items-center justify-center min-h-touch ${
                  isSelected ? "bg-primary" : ""
                }`}
                testID={`statistics-date-${preset.id.toLowerCase()}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                {preset.id === "CUSTOM" && (
                  <View style={styles.customButtonContent} className="flex-row items-center">
                    <Calendar
                      size={14}
                      color={isSelected ? COLORS.textWhite : COLORS.textSecondary}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected ? styles.segmentTextSelected : styles.segmentTextUnselected,
                      ]}
                      className={`text-sm font-medium ${
                        isSelected ? "text-text-inverse" : "text-text-secondary"
                      }`}
                      numberOfLines={1}
                    >
                      {displayLabel}
                    </Text>
                  </View>
                )}
                {preset.id !== "CUSTOM" && (
                  <Text
                    style={[
                      styles.segmentText,
                      isSelected ? styles.segmentTextSelected : styles.segmentTextUnselected,
                    ]}
                    className={`text-sm font-medium ${
                      isSelected ? "text-text-inverse" : "text-text-secondary"
                    }`}
                  >
                    {displayLabel}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Custom Date Range Modal */}
        <Modal
          visible={showCustomPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCustomPicker(false)}
        >
          <View style={styles.modalContainer} className="flex-1 bg-bg-primary">
            {/* Modal Header */}
            <View style={styles.modalHeader} className="flex-row items-center justify-between p-4 border-b border-border">
              <Text style={styles.modalTitle} className="text-xl font-bold text-text-primary">
                Custom Date Range
              </Text>
              <Pressable
                onPress={() => setShowCustomPicker(false)}
                style={styles.closeButton}
                className="p-2"
                accessibilityLabel="Close"
              >
                <X size={24} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.modalContent} className="p-4">
              {/* Start Date */}
              <View style={styles.dateInputContainer} className="mb-4">
                <Text style={styles.dateLabel} className="text-sm font-medium text-text-secondary mb-2">
                  Start Date
                </Text>
                <Pressable
                  onPress={() => setShowStartDatePicker(true)}
                  style={styles.dateInput}
                  className="h-input bg-bg-input rounded-input border border-border px-3 justify-center"
                  testID="statistics-custom-start-date"
                >
                  <Text style={styles.dateInputText}>
                    {formatDateForDisplay(tempStartDate)}
                  </Text>
                </Pressable>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={tempStartDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleStartDateChange}
                    maximumDate={tempEndDate < maxDate ? tempEndDate : maxDate}
                    minimumDate={minDate}
                    testID="statistics-start-date-picker"
                  />
                )}
              </View>

              {/* End Date */}
              <View style={styles.dateInputContainer} className="mb-6">
                <Text style={styles.dateLabel} className="text-sm font-medium text-text-secondary mb-2">
                  End Date
                </Text>
                <Pressable
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.dateInput}
                  className="h-input bg-bg-input rounded-input border border-border px-3 justify-center"
                  testID="statistics-custom-end-date"
                >
                  <Text style={styles.dateInputText}>
                    {formatDateForDisplay(tempEndDate)}
                  </Text>
                </Pressable>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={tempEndDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleEndDateChange}
                    maximumDate={maxDate}
                    minimumDate={tempStartDate}
                    testID="statistics-end-date-picker"
                  />
                )}
              </View>

              <Text style={styles.helperText} className="text-sm text-text-tertiary mb-6">
                Maximum range is 1 year. Future dates cannot be selected.
              </Text>

              {/* Action Buttons */}
              <View style={styles.buttonRow} className="flex-row gap-3">
                <View style={styles.buttonContainer} className="flex-1">
                  <Button
                    variant="outline"
                    onPress={() => setShowCustomPicker(false)}
                  >
                    Cancel
                  </Button>
                </View>
                <View style={styles.buttonContainer} className="flex-1">
                  <Button
                    onPress={handleApplyCustomRange}
                  >
                    Apply
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  segmentedControl: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: 8,
    padding: 4,
    flexDirection: "row",
  },
  segmentButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  segmentButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
  },
  segmentTextSelected: {
    color: COLORS.textWhite,
  },
  segmentTextUnselected: {
    color: COLORS.textSecondary,
  },
  customButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  dateInput: {
    height: 48,
    backgroundColor: COLORS.bgInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  dateInputText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.textTertiary,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  buttonContainer: {
    flex: 1,
  },
});

export default DateRangeSelector;
