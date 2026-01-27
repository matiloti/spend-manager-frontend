import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { DollarSign } from "lucide-react-native";

interface AmountInputProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
  error?: string;
  currency?: string;
  placeholder?: string;
  testID?: string;
}

export function AmountInput({
  value,
  onChange,
  label = "Amount",
  error,
  currency = "$",
  placeholder = "0.00",
  testID,
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value !== undefined ? value.toFixed(2) : ""
  );

  const formatCurrency = useCallback((text: string): string => {
    // Remove all non-numeric characters except decimal point
    const cleaned = text.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }

    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      return parts[0] + "." + parts[1].substring(0, 2);
    }

    return cleaned;
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      const formatted = formatCurrency(text);
      setDisplayValue(formatted);

      const numValue = parseFloat(formatted);
      if (!isNaN(numValue) && numValue >= 0) {
        onChange(numValue);
      } else if (formatted === "" || formatted === ".") {
        onChange(undefined);
      }
    },
    [formatCurrency, onChange]
  );

  const handleBlur = useCallback(() => {
    if (value !== undefined && value > 0) {
      setDisplayValue(value.toFixed(2));
    }
  }, [value]);

  const hasError = !!error;

  return (
    <View className="w-full" testID={testID}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`
          flex-row items-center rounded-xl border px-4 bg-white
          ${hasError ? "border-expense bg-expense-light/20" : "border-gray-300"}
        `}
      >
        <View className="mr-2">
          <Text className="text-lg font-semibold text-gray-500">{currency}</Text>
        </View>
        <TextInput
          className="flex-1 py-3 text-2xl font-bold text-gray-900"
          value={displayValue}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="decimal-pad"
          returnKeyType="done"
          accessibilityLabel={label}
          testID={`${testID}-input`}
        />
      </View>
      {error && (
        <Text className="text-sm text-expense mt-1.5">{error}</Text>
      )}
    </View>
  );
}

export default AmountInput;
