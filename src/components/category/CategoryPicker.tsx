import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Category, CategoryType } from "@/types/models";
import { getCategoryIcon } from "@/constants/icons";
import { useCategoriesByType } from "@/hooks/api/useCategories";

interface CategoryPickerProps {
  value: string | null;
  onChange: (categoryId: string) => void;
  type: CategoryType;
  label?: string;
  error?: string;
  placeholder?: string;
}

export function CategoryPicker({
  value,
  onChange,
  type,
  label,
  error,
  placeholder = "Select category",
}: CategoryPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const { data: categoriesData, isLoading } = useCategoriesByType(type);
  const categories = categoriesData?.content || [];

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === value),
    [categories, value]
  );

  const handleSelect = useCallback(
    (category: Category) => {
      onChange(category.id);
      setModalVisible(false);
    },
    [onChange]
  );

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => {
      const Icon = getCategoryIcon(item.icon);
      const isSelected = value === item.id;

      return (
        <Pressable
          onPress={() => handleSelect(item)}
          className={`flex-row items-center p-3 rounded-xl mb-2 ${
            isSelected ? "bg-primary-50 border border-primary-200" : "bg-gray-50"
          }`}
          accessibilityLabel={item.name}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: item.colorCode + "20" }}
          >
            <Icon size={18} color={item.colorCode} />
          </View>
          <Text
            className={`flex-1 text-base ${
              isSelected ? "font-semibold text-primary-700" : "text-gray-900"
            }`}
          >
            {item.name}
          </Text>
          {isSelected && (
            <View className="w-5 h-5 rounded-full bg-primary-500 items-center justify-center">
              <Text className="text-white text-xs">&#10003;</Text>
            </View>
          )}
        </Pressable>
      );
    },
    [value, handleSelect]
  );

  const SelectedIcon = selectedCategory
    ? getCategoryIcon(selectedCategory.icon)
    : null;

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      )}

      <Pressable
        onPress={() => setModalVisible(true)}
        className={`flex-row items-center bg-gray-50 border rounded-xl p-3 ${
          error ? "border-error" : "border-gray-200"
        }`}
        accessibilityLabel="Select category"
        accessibilityRole="button"
      >
        {selectedCategory ? (
          <>
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: selectedCategory.colorCode + "20" }}
            >
              {SelectedIcon && (
                <SelectedIcon size={18} color={selectedCategory.colorCode} />
              )}
            </View>
            <Text className="flex-1 text-base text-gray-900">
              {selectedCategory.name}
            </Text>
          </>
        ) : (
          <Text className="flex-1 text-base text-gray-400">{placeholder}</Text>
        )}
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>

      {error && (
        <Text className="text-sm text-error mt-1">{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Select ${type === "EXPENSE" ? "Expense" : "Income"} Category`}
      >
        {isLoading ? (
          <View className="py-8">
            <Text className="text-center text-gray-500">Loading...</Text>
          </View>
        ) : categories.length === 0 ? (
          <View className="py-8">
            <Text className="text-center text-gray-500">
              No categories found
            </Text>
          </View>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            className="max-h-80"
            showsVerticalScrollIndicator={false}
          />
        )}
      </Modal>
    </View>
  );
}

export default CategoryPicker;
