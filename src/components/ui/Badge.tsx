import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100",
  primary: "bg-primary-100",
  success: "bg-income-light",
  warning: "bg-yellow-100",
  error: "bg-expense-light",
};

const variantTextStyles: Record<BadgeVariant, string> = {
  default: "text-gray-700",
  primary: "text-primary-700",
  success: "text-income-dark",
  warning: "text-yellow-700",
  error: "text-expense-dark",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5",
  md: "px-2.5 py-1",
};

const textSizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs",
  md: "text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
}: BadgeProps) {
  return (
    <View className={`rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}>
      <Text
        className={`font-medium ${variantTextStyles[variant]} ${textSizeStyles[size]}`}
      >
        {children}
      </Text>
    </View>
  );
}

export default Badge;
