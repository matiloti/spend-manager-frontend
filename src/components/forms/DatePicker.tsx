import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { formatDate, formatDateISO } from "@/utils/formatters";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
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

export function DatePicker({
  value,
  onChange,
  label = "Date",
  error,
  minDate,
  maxDate,
  testID,
}: DatePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewDate, setViewDate] = useState(value);

  const openModal = useCallback(() => {
    setViewDate(value);
    setIsModalVisible(true);
  }, [value]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleSelectDate = useCallback(
    (date: Date) => {
      onChange(date);
      closeModal();
    },
    [onChange, closeModal]
  );

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

  const goToToday = useCallback(() => {
    const today = new Date();
    setViewDate(today);
    handleSelectDate(today);
  }, [handleSelectDate]);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days in the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, []);

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
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

  const hasError = !!error;
  const days = getDaysInMonth(viewDate);

  return (
    <View className="w-full" testID={testID}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <Pressable
        onPress={openModal}
        className={`
          flex-row items-center rounded-xl border px-4 py-3 bg-white
          ${hasError ? "border-expense bg-expense-light/20" : "border-gray-300"}
        `}
        accessibilityRole="button"
        accessibilityLabel={`Select ${label}, current: ${formatDate(value.toISOString())}`}
        testID={`${testID}-trigger`}
      >
        <Calendar size={20} color="#6B7280" />
        <Text className="flex-1 ml-3 text-base text-gray-900">
          {formatDate(value.toISOString())}
        </Text>
      </Pressable>
      {error && <Text className="text-sm text-expense mt-1.5">{error}</Text>}

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={closeModal}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Select Date
              </Text>
              <Pressable
                onPress={closeModal}
                className="p-1 rounded-full active:bg-gray-100"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>

            {/* Month navigation */}
            <View className="flex-row items-center justify-between px-4 py-3">
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
            <View className="flex-row px-2">
              {DAYS.map((day) => (
                <View key={day} className="flex-1 items-center py-2">
                  <Text className="text-xs font-medium text-gray-500">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            <View className="flex-row flex-wrap px-2 pb-4">
              {days.map((date, index) => (
                <View
                  key={index}
                  className="w-[14.28%] items-center py-1"
                >
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
            <View className="px-4 pb-4">
              <Pressable
                onPress={goToToday}
                className="py-3 items-center rounded-xl bg-gray-100 active:bg-gray-200"
                accessibilityRole="button"
                accessibilityLabel="Go to today"
              >
                <Text className="text-base font-semibold text-gray-700">
                  Today
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default DatePicker;
