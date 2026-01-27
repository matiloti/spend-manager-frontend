import React from "react";
import { View, Text } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

interface StatisticsErrorStateProps {
  onRetry?: () => void;
  testID?: string;
}

export function StatisticsErrorState({
  onRetry,
  testID,
}: StatisticsErrorStateProps) {
  return (
    <View
      className="flex-1 items-center justify-center p-8"
      testID={testID || "statistics-error"}
    >
      <View className="mb-6">
        <AlertTriangle size={48} color="#D97706" />
      </View>
      <Text className="text-lg font-semibold text-text-primary mb-2 text-center">
        Couldn't load statistics
      </Text>
      <Text className="text-body text-text-secondary text-center max-w-[280px] mb-6">
        Please check your connection and try again.
      </Text>
      {onRetry && <Button onPress={onRetry}>Try Again</Button>}
    </View>
  );
}

export default StatisticsErrorState;
