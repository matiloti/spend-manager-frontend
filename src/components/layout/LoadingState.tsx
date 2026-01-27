import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

interface LoadingStateProps {
  message?: string;
  size?: "small" | "large";
}

export function LoadingState({
  message = "Loading...",
  size = "large",
}: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={size} color="#3B82F6" />
      {message && (
        <Text className="text-gray-500 mt-4 text-center">{message}</Text>
      )}
    </View>
  );
}

export default LoadingState;
