import React from "react";
import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Minus } from "lucide-react-native";
import { formatCurrency } from "@/utils/formatters";
import { Trend, ComparisonMetric } from "@/services/statisticsService";

interface ComparisonCardProps {
  title: string;
  type: "expense" | "income";
  current: number;
  previous: number;
  trend: Trend;
  changePercentage: number;
  changeAmount: number;
  testID?: string;
}

export function ComparisonCard({
  title,
  type,
  current,
  previous,
  trend,
  changePercentage,
  changeAmount,
  testID,
}: ComparisonCardProps) {
  const maxValue = Math.max(current, previous);
  const currentPercentage = maxValue > 0 ? (current / maxValue) * 100 : 0;
  const previousPercentage = maxValue > 0 ? (previous / maxValue) * 100 : 0;

  // Determine change color based on type and trend
  // For expenses: UP is bad (more spending), DOWN is good
  // For income: UP is good (more income), DOWN is bad
  const getChangeColor = () => {
    if (trend === "FLAT") return "text-text-secondary";

    if (type === "expense") {
      return trend === "UP" ? "text-balance-negative" : "text-balance-positive";
    }
    return trend === "UP" ? "text-balance-positive" : "text-balance-negative";
  };

  const getTrendColor = () => {
    if (trend === "FLAT") return "#6B7280";

    if (type === "expense") {
      return trend === "UP" ? "#DC2626" : "#16A34A";
    }
    return trend === "UP" ? "#16A34A" : "#DC2626";
  };

  const TrendIcon =
    trend === "UP" ? TrendingUp : trend === "DOWN" ? TrendingDown : Minus;
  const changeColor = getChangeColor();
  const trendColor = getTrendColor();
  const barColor = type === "expense" ? "#EA580C" : "#16A34A"; // expense orange, income green

  return (
    <View
      className="flex-1 bg-bg-elevated rounded-card shadow-card p-4"
      testID={testID}
    >
      <Text className="text-sm text-text-secondary mb-2">{title}</Text>

      {/* Change indicator */}
      <View className="flex-row items-center gap-1 mb-3">
        <TrendIcon size={16} color={trendColor} />
        <Text className={`text-base font-semibold ${changeColor}`}>
          {trend === "UP" ? "+" : trend === "DOWN" ? "" : ""}
          {changePercentage.toFixed(1)}%
        </Text>
        <Text className="text-sm text-text-tertiary">
          ({trend === "UP" ? "+" : ""}
          {formatCurrency(changeAmount)})
        </Text>
      </View>

      {/* Current period bar */}
      <View className="mb-2">
        <View className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${currentPercentage}%`,
              backgroundColor: barColor,
            }}
          />
        </View>
        <Text className="text-xs text-text-tertiary mt-1">
          This period: {formatCurrency(current)}
        </Text>
      </View>

      {/* Previous period bar */}
      <View>
        <View className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${previousPercentage}%`,
              backgroundColor: barColor,
              opacity: 0.4,
            }}
          />
        </View>
        <Text className="text-xs text-text-tertiary mt-1">
          Last period: {formatCurrency(previous)}
        </Text>
      </View>
    </View>
  );
}

export default ComparisonCard;
