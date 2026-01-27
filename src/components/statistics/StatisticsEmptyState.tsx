import React from "react";
import { View, Text } from "react-native";
import { BarChart3 } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

interface StatisticsEmptyStateProps {
  onChangeDateRange?: () => void;
  testID?: string;
}

export function StatisticsEmptyState({
  onChangeDateRange,
  testID,
}: StatisticsEmptyStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center p-8"
      testID={testID || "statistics-empty"}
    >
      <View className="mb-6">
        <BarChart3 size={64} color="#9CA3AF" />
      </View>
      <Text className="text-lg font-semibold text-text-primary mb-2 text-center">
        No data for this period
      </Text>
      <Text className="text-body text-text-secondary text-center max-w-[280px] mb-6">
        Try selecting a different date range or account to see your statistics.
      </Text>
      {onChangeDateRange && (
        <Button variant="outline" onPress={onChangeDateRange}>
          Change Date Range
        </Button>
      )}
    </View>
  );
}

export default StatisticsEmptyState;
