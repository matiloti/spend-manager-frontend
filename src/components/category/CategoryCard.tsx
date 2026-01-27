import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Category } from "@/types/models";
import { getCategoryIcon } from "@/constants/icons";
import { Badge } from "@/components/ui/Badge";

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  onLongPress?: () => void;
  showChevron?: boolean;
  showTransactionCount?: boolean;
  testID?: string;
}

export function CategoryCard({
  category,
  onPress,
  onLongPress,
  showChevron = true,
  showTransactionCount = true,
  testID,
}: CategoryCardProps) {
  const Icon = getCategoryIcon(category.icon);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white rounded-2xl p-4 border border-gray-100 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={`Category ${category.name}${
        category.isDefault ? ", default" : ""
      }`}
      testID={testID}
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: category.colorCode + "20" }}
        >
          <Icon size={22} color={category.colorCode} />
        </View>

        {/* Category info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {category.name}
            </Text>
            {category.isDefault && (
              <Badge variant="secondary" size="sm">
                Default
              </Badge>
            )}
          </View>
          {showTransactionCount && category.transactionCount !== undefined && (
            <Text className="text-sm text-gray-500 mt-0.5">
              {category.transactionCount === 0
                ? "No transactions"
                : `${category.transactionCount} transaction${
                    category.transactionCount !== 1 ? "s" : ""
                  }`}
            </Text>
          )}
        </View>

        {/* Chevron */}
        {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
      </View>
    </Pressable>
  );
}

export default CategoryCard;
