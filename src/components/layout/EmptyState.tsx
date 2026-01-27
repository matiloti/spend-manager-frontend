import React from "react";
import { View, Text } from "react-native";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      {icon && <View className="mb-4">{icon}</View>}
      <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-gray-500 text-center mb-6">{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction}>{actionLabel}</Button>
      )}
    </View>
  );
}

export default EmptyState;
