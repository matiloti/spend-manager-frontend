import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Calendar, X } from "lucide-react-native";
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

export function DateRangeSelector({
  selectedPreset,
  onPresetChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
  testID,
}: DateRangeSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(customStartDate || "");
  const [tempEndDate, setTempEndDate] = useState(customEndDate || "");

  const handlePresetPress = (preset: DateRangePreset) => {
    if (preset === "CUSTOM") {
      setShowCustomPicker(true);
    } else {
      onPresetChange(preset);
    }
  };

  const handleApplyCustomRange = () => {
    if (tempStartDate && tempEndDate && onCustomDateChange) {
      onCustomDateChange(tempStartDate, tempEndDate);
      onPresetChange("CUSTOM");
    }
    setShowCustomPicker(false);
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

  return (
    <View testID={testID}>
      <View className="bg-bg-secondary rounded-lg p-1 flex-row">
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
              className={`flex-1 px-3 py-2 rounded-md items-center justify-center min-h-touch ${
                isSelected ? "bg-primary" : ""
              }`}
              testID={`statistics-date-${preset.id.toLowerCase()}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              {preset.id === "CUSTOM" && (
                <View className="flex-row items-center">
                  <Calendar
                    size={14}
                    color={isSelected ? "#FFFFFF" : "#6B7280"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
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
        <View className="flex-1 bg-bg-primary">
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <Text className="text-xl font-bold text-text-primary">
              Custom Date Range
            </Text>
            <Pressable
              onPress={() => setShowCustomPicker(false)}
              className="p-2"
              accessibilityLabel="Close"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          <View className="p-4">
            <View className="mb-4">
              <Text className="text-sm font-medium text-text-secondary mb-2">
                Start Date
              </Text>
              <Pressable
                onPress={() => {
                  // In a real app, this would open a date picker
                  // For now, we'll use a simple text input pattern
                }}
                className="h-input bg-bg-input rounded-input border border-border px-3 justify-center"
              >
                <Text
                  className={
                    tempStartDate
                      ? "text-text-primary"
                      : "text-text-tertiary"
                  }
                >
                  {tempStartDate || "Select start date"}
                </Text>
              </Pressable>
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-text-secondary mb-2">
                End Date
              </Text>
              <Pressable
                onPress={() => {
                  // In a real app, this would open a date picker
                }}
                className="h-input bg-bg-input rounded-input border border-border px-3 justify-center"
              >
                <Text
                  className={
                    tempEndDate ? "text-text-primary" : "text-text-tertiary"
                  }
                >
                  {tempEndDate || "Select end date"}
                </Text>
              </Pressable>
            </View>

            <Text className="text-sm text-text-tertiary mb-6">
              Maximum range is 1 year. Future dates cannot be selected.
            </Text>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  variant="outline"
                  onPress={() => setShowCustomPicker(false)}
                >
                  Cancel
                </Button>
              </View>
              <View className="flex-1">
                <Button
                  onPress={handleApplyCustomRange}
                  disabled={!tempStartDate || !tempEndDate}
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

export default DateRangeSelector;
