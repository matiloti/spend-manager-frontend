import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { formatDate, formatDateISO } from "@/utils/formatters";

interface InlineCalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  testID?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Inline calendar component without modal wrapper.
 * Use this when you need to embed a calendar inside your own modal or view.
 */
export function InlineCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  testID,
}: InlineCalendarProps) {
  // Initialize viewDate with a stable reference
  const [viewDate, setViewDate] = useState(() => new Date(value));

  const goToPreviousMonth = useCallback(() => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const handleSelectDate = useCallback(
    (date: Date) => {
      onChange(date);
    },
    [onChange]
  );

  const goToToday = useCallback(() => {
    const today = new Date();
    setViewDate(today);
    handleSelectDate(today);
  }, [handleSelectDate]);

  // Memoize the days array computation
  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const result: (Date | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      result.push(null);
    }

    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(new Date(year, month, i));
    }

    return result;
  }, [viewDate]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate) {
        const minDateOnly = new Date(
          minDate.getFullYear(),
          minDate.getMonth(),
          minDate.getDate()
        );
        const dateOnly = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        if (dateOnly < minDateOnly) return true;
      }
      if (maxDate) {
        const maxDateOnly = new Date(
          maxDate.getFullYear(),
          maxDate.getMonth(),
          maxDate.getDate()
        );
        const dateOnly = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
        if (dateOnly > maxDateOnly) return true;
      }
      return false;
    },
    [minDate, maxDate]
  );

  const isToday = useCallback((date: Date) => {
    const today = new Date();
    return formatDateISO(date) === formatDateISO(today);
  }, []);

  const isSelected = useCallback(
    (date: Date) => {
      return formatDateISO(date) === formatDateISO(value);
    },
    [value]
  );

  return (
    <View testID={testID}>
      {/* Month navigation */}
      <View className="flex-row items-center justify-between py-2">
        <Pressable
          onPress={goToPreviousMonth}
          className="p-2 rounded-full active:bg-gray-100"
          accessibilityLabel="Previous month"
          accessibilityRole="button"
        >
          <ChevronLeft size={24} color="#374151" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </Text>
        <Pressable
          onPress={goToNextMonth}
          className="p-2 rounded-full active:bg-gray-100"
          accessibilityLabel="Next month"
          accessibilityRole="button"
        >
          <ChevronRight size={24} color="#374151" />
        </Pressable>
      </View>

      {/* Day names */}
      <View className="flex-row">
        {DAYS.map((day) => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-xs font-medium text-gray-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap pb-2">
        {days.map((date, index) => (
          <View key={index} className="w-[14.28%] items-center py-1">
            {date ? (
              <Pressable
                onPress={() => handleSelectDate(date)}
                disabled={isDateDisabled(date)}
                className={`
                  w-10 h-10 rounded-full items-center justify-center
                  ${isSelected(date) ? "bg-primary" : ""}
                  ${isToday(date) && !isSelected(date) ? "border border-primary" : ""}
                  ${isDateDisabled(date) ? "opacity-30" : "active:bg-gray-100"}
                `}
                accessibilityRole="button"
                accessibilityLabel={formatDate(date.toISOString())}
                accessibilityState={{
                  selected: isSelected(date),
                  disabled: isDateDisabled(date),
                }}
              >
                <Text
                  className={`
                    text-base
                    ${isSelected(date) ? "text-white font-semibold" : "text-gray-900"}
                  `}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            ) : (
              <View className="w-10 h-10" />
            )}
          </View>
        ))}
      </View>

      {/* Today button */}
      <Pressable
        onPress={goToToday}
        className="py-3 items-center rounded-xl bg-gray-100 active:bg-gray-200"
        accessibilityRole="button"
        accessibilityLabel="Go to today"
      >
        <Text className="text-base font-semibold text-gray-700">Today</Text>
      </Pressable>
    </View>
  );
}

export default InlineCalendar;
