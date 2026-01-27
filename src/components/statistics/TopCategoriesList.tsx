import React from "react";
import { View, Text } from "react-native";
import { formatCurrency } from "@/utils/formatters";
import { CategoryStatistic } from "@/services/statisticsService";
import { getCategoryIcon } from "@/constants/icons";

interface TopCategoriesListProps {
  categories: CategoryStatistic[];
  testID?: string;
}

// Ranking badge colors
const RANK_COLORS: Record<number, string> = {
  1: "#EAB308", // Gold
  2: "#9CA3AF", // Silver
  3: "#CD7F32", // Bronze
};

export function TopCategoriesList({
  categories,
  testID,
}: TopCategoriesListProps) {
  if (categories.length === 0) {
    return (
      <View
        className="bg-bg-elevated rounded-card shadow-card p-6"
        testID={testID}
      >
        <Text className="text-text-tertiary text-center">
          No categories to display
        </Text>
      </View>
    );
  }

  return (
    <View
      className="bg-bg-elevated rounded-card shadow-card overflow-hidden"
      testID={testID}
    >
      {categories.map((cat, index) => {
        const Icon = getCategoryIcon(cat.category.icon);
        const rank = index + 1;
        const rankColor = RANK_COLORS[rank];

        return (
          <View
            key={cat.category.id}
            className={`p-4 ${
              index < categories.length - 1 ? "border-b border-border-subtle" : ""
            }`}
            testID={`statistics-top-category-${index}`}
          >
            <View className="flex-row items-center">
              {/* Rank Badge (only for top 3) */}
              {rankColor ? (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-2"
                  style={{ backgroundColor: rankColor }}
                >
                  <Text className="text-xs font-bold text-white">{rank}</Text>
                </View>
              ) : (
                <View className="w-6 h-6 mr-2" />
              )}

              {/* Category Icon */}
              <View
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: cat.category.colorCode + "20" }}
              >
                <Icon size={16} color={cat.category.colorCode} />
              </View>

              {/* Category Name */}
              <Text
                className="text-body font-medium text-text-primary flex-1"
                numberOfLines={1}
              >
                {cat.category.name}
              </Text>

              {/* Amount */}
              <Text className="text-body font-semibold tabular-nums text-text-primary">
                {formatCurrency(cat.amount)}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="mt-2 flex-row items-center gap-2">
              <View className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.category.colorCode,
                  }}
                />
              </View>
              <Text className="text-sm text-text-secondary w-12 text-right">
                {Math.round(cat.percentage)}%
              </Text>
            </View>

            {/* Transaction count */}
            <Text className="text-xs text-text-tertiary mt-1 ml-8">
              {cat.transactionCount} transaction
              {cat.transactionCount !== 1 ? "s" : ""}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default TopCategoriesList;
