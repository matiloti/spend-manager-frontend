import React from "react";
import { View, Pressable, PressableProps, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

interface PressableCardProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({
  children,
  padding = "md",
  ...props
}: PressableCardProps) {
  return (
    <Pressable
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddingStyles[padding]} active:bg-gray-50`}
      {...props}
    >
      {children}
    </Pressable>
  );
}

export default Card;
