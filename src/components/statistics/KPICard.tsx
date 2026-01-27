import React from "react";
import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";
import { formatCurrency } from "@/utils/formatters";
import { Trend } from "@/services/statisticsService";

interface KPICardProps {
  label: string;
  amount: number;
  trend?: Trend;
  trendPercentage?: number;
  type: "expense" | "income" | "balance";
  testID?: string;
}

export function KPICard({
  label,
  amount,
  trend,
  trendPercentage,
  type,
  testID,
}: KPICardProps) {
  // Determine amount color based on type
  const getAmountColor = () => {
    switch (type) {
      case "expense":
        return "text-expense";
      case "income":
        return "text-income";
      case "balance":
        return amount >= 0 ? "text-balance-positive" : "text-balance-negative";
      default:
        return "text-text-primary";
    }
  };

  // Determine trend color and semantics based on type
  const getTrendColor = () => {
    if (!trend || trend === "FLAT") return "#6B7280"; // gray

    // For expenses: UP is bad (red), DOWN is good (green)
    // For income/balance: UP is good (green), DOWN is bad (red)
    if (type === "expense") {
      return trend === "UP" ? "#DC2626" : "#16A34A"; // red for up, green for down
    }
    return trend === "UP" ? "#16A34A" : "#DC2626"; // green for up, red for down
  };

  const getTrendTextColor = () => {
    if (!trend || trend === "FLAT") return "text-text-secondary";

    if (type === "expense") {
      return trend === "UP" ? "text-balance-negative" : "text-balance-positive";
    }
    return trend === "UP" ? "text-balance-positive" : "text-balance-negative";
  };

  const TrendIcon =
    trend === "UP" ? TrendingUp : trend === "DOWN" ? TrendingDown : Minus;

  const trendColor = getTrendColor();
  const trendTextColor = getTrendTextColor();

  return (
    <View
      className="w-[140px] bg-bg-elevated rounded-card shadow-card p-4"
      testID={testID}
      accessibilityLabel={`${label}: ${formatCurrency(amount)}${
        trendPercentage !== undefined
          ? `, ${trend === "UP" ? "increased" : trend === "DOWN" ? "decreased" : "unchanged"} by ${Math.abs(trendPercentage).toFixed(1)} percent`
          : ""
      }`}
    >
      <Text className="text-sm text-text-secondary mb-1">{label}</Text>
      <Text className={`text-xl font-bold tabular-nums ${getAmountColor()}`}>
        {type === "income" && amount > 0 ? "+" : ""}
        {type === "expense" && amount > 0 ? "-" : ""}
        {formatCurrency(Math.abs(amount))}
      </Text>

      {trend && trendPercentage !== undefined && (
        <View className="flex-row items-center gap-1 mt-2">
          <TrendIcon size={14} color={trendColor} />
          <Text className={`text-sm font-medium ${trendTextColor}`}>
            {Math.abs(trendPercentage).toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}

interface SecondaryKPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  testID?: string;
}

export function SecondaryKPICard({
  icon,
  label,
  value,
  testID,
}: SecondaryKPICardProps) {
  return (
    <View
      className="flex-1 bg-bg-elevated rounded-card shadow-card p-4 flex-row items-center justify-between"
      testID={testID}
    >
      <View className="flex-row items-center gap-2">
        <View className="w-icon-sm h-icon-sm">{icon}</View>
        <Text className="text-sm text-text-secondary">{label}</Text>
      </View>
      <Text className="text-lg font-semibold tabular-nums text-text-primary">
        {value}
      </Text>
    </View>
  );
}

export default KPICard;
