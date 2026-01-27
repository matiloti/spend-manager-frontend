import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
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

// Fallback styles for when NativeWind fails
const fallbackVariantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: "#3B82F6" },
  secondary: { backgroundColor: "#F3F4F6" },
  outline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#D1D5DB" },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: "#EF4444" },
};

const fallbackVariantTextStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: "#FFFFFF" },
  secondary: { color: "#374151" },
  outline: { color: "#374151" },
  ghost: { color: "#374151" },
  danger: { color: "#FFFFFF" },
};

const fallbackSizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingHorizontal: 12, paddingVertical: 8 },
  md: { paddingHorizontal: 16, paddingVertical: 12 },
  lg: { paddingHorizontal: 24, paddingVertical: 16 },
};

const fallbackTextSizeStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
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
      style={[
        styles.base,
        fallbackVariantStyles[variant],
        fallbackSizeStyles[size],
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
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
        <View style={styles.content} className="flex-row items-center gap-2">
          {leftIcon}
          <Text
            style={[styles.text, fallbackVariantTextStyles[variant], fallbackTextSizeStyles[size]]}
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

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },
});

export default Button;
