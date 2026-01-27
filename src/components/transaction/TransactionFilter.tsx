import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { Filter, X, Calendar, Tag, FolderOpen, Check } from "lucide-react-native";
import { TransactionType, Category, Tag as TagModel } from "@/types/models";
import { TypeToggle } from "@/components/category/TypeToggle";
import { DatePicker } from "@/components/forms/DatePicker";
import { Button } from "@/components/ui/Button";
import { useCategoriesByType } from "@/hooks/api/useCategories";
import { useTags } from "@/hooks/api/useTags";
import { getCategoryIcon } from "@/constants/icons";
import { formatDate } from "@/utils/formatters";

export interface TransactionFilters {
  type?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  tagIds?: string[];
}

interface TransactionFilterProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  testID?: string;
}

export function TransactionFilter({
  filters,
  onFiltersChange,
  testID,
}: TransactionFilterProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.startDate || filters.endDate) count++;
    if (filters.categoryId) count++;
    if (filters.tagIds && filters.tagIds.length > 0) count++;
    return count;
  }, [filters]);

  const { data: expenseCategories } = useCategoriesByType("EXPENSE");
  const { data: incomeCategories } = useCategoriesByType("INCOME");
  const { data: tagsData } = useTags();

  const categories = useMemo(() => {
    if (localFilters.type === "EXPENSE") {
      return expenseCategories?.content || [];
    }
    if (localFilters.type === "INCOME") {
      return incomeCategories?.content || [];
    }
    return [
      ...(expenseCategories?.content || []),
      ...(incomeCategories?.content || []),
    ];
  }, [localFilters.type, expenseCategories, incomeCategories]);

  const tags = tagsData?.content || [];

  const openModal = useCallback(() => {
    setLocalFilters(filters);
    setIsModalVisible(true);
  }, [filters]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleApply = useCallback(() => {
    onFiltersChange(localFilters);
    closeModal();
  }, [localFilters, onFiltersChange, closeModal]);

  const handleReset = useCallback(() => {
    setLocalFilters({});
    onFiltersChange({});
    closeModal();
  }, [onFiltersChange, closeModal]);

  const handleTypeChange = useCallback((type: TransactionType | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      type,
      categoryId: undefined, // Clear category when type changes
    }));
  }, []);

  const handleCategorySelect = useCallback((categoryId: string | undefined) => {
    setLocalFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
    }));
  }, []);

  const handleTagToggle = useCallback((tagId: string) => {
    setLocalFilters((prev) => {
      const currentTags = prev.tagIds || [];
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter((id) => id !== tagId)
        : [...currentTags, tagId];
      return {
        ...prev,
        tagIds: newTags.length > 0 ? newTags : undefined,
      };
    });
  }, []);

  const renderCategoryItem = useCallback(
    (category: Category) => {
      const Icon = getCategoryIcon(category.icon);
      const isSelected = localFilters.categoryId === category.id;

      return (
        <Pressable
          key={category.id}
          onPress={() => handleCategorySelect(category.id)}
          className={`
            flex-row items-center p-3 rounded-xl mr-2 mb-2
            ${isSelected ? "bg-primary-50 border border-primary-200" : "bg-gray-50 active:bg-gray-100"}
          `}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={category.name}
        >
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: category.colorCode + "20" }}
          >
            <Icon size={16} color={category.colorCode} />
          </View>
          <Text
            className={`text-sm ${
              isSelected ? "font-semibold text-primary-700" : "text-gray-900"
            }`}
          >
            {category.name}
          </Text>
        </Pressable>
      );
    },
    [localFilters.categoryId, handleCategorySelect]
  );

  const renderTagItem = useCallback(
    (tag: TagModel) => {
      const isSelected = localFilters.tagIds?.includes(tag.id);

      return (
        <Pressable
          key={tag.id}
          onPress={() => handleTagToggle(tag.id)}
          className={`
            flex-row items-center px-3 py-2 rounded-full mr-2 mb-2
            ${isSelected ? "bg-primary" : "bg-gray-100 active:bg-gray-200"}
          `}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={tag.name}
        >
          <Text
            className={`text-sm ${
              isSelected ? "font-medium text-white" : "text-gray-700"
            }`}
          >
            {tag.name}
          </Text>
        </Pressable>
      );
    },
    [localFilters.tagIds, handleTagToggle]
  );

  return (
    <>
      {/* Filter Button */}
      <Pressable
        onPress={openModal}
        className="flex-row items-center px-4 py-2 rounded-xl bg-gray-100 active:bg-gray-200"
        accessibilityRole="button"
        accessibilityLabel={`Filter transactions${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
        testID={testID}
      >
        <Filter size={18} color="#374151" />
        <Text className="ml-2 text-sm font-medium text-gray-700">Filter</Text>
        {activeFilterCount > 0 && (
          <View className="ml-2 bg-primary rounded-full w-5 h-5 items-center justify-center">
            <Text className="text-xs font-bold text-white">
              {activeFilterCount}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Filter Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <Pressable
              onPress={closeModal}
              className="p-2 -ml-2 rounded-full active:bg-gray-100"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900">
              Filter Transactions
            </Text>
            <Pressable
              onPress={handleReset}
              className="p-2 -mr-2"
              accessibilityRole="button"
              accessibilityLabel="Reset filters"
            >
              <Text className="text-base text-primary font-medium">Reset</Text>
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Type Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Transaction Type
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handleTypeChange(undefined)}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    !localFilters.type ? "bg-primary" : "bg-gray-100"
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: !localFilters.type }}
                >
                  <Text
                    className={`font-semibold ${
                      !localFilters.type ? "text-white" : "text-gray-700"
                    }`}
                  >
                    All
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleTypeChange("EXPENSE")}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    localFilters.type === "EXPENSE" ? "bg-expense" : "bg-gray-100"
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: localFilters.type === "EXPENSE" }}
                >
                  <Text
                    className={`font-semibold ${
                      localFilters.type === "EXPENSE" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    Expense
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleTypeChange("INCOME")}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    localFilters.type === "INCOME" ? "bg-income" : "bg-gray-100"
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: localFilters.type === "INCOME" }}
                >
                  <Text
                    className={`font-semibold ${
                      localFilters.type === "INCOME" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    Income
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Date Range Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Date Range
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <DatePicker
                    value={localFilters.startDate || new Date()}
                    onChange={(date) =>
                      setLocalFilters((prev) => ({ ...prev, startDate: date }))
                    }
                    label="From"
                    maxDate={localFilters.endDate}
                    testID="filter-start-date"
                  />
                </View>
                <View className="flex-1">
                  <DatePicker
                    value={localFilters.endDate || new Date()}
                    onChange={(date) =>
                      setLocalFilters((prev) => ({ ...prev, endDate: date }))
                    }
                    label="To"
                    minDate={localFilters.startDate}
                    testID="filter-end-date"
                  />
                </View>
              </View>
              {(localFilters.startDate || localFilters.endDate) && (
                <Pressable
                  onPress={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      startDate: undefined,
                      endDate: undefined,
                    }))
                  }
                  className="mt-2"
                  accessibilityRole="button"
                  accessibilityLabel="Clear date filter"
                >
                  <Text className="text-sm text-primary">Clear dates</Text>
                </Pressable>
              )}
            </View>

            {/* Category Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Category
              </Text>
              <View className="flex-row flex-wrap">
                {categories.map(renderCategoryItem)}
              </View>
              {categories.length === 0 && (
                <Text className="text-gray-500">No categories available</Text>
              )}
            </View>

            {/* Tags Filter */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {tags.map(renderTagItem)}
              </View>
              {tags.length === 0 && (
                <Text className="text-gray-500">No tags available</Text>
              )}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
            <Button onPress={handleApply} fullWidth size="lg">
              Apply Filters
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default TransactionFilter;
