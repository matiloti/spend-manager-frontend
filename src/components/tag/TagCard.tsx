import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight, Tag as TagIcon } from "lucide-react-native";
import { Tag } from "@/types/models";

interface TagCardProps {
  tag: Tag;
  onPress?: () => void;
  onLongPress?: () => void;
  showChevron?: boolean;
  showTransactionCount?: boolean;
  testID?: string;
}

export function TagCard({
  tag,
  onPress,
  onLongPress,
  showChevron = true,
  showTransactionCount = true,
  testID,
}: TagCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white rounded-2xl p-4 border border-gray-100 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={`Tag ${tag.name}`}
      testID={testID}
    >
      <View className="flex-row items-center">
        {/* Color indicator */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: tag.colorCode + "20" }}
        >
          <TagIcon size={22} color={tag.colorCode} />
        </View>

        {/* Tag info */}
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
          >
            {tag.name}
          </Text>
          {showTransactionCount && tag.transactionCount !== undefined && (
            <Text className="text-sm text-gray-500 mt-0.5">
              {tag.transactionCount === 0
                ? "No transactions"
                : `${tag.transactionCount} transaction${
                    tag.transactionCount !== 1 ? "s" : ""
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

export default TagCard;
