import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react-native";
import { formatCurrency } from "@/utils/formatters";
import { MonthlySummary, MonthComparison, TopCategory } from "@/services/homeService";
import { getCategoryIcon } from "@/constants/icons";

interface MonthlySummaryCardProps {
  monthName: string;
  summary: MonthlySummary;
  comparison: MonthComparison;
  topCategories: TopCategory[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  testID?: string;
}

export function MonthlySummaryCard({
  monthName,
  summary,
  comparison,
  topCategories,
  isExpanded,
  onToggleExpand,
  testID,
}: MonthlySummaryCardProps) {
  const { totalExpenses, totalIncome, netBalance, daysWithTransactions } = summary;
  const { expenseChange } = comparison;

  // Animation for expansion
  const rotateAnim = useSharedValue(isExpanded ? 180 : 0);
  const heightAnim = useSharedValue(isExpanded ? 1 : 0);

  React.useEffect(() => {
    rotateAnim.value = withTiming(isExpanded ? 180 : 0, {
      duration: 200,
      easing: Easing.ease,
    });
    heightAnim.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [isExpanded, rotateAnim, heightAnim]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotateAnim.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: heightAnim.value,
    maxHeight: heightAnim.value === 0 ? 0 : 500,
  }));

  const isPositive = netBalance >= 0;

  // Expense trend indicator
  const isSpendingUp = expenseChange > 0;
  const isSpendingDown = expenseChange < 0;
  const TrendIcon = isSpendingUp
    ? TrendingUp
    : isSpendingDown
    ? TrendingDown
    : Minus;

  const renderCategoryBar = useCallback((item: TopCategory, index: number) => {
    const Icon = getCategoryIcon(item.category.icon);

    return (
      <View key={item.category.id} className="mb-3" testID={`category-${index}`}>
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center flex-1">
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-2"
              style={{ backgroundColor: item.category.colorCode + "20" }}
            >
              <Icon size={16} color={item.category.colorCode} />
            </View>
            <Text className="text-sm font-medium text-gray-900 flex-1" numberOfLines={1}>
              {item.category.name}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-gray-900">
            {formatCurrency(item.amount)}
          </Text>
        </View>
        {/* Progress bar */}
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.category.colorCode,
            }}
          />
        </View>
        <Text className="text-xs text-gray-400 mt-0.5">
          {Math.round(item.percentage)}% of expenses
        </Text>
      </View>
    );
  }, []);

  return (
    <View
      className="bg-white rounded-2xl mx-4 shadow-sm border border-gray-100 overflow-hidden"
      testID={testID}
    >
      {/* Header - Always visible */}
      <Pressable
        onPress={onToggleExpand}
        className="flex-row items-center justify-between p-4 min-h-touch"
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`Monthly summary for ${monthName}`}
        testID="monthly-header"
      >
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">{monthName}</Text>
          <Text className="text-sm text-gray-500">
            {daysWithTransactions} days with transactions
          </Text>
        </View>

        <View className="flex-row items-center">
          {/* Quick summary */}
          <View className="mr-3 items-end">
            <Text
              className={`text-base font-bold ${
                isPositive ? "text-income" : "text-expense"
              }`}
            >
              {isPositive ? "+" : ""}{formatCurrency(netBalance)}
            </Text>
            {expenseChange !== 0 && (
              <View className="flex-row items-center">
                <TrendIcon
                  size={12}
                  color={isSpendingUp ? "#EF4444" : "#22C55E"}
                />
                <Text
                  className={`text-xs ml-0.5 ${
                    isSpendingUp ? "text-expense" : "text-income"
                  }`}
                >
                  {Math.abs(expenseChange).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          <Animated.View style={chevronStyle}>
            <ChevronDown size={20} color="#6B7280" />
          </Animated.View>
        </View>
      </Pressable>

      {/* Expanded content */}
      <Animated.View style={contentStyle} className="overflow-hidden">
        <View className="px-4 pb-4 border-t border-gray-100">
          {/* Income/Expense summary */}
          <View className="flex-row py-4">
            <View className="flex-1 pr-3 border-r border-gray-100">
              <Text className="text-sm text-gray-500 mb-1">Total Income</Text>
              <Text className="text-xl font-bold text-income">
                +{formatCurrency(totalIncome)}
              </Text>
            </View>
            <View className="flex-1 pl-3">
              <Text className="text-sm text-gray-500 mb-1">Total Expenses</Text>
              <Text className="text-xl font-bold text-expense">
                -{formatCurrency(totalExpenses)}
              </Text>
            </View>
          </View>

          {/* Top categories */}
          {topCategories.length > 0 && (
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Top Spending Categories
              </Text>
              {topCategories.slice(0, 3).map((cat, index) =>
                renderCategoryBar(cat, index)
              )}
            </View>
          )}

          {topCategories.length === 0 && (
            <Text className="text-sm text-gray-400 text-center py-4">
              No expenses recorded this month
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export default MonthlySummaryCard;
