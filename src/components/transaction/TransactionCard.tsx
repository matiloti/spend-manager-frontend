import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Transaction } from "@/types/models";
import { getCategoryIcon } from "@/constants/icons";
import { formatCurrency, formatRelativeDate } from "@/utils/formatters";

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
  showDate?: boolean;
  showChevron?: boolean;
  testID?: string;
}

export function TransactionCard({
  transaction,
  onPress,
  onLongPress,
  showDate = true,
  showChevron = true,
  testID,
}: TransactionCardProps) {
  const { category, type, amount, description, date, tags } = transaction;

  const Icon = category ? getCategoryIcon(category.icon) : null;
  const categoryColor = category?.colorCode || "#6B7280";

  const isExpense = type === "EXPENSE";
  const formattedAmount = formatCurrency(amount);
  const amountDisplay = isExpense ? `-${formattedAmount}` : `+${formattedAmount}`;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white rounded-2xl p-4 border border-gray-100 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={`${type} ${formattedAmount} for ${category?.name || "Unknown"}`}
      testID={testID}
    >
      <View className="flex-row items-center">
        {/* Category Icon */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: categoryColor + "20" }}
        >
          {Icon && <Icon size={22} color={categoryColor} />}
        </View>

        {/* Transaction Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-base font-semibold text-gray-900 flex-1"
              numberOfLines={1}
            >
              {category?.name || "Unknown Category"}
            </Text>
            <Text
              className={`text-base font-bold ml-2 ${
                isExpense ? "text-expense" : "text-income"
              }`}
            >
              {amountDisplay}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            {description ? (
              <Text className="text-sm text-gray-500 flex-1" numberOfLines={1}>
                {description}
              </Text>
            ) : showDate ? (
              <Text className="text-sm text-gray-400 flex-1">
                {formatRelativeDate(date)}
              </Text>
            ) : (
              <View className="flex-1" />
            )}
          </View>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <View className="flex-row flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <View
                  key={tag.id}
                  className="bg-gray-100 rounded-full px-2 py-0.5"
                >
                  <Text className="text-xs text-gray-600">{tag.name}</Text>
                </View>
              ))}
              {tags.length > 3 && (
                <View className="bg-gray-100 rounded-full px-2 py-0.5">
                  <Text className="text-xs text-gray-600">
                    +{tags.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Chevron */}
        {showChevron && (
          <View className="ml-2">
            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default TransactionCard;
