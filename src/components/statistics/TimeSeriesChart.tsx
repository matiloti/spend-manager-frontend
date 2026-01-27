import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from "victory-native";
import { TrendingUp, BarChart3 } from "lucide-react-native";
import { formatCurrency } from "@/utils/formatters";
import { TimeSeriesDataPoint, Granularity } from "@/services/statisticsService";

interface TimeSeriesChartProps {
  dataPoints: TimeSeriesDataPoint[];
  granularity: Granularity;
  showIncome?: boolean;
  testID?: string;
}

type ChartType = "line" | "bar";

export function TimeSeriesChart({
  dataPoints,
  granularity,
  showIncome = false,
  testID,
}: TimeSeriesChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line");
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // Account for padding
  const chartHeight = 200;

  // Prepare data for charts
  const expenseData = dataPoints.map((point, index) => ({
    x: index,
    y: point.expenses,
    label: point.label,
    date: point.date,
  }));

  const incomeData = dataPoints.map((point, index) => ({
    x: index,
    y: point.income,
    label: point.label,
    date: point.date,
  }));

  // Calculate appropriate tick values for X axis
  const getTickValues = () => {
    const tickCount = Math.min(dataPoints.length, 7);
    const step = Math.ceil(dataPoints.length / tickCount);
    return Array.from({ length: tickCount }, (_, i) =>
      Math.min(i * step, dataPoints.length - 1)
    );
  };

  const maxValue = Math.max(
    ...dataPoints.map((p) => Math.max(p.expenses, showIncome ? p.income : 0))
  );

  if (dataPoints.length === 0) {
    return (
      <View
        className="bg-bg-elevated rounded-card shadow-card p-4"
        testID={testID}
      >
        <View className="h-[200px] items-center justify-center">
          <Text className="text-text-tertiary">No data available</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="bg-bg-elevated rounded-card shadow-card p-4"
      testID={testID}
    >
      {/* Chart Type Toggle */}
      <View className="flex-row justify-end mb-4">
        <View className="flex-row bg-bg-tertiary rounded-lg p-1">
          <Pressable
            onPress={() => setChartType("line")}
            className={`w-10 h-9 items-center justify-center rounded-lg ${
              chartType === "line" ? "bg-primary" : ""
            }`}
            testID="statistics-chart-line-toggle"
            accessibilityRole="button"
            accessibilityState={{ selected: chartType === "line" }}
          >
            <TrendingUp
              size={18}
              color={chartType === "line" ? "#FFFFFF" : "#6B7280"}
            />
          </Pressable>
          <Pressable
            onPress={() => setChartType("bar")}
            className={`w-10 h-9 items-center justify-center rounded-lg ${
              chartType === "bar" ? "bg-primary" : ""
            }`}
            testID="statistics-chart-bar-toggle"
            accessibilityRole="button"
            accessibilityState={{ selected: chartType === "bar" }}
          >
            <BarChart3
              size={18}
              color={chartType === "bar" ? "#FFFFFF" : "#6B7280"}
            />
          </Pressable>
        </View>
      </View>

      {/* Chart */}
      <View className="h-[200px]">
        <VictoryChart
          width={chartWidth}
          height={chartHeight}
          theme={VictoryTheme.material}
          domainPadding={{ x: chartType === "bar" ? 20 : 10, y: 10 }}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }) =>
                `${datum.label}\n${formatCurrency(datum.y)}`
              }
              labelComponent={
                <VictoryTooltip
                  cornerRadius={8}
                  flyoutStyle={{
                    fill: "#111827",
                    stroke: "none",
                  }}
                  style={{
                    fill: "#FFFFFF",
                    fontSize: 12,
                  }}
                />
              }
            />
          }
        >
          {/* Y Axis */}
          <VictoryAxis
            dependentAxis
            tickFormat={(t) =>
              t >= 1000 ? `$${(t / 1000).toFixed(0)}k` : `$${t}`
            }
            style={{
              axis: { stroke: "transparent" },
              grid: { stroke: "#F3F4F6", strokeDasharray: "none" },
              tickLabels: { fill: "#6B7280", fontSize: 10 },
            }}
          />

          {/* X Axis */}
          <VictoryAxis
            tickValues={getTickValues()}
            tickFormat={(t) => dataPoints[t]?.label || ""}
            style={{
              axis: { stroke: "#E5E7EB" },
              tickLabels: { fill: "#6B7280", fontSize: 10, angle: -30 },
              grid: { stroke: "none" },
            }}
          />

          {/* Expense Data */}
          {chartType === "line" ? (
            <VictoryLine
              data={expenseData}
              style={{
                data: { stroke: "#EA580C", strokeWidth: 2 },
              }}
              animate={{
                duration: 300,
              }}
            />
          ) : (
            <VictoryBar
              data={expenseData}
              style={{
                data: {
                  fill: "#EA580C",
                  width: Math.max(
                    10,
                    (chartWidth - 80) / dataPoints.length - 4
                  ),
                },
              }}
              cornerRadius={{ top: 4 }}
              animate={{
                duration: 300,
              }}
            />
          )}

          {/* Income Data (optional overlay) */}
          {showIncome &&
            (chartType === "line" ? (
              <VictoryLine
                data={incomeData}
                style={{
                  data: { stroke: "#16A34A", strokeWidth: 2 },
                }}
                animate={{
                  duration: 300,
                }}
              />
            ) : (
              <VictoryBar
                data={incomeData}
                style={{
                  data: {
                    fill: "#16A34A",
                    width: Math.max(
                      8,
                      (chartWidth - 80) / dataPoints.length / 2 - 2
                    ),
                    opacity: 0.7,
                  },
                }}
                cornerRadius={{ top: 4 }}
                animate={{
                  duration: 300,
                }}
              />
            ))}
        </VictoryChart>
      </View>

      {/* Legend */}
      <View className="flex-row justify-center gap-6 mt-2">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm bg-expense" />
          <Text className="text-sm text-text-secondary">Expenses</Text>
        </View>
        {showIncome && (
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-sm bg-income" />
            <Text className="text-sm text-text-secondary">Income</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default TimeSeriesChart;
