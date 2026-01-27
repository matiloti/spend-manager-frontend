import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { VictoryPie } from "victory-native";
import { formatCurrency } from "@/utils/formatters";
import { CategoryStatistic } from "@/services/statisticsService";
import { getCategoryIcon } from "@/constants/icons";

interface CategoryDonutChartProps {
  categories: CategoryStatistic[];
  totalAmount: number;
  testID?: string;
}

export function CategoryDonutChart({
  categories,
  totalAmount,
  testID,
}: CategoryDonutChartProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Prepare data for Victory chart
  const chartData = categories.slice(0, 6).map((cat, index) => ({
    x: cat.category.name,
    y: cat.amount,
    color: cat.category.colorCode,
    index,
  }));

  // Handle legend item press
  const handleLegendPress = (index: number) => {
    setHighlightedIndex(highlightedIndex === index ? null : index);
  };

  if (categories.length === 0) {
    return (
      <View className="items-center py-6" testID={testID}>
        <View className="w-[200px] h-[200px] items-center justify-center bg-bg-tertiary rounded-full">
          <Text className="text-text-tertiary text-sm">No data</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="py-6" testID={testID}>
      {/* Donut Chart */}
      <View className="items-center mb-6">
        <View className="relative w-[200px] h-[200px]">
          <VictoryPie
            data={chartData}
            width={200}
            height={200}
            innerRadius={60}
            padAngle={2}
            colorScale={chartData.map((d) => d.color)}
            style={{
              data: {
                opacity: ({ datum }) =>
                  highlightedIndex === null || highlightedIndex === datum.index
                    ? 1
                    : 0.3,
              },
              labels: { display: "none" },
            }}
            animate={{
              duration: 300,
            }}
          />
          {/* Center text */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-2xl font-bold tabular-nums text-text-primary">
              {formatCurrency(totalAmount)}
            </Text>
            <Text className="text-sm text-text-secondary">Total Spent</Text>
          </View>
        </View>
      </View>

      {/* Legend Grid */}
      <View className="flex-row flex-wrap" testID="statistics-category-legend">
        {categories.slice(0, 6).map((cat, index) => {
          const Icon = getCategoryIcon(cat.category.icon);
          const isHighlighted =
            highlightedIndex === null || highlightedIndex === index;

          return (
            <Pressable
              key={cat.category.id}
              onPress={() => handleLegendPress(index)}
              className={`w-1/2 min-h-touch flex-row items-center px-2 py-2 ${
                !isHighlighted ? "opacity-40" : ""
              }`}
              testID={`statistics-legend-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`${cat.category.name}: ${cat.percentage.toFixed(1)}%, ${formatCurrency(cat.amount)}`}
            >
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: cat.category.colorCode }}
              />
              <View className="flex-1 flex-row items-center">
                <Text
                  className="text-body text-text-primary flex-1 mr-1"
                  numberOfLines={1}
                >
                  {cat.category.name}
                </Text>
                <Text className="text-callout text-text-secondary mr-2">
                  {Math.round(cat.percentage)}%
                </Text>
                <Text className="text-callout font-semibold tabular-nums text-text-primary">
                  {formatCurrency(cat.amount)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default CategoryDonutChart;
