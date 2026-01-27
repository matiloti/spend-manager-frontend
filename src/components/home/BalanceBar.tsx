import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { formatCurrency } from "@/utils/formatters";

interface BalanceBarProps {
  income: number;
  expenses: number;
  expensePercentage: number;
  isOverspent: boolean;
  testID?: string;
}

export function BalanceBar({
  income,
  expenses,
  expensePercentage,
  isOverspent,
  testID,
}: BalanceBarProps) {
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withTiming(Math.min(expensePercentage, 100), {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [expensePercentage, animatedWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  const netBalance = income - expenses;
  const remainingPercentage = Math.max(0, 100 - expensePercentage);

  return (
    <View className="px-4 py-3" testID={testID}>
      {/* Labels row */}
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-sm text-gray-500">Spent</Text>
          <Text className={`text-lg font-bold ${isOverspent ? "text-expense" : "text-gray-900"}`}>
            {formatCurrency(expenses)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">
            {isOverspent ? "Over by" : "Remaining"}
          </Text>
          <Text
            className={`text-lg font-bold ${
              isOverspent ? "text-expense" : "text-income"
            }`}
          >
            {isOverspent
              ? formatCurrency(Math.abs(netBalance))
              : formatCurrency(netBalance)}
          </Text>
        </View>
      </View>

      {/* Balance bar */}
      <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <Animated.View
          style={animatedStyle}
          className={`h-full rounded-full ${
            isOverspent ? "bg-expense" : "bg-primary-500"
          }`}
          testID="balance-bar-fill"
        />
      </View>

      {/* Percentage labels */}
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-gray-400">
          {Math.round(expensePercentage)}% spent
        </Text>
        {!isOverspent && (
          <Text className="text-xs text-gray-400">
            {Math.round(remainingPercentage)}% left
          </Text>
        )}
        {isOverspent && (
          <Text className="text-xs text-expense">
            {Math.round(expensePercentage - 100)}% over budget
          </Text>
        )}
      </View>

      {/* Income reference */}
      <View className="mt-2 pt-2 border-t border-gray-100">
        <Text className="text-sm text-gray-500">
          Income: <Text className="text-income font-medium">{formatCurrency(income)}</Text>
        </Text>
      </View>
    </View>
  );
}

export default BalanceBar;
