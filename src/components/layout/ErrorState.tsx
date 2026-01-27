import React from "react";
import { View, Text } from "react-native";
import { AlertCircle } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading the data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <View className="mb-4 p-3 rounded-full bg-expense-light">
        <AlertCircle size={32} color="#EF4444" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>
      <Text className="text-gray-500 text-center mb-6">{message}</Text>
      {onRetry && (
        <Button variant="outline" onPress={onRetry}>
          Try Again
        </Button>
      )}
    </View>
  );
}

export default ErrorState;
