import React from "react";
import { View, Text, Pressable } from "react-native";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { CategoryType } from "@/types/models";

interface TypeToggleProps {
  value: CategoryType;
  onChange: (type: CategoryType) => void;
  disabled?: boolean;
}

export function TypeToggle({
  value,
  onChange,
  disabled = false,
}: TypeToggleProps) {
  return (
    <View className="flex-row gap-3">
      <Pressable
        onPress={() => !disabled && onChange("EXPENSE")}
        disabled={disabled}
        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border-2 ${
          value === "EXPENSE"
            ? "bg-expense-light border-expense"
            : "bg-gray-50 border-gray-200"
        } ${disabled ? "opacity-50" : ""}`}
        accessibilityLabel="Expense category"
        accessibilityRole="button"
        accessibilityState={{ selected: value === "EXPENSE", disabled }}
      >
        <TrendingDown
          size={18}
          color={value === "EXPENSE" ? "#EA580C" : "#6B7280"}
        />
        <Text
          className={`font-semibold ${
            value === "EXPENSE" ? "text-expense" : "text-gray-500"
          }`}
        >
          Expense
        </Text>
      </Pressable>

      <Pressable
        onPress={() => !disabled && onChange("INCOME")}
        disabled={disabled}
        className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border-2 ${
          value === "INCOME"
            ? "bg-income-light border-income"
            : "bg-gray-50 border-gray-200"
        } ${disabled ? "opacity-50" : ""}`}
        accessibilityLabel="Income category"
        accessibilityRole="button"
        accessibilityState={{ selected: value === "INCOME", disabled }}
      >
        <TrendingUp
          size={18}
          color={value === "INCOME" ? "#16A34A" : "#6B7280"}
        />
        <Text
          className={`font-semibold ${
            value === "INCOME" ? "text-income" : "text-gray-500"
          }`}
        >
          Income
        </Text>
      </Pressable>
    </View>
  );
}

export default TypeToggle;
