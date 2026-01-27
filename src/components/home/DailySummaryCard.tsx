import React from "react";
import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DailyBalance } from "@/services/homeService";

interface DailySummaryCardProps {
  date: string;
  balance: DailyBalance;
  testID?: string;
}

export function DailySummaryCard({
  date,
  balance,
  testID,
}: DailySummaryCardProps) {
  const { totalIncome, totalExpenses, netBalance } = balance;
  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;
  const isNeutral = netBalance === 0;

  // Format date for display
  const displayDate = formatDate(date, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive ? "#22C55E" : isNegative ? "#EF4444" : "#6B7280";

  return (
    <View
      className="bg-white rounded-2xl p-4 mx-4 shadow-sm border border-gray-100"
      testID={testID}
    >
      {/* Date header */}
      <Text className="text-base font-medium text-gray-500 mb-3">
        {displayDate}
      </Text>

      {/* Net balance */}
      <View className="flex-row items-center mb-4">
        <View
          className={`p-2 rounded-full mr-3 ${
            isPositive
              ? "bg-income-light"
              : isNegative
              ? "bg-expense-light"
              : "bg-gray-100"
          }`}
        >
          <TrendIcon size={20} color={trendColor} />
        </View>
        <View>
          <Text className="text-sm text-gray-500">Net Balance</Text>
          <Text
            className={`text-2xl font-bold ${
              isPositive
                ? "text-income"
                : isNegative
                ? "text-expense"
                : "text-gray-600"
            }`}
            testID="net-balance"
          >
            {isPositive && "+"}
            {formatCurrency(netBalance)}
          </Text>
        </View>
      </View>

      {/* Income/Expense breakdown */}
      <View className="flex-row border-t border-gray-100 pt-3">
        <View className="flex-1 pr-3 border-r border-gray-100">
          <Text className="text-sm text-gray-500 mb-1">Income</Text>
          <Text className="text-base font-semibold text-income" testID="income-amount">
            +{formatCurrency(totalIncome)}
          </Text>
          {balance.incomeCount !== undefined && (
            <Text className="text-xs text-gray-400">
              {balance.incomeCount} transaction{balance.incomeCount !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <View className="flex-1 pl-3">
          <Text className="text-sm text-gray-500 mb-1">Expenses</Text>
          <Text className="text-base font-semibold text-expense" testID="expense-amount">
            -{formatCurrency(totalExpenses)}
          </Text>
          {balance.expenseCount !== undefined && (
            <Text className="text-xs text-gray-400">
              {balance.expenseCount} transaction{balance.expenseCount !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default DailySummaryCard;
