import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  View,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 active:bg-primary-600",
  secondary: "bg-gray-100 active:bg-gray-200",
  outline: "bg-transparent border border-gray-300 active:bg-gray-50",
  ghost: "bg-transparent active:bg-gray-100",
  danger: "bg-expense active:bg-expense-dark",
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-gray-700",
  outline: "text-gray-700",
  ghost: "text-gray-700",
  danger: "text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-2",
  md: "px-4 py-3",
  lg: "px-6 py-4",
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`
        flex-row items-center justify-center rounded-xl
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${isDisabled ? "opacity-50" : ""}
        ${fullWidth ? "w-full" : ""}
      `}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "#FFFFFF" : "#374151"}
          size="small"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {leftIcon}
          <Text
            className={`font-semibold ${variantTextStyles[variant]} ${textSizeStyles[size]}`}
          >
            {children}
          </Text>
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}

export default Button;
