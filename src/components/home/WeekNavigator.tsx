import React, { useCallback, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { DaySummary } from "@/services/homeService";

interface WeekNavigatorProps {
  days: DaySummary[];
  weekStart: string;
  weekEnd: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  canGoNext: boolean;
  testID?: string;
}

// Short day names
const DAY_NAMES: Record<string, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export function WeekNavigator({
  days,
  selectedDate,
  onSelectDate,
  onPreviousWeek,
  onNextWeek,
  canGoNext,
  testID,
}: WeekNavigatorProps) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const formatDateLabel = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.getDate().toString();
  }, []);

  const renderDay = useCallback(
    (day: DaySummary) => {
      const isSelected = day.date === selectedDate;
      const isToday = day.date === today;
      const isFuture = day.date > today;

      return (
        <Pressable
          key={day.date}
          onPress={() => !isFuture && onSelectDate(day.date)}
          className={`flex-1 items-center py-2 mx-0.5 rounded-xl min-h-touch ${
            isSelected
              ? "bg-primary-500"
              : isToday
              ? "bg-primary-50"
              : "bg-transparent"
          }`}
          disabled={isFuture}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: isFuture }}
          accessibilityLabel={`${DAY_NAMES[day.dayOfWeek]} ${formatDateLabel(day.date)}`}
          testID={`day-${day.date}`}
        >
          <Text
            className={`text-xs font-medium mb-1 ${
              isSelected
                ? "text-white"
                : isFuture
                ? "text-gray-300"
                : isToday
                ? "text-primary-600"
                : "text-gray-500"
            }`}
          >
            {DAY_NAMES[day.dayOfWeek]}
          </Text>
          <Text
            className={`text-base font-semibold ${
              isSelected
                ? "text-white"
                : isFuture
                ? "text-gray-300"
                : isToday
                ? "text-primary-600"
                : "text-gray-900"
            }`}
          >
            {formatDateLabel(day.date)}
          </Text>
          {/* Transaction indicator dot */}
          <View className="h-1.5 mt-1">
            {day.hasTransactions && !isFuture && (
              <View
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-white" : "bg-primary-500"
                }`}
                testID={`indicator-${day.date}`}
              />
            )}
          </View>
        </Pressable>
      );
    },
    [selectedDate, today, onSelectDate, formatDateLabel]
  );

  return (
    <View className="bg-white" testID={testID}>
      {/* Week navigation arrows */}
      <View className="flex-row items-center justify-between px-4 pb-2">
        <Pressable
          onPress={onPreviousWeek}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-gray-100"
          accessibilityLabel="Previous week"
          accessibilityRole="button"
          testID="previous-week-button"
        >
          <ChevronLeft size={24} color="#6B7280" />
        </Pressable>

        <Pressable
          onPress={onNextWeek}
          disabled={!canGoNext}
          className={`w-11 h-11 items-center justify-center rounded-full ${
            canGoNext ? "active:bg-gray-100" : "opacity-30"
          }`}
          accessibilityLabel="Next week"
          accessibilityRole="button"
          accessibilityState={{ disabled: !canGoNext }}
          testID="next-week-button"
        >
          <ChevronRight size={24} color={canGoNext ? "#6B7280" : "#D1D5DB"} />
        </Pressable>
      </View>

      {/* Days row */}
      <View className="flex-row px-2 pb-3">
        {days.map(renderDay)}
      </View>
    </View>
  );
}

export default WeekNavigator;
