import React from "react";
import { View, Text, Pressable } from "react-native";
import { Tag } from "lucide-react-native";
import { TransactionSummary } from "@/services/homeService";
import { getCategoryIcon } from "@/constants/icons";
import { formatCurrency } from "@/utils/formatters";

interface TransactionQuickViewProps {
  transaction: TransactionSummary;
  onPress?: () => void;
  testID?: string;
}

export function TransactionQuickView({
  transaction,
  onPress,
  testID,
}: TransactionQuickViewProps) {
  const { type, amount, category, description, time, tagCount } = transaction;

  const Icon = getCategoryIcon(category.icon);
  const isExpense = type === "EXPENSE";

  // Format time for display (HH:MM AM/PM)
  const formatTime = (timeString: string) => {
    // time comes as "HH:MM:SS" format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 px-4 bg-white active:bg-gray-50 min-h-touch"
      accessibilityRole="button"
      accessibilityLabel={`${type} ${formatCurrency(amount)} for ${category.name}`}
      testID={testID}
    >
      {/* Category Icon */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: category.colorCode + "20" }}
      >
        <Icon size={18} color={category.colorCode} />
      </View>

      {/* Transaction Info */}
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="text-base font-medium text-gray-900 flex-1" numberOfLines={1}>
            {category.name}
          </Text>
          <Text
            className={`text-base font-semibold ${
              isExpense ? "text-expense" : "text-income"
            }`}
          >
            {isExpense ? "-" : "+"}
            {formatCurrency(amount)}
          </Text>
        </View>

        <View className="flex-row items-center mt-0.5">
          {description ? (
            <Text className="text-sm text-gray-500 flex-1" numberOfLines={1}>
              {description}
            </Text>
          ) : (
            <Text className="text-sm text-gray-400 flex-1">
              {formatTime(time)}
            </Text>
          )}

          {/* Tag indicator */}
          {tagCount > 0 && (
            <View className="flex-row items-center ml-2">
              <Tag size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-0.5">{tagCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default TransactionQuickView;
