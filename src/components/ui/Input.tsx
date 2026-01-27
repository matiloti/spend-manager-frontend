import React from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<TextInput>;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  editable = true,
  ref,
  ...props
}: InputProps) {
  const hasError = !!error;
  const isDisabled = editable === false;

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`
            flex-row items-center rounded-xl border px-4
            ${hasError ? "border-expense bg-expense-light/20" : "border-gray-300 bg-white"}
            ${isDisabled ? "bg-gray-100 opacity-60" : ""}
          `}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          ref={ref}
          className={`
              flex-1 py-3 text-base text-gray-900
              ${isDisabled ? "text-gray-500" : ""}
            `}
          placeholderTextColor="#9CA3AF"
          editable={editable}
          accessibilityLabel={label}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text
          className={`text-sm mt-1.5 ${hasError ? "text-expense" : "text-gray-500"}`}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

export default Input;
