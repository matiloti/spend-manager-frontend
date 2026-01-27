import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import {
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Calendar,
  Filter,
} from "lucide-react-native";
import { Category, Tag, TransactionType } from "@/types/models";
import { useCategories } from "@/hooks/api/useCategories";
import { useTags } from "@/hooks/api/useTags";
import { getCategoryIcon } from "@/constants/icons";
import { DatePicker } from "@/components/forms/DatePicker";
import { formatDate, formatDateISO } from "@/utils/formatters";

export interface SearchFilters {
  categoryIds: string[];
  tagIds: string[];
  transactionType: TransactionType | null;
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearAll?: () => void;
  testID?: string;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  onClearAll,
  testID,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const { data: categoriesData } = useCategories({ size: 100 });
  const { data: tagsData } = useTags({ size: 100 });

  const categories = categoriesData?.content || [];
  const tags = tagsData?.content || [];

  const selectedCategories = useMemo(
    () => categories.filter((c) => filters.categoryIds.includes(c.id)),
    [categories, filters.categoryIds]
  );

  const selectedTags = useMemo(
    () => tags.filter((t) => filters.tagIds.includes(t.id)),
    [tags, filters.tagIds]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categoryIds.length > 0) count++;
    if (filters.tagIds.length > 0) count++;
    if (filters.transactionType) count++;
    if (filters.startDate || filters.endDate) count++;
    return count;
  }, [filters]);

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      const newCategoryIds = filters.categoryIds.includes(categoryId)
        ? filters.categoryIds.filter((id) => id !== categoryId)
        : [...filters.categoryIds, categoryId];
      onFiltersChange({ ...filters, categoryIds: newCategoryIds });
    },
    [filters, onFiltersChange]
  );

  const handleToggleTag = useCallback(
    (tagId: string) => {
      const newTagIds = filters.tagIds.includes(tagId)
        ? filters.tagIds.filter((id) => id !== tagId)
        : [...filters.tagIds, tagId];
      onFiltersChange({ ...filters, tagIds: newTagIds });
    },
    [filters, onFiltersChange]
  );

  const handleTypeChange = useCallback(
    (type: TransactionType | null) => {
      onFiltersChange({ ...filters, transactionType: type });
    },
    [filters, onFiltersChange]
  );

  const handleStartDateChange = useCallback(
    (date: Date) => {
      onFiltersChange({ ...filters, startDate: date });
      setShowStartDatePicker(false);
    },
    [filters, onFiltersChange]
  );

  const handleEndDateChange = useCallback(
    (date: Date) => {
      onFiltersChange({ ...filters, endDate: date });
      setShowEndDatePicker(false);
    },
    [filters, onFiltersChange]
  );

  const handleClearDates = useCallback(() => {
    onFiltersChange({ ...filters, startDate: null, endDate: null });
  }, [filters, onFiltersChange]);

  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => {
      const Icon = getCategoryIcon(item.icon);
      const isSelected = filters.categoryIds.includes(item.id);

      return (
        <Pressable
          onPress={() => handleToggleCategory(item.id)}
          className={`flex-row items-center p-3 rounded-xl mb-2 ${
            isSelected ? "bg-primary-50 border border-primary-200" : "bg-gray-50"
          }`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
        >
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: item.colorCode + "20" }}
          >
            <Icon size={16} color={item.colorCode} />
          </View>
          <Text
            className={`flex-1 text-base ${
              isSelected ? "font-semibold text-primary-700" : "text-gray-900"
            }`}
          >
            {item.name}
          </Text>
          {isSelected && (
            <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
              <Check size={12} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      );
    },
    [filters.categoryIds, handleToggleCategory]
  );

  const renderTagItem = useCallback(
    ({ item }: { item: Tag }) => {
      const isSelected = filters.tagIds.includes(item.id);

      return (
        <Pressable
          onPress={() => handleToggleTag(item.id)}
          className={`flex-row items-center p-3 rounded-xl mb-2 ${
            isSelected ? "bg-primary-50 border border-primary-200" : "bg-gray-50"
          }`}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
        >
          <View
            className={`w-6 h-6 rounded-full items-center justify-center mr-3 ${
              isSelected ? "bg-primary" : "border-2 border-gray-300"
            }`}
          >
            {isSelected && <Check size={14} color="#FFFFFF" />}
          </View>
          <Text
            className={`flex-1 text-base ${
              isSelected ? "font-semibold text-primary-700" : "text-gray-900"
            }`}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [filters.tagIds, handleToggleTag]
  );

  return (
    <View testID={testID}>
      {/* Filter Toggle Button */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between py-3"
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? "Hide filters" : "Show filters"}
        testID={testID ? `${testID}-toggle` : undefined}
      >
        <View className="flex-row items-center">
          <Filter size={18} color="#6B7280" />
          <Text className="ml-2 text-base font-medium text-gray-700">
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <View className="ml-2 bg-primary rounded-full px-2 py-0.5">
              <Text className="text-xs text-white font-semibold">
                {activeFilterCount}
              </Text>
            </View>
          )}
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </Pressable>

      {/* Expanded Filter Content */}
      {isExpanded && (
        <View className="pb-4">
          {/* Transaction Type */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </Text>
            <View className="flex-row gap-2">
              {[
                { label: "All", value: null },
                { label: "Expense", value: "EXPENSE" as TransactionType },
                { label: "Income", value: "INCOME" as TransactionType },
              ].map((option) => (
                <Pressable
                  key={option.label}
                  onPress={() => handleTypeChange(option.value)}
                  className={`flex-1 py-2 px-3 rounded-xl items-center ${
                    filters.transactionType === option.value
                      ? "bg-primary"
                      : "bg-gray-100"
                  }`}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: filters.transactionType === option.value,
                  }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      filters.transactionType === option.value
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Date Range */}
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-gray-700">
                Date Range
              </Text>
              {(filters.startDate || filters.endDate) && (
                <Pressable
                  onPress={handleClearDates}
                  className="px-2 py-1"
                  accessibilityLabel="Clear dates"
                  accessibilityRole="button"
                >
                  <Text className="text-sm text-primary">Clear</Text>
                </Pressable>
              )}
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowStartDatePicker(true)}
                className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-3"
                accessibilityRole="button"
                accessibilityLabel="Select start date"
              >
                <Calendar size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-700">
                  {filters.startDate
                    ? formatDate(filters.startDate.toISOString())
                    : "Start date"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowEndDatePicker(true)}
                className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 py-3"
                accessibilityRole="button"
                accessibilityLabel="Select end date"
              >
                <Calendar size={16} color="#6B7280" />
                <Text className="ml-2 text-sm text-gray-700">
                  {filters.endDate
                    ? formatDate(filters.endDate.toISOString())
                    : "End date"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </Text>
            <Pressable
              onPress={() => setShowCategoryPicker(true)}
              className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3"
              accessibilityRole="button"
              accessibilityLabel="Select categories"
            >
              {selectedCategories.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-1"
                >
                  <View className="flex-row gap-2">
                    {selectedCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon);
                      return (
                        <View
                          key={cat.id}
                          className="flex-row items-center bg-white rounded-full px-2 py-1"
                        >
                          <Icon size={14} color={cat.colorCode} />
                          <Text className="ml-1 text-sm text-gray-700">
                            {cat.name}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              ) : (
                <Text className="flex-1 text-sm text-gray-500">
                  All categories
                </Text>
              )}
              <ChevronDown size={18} color="#6B7280" />
            </Pressable>
          </View>

          {/* Tag Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Tags</Text>
            <Pressable
              onPress={() => setShowTagPicker(true)}
              className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3"
              accessibilityRole="button"
              accessibilityLabel="Select tags"
            >
              {selectedTags.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="flex-1"
                >
                  <View className="flex-row gap-2">
                    {selectedTags.map((tag) => (
                      <View
                        key={tag.id}
                        className="bg-primary-50 rounded-full px-2 py-1"
                      >
                        <Text className="text-sm text-primary-700">
                          {tag.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text className="flex-1 text-sm text-gray-500">All tags</Text>
              )}
              <ChevronDown size={18} color="#6B7280" />
            </Pressable>
          </View>

          {/* Clear All Button */}
          {activeFilterCount > 0 && onClearAll && (
            <Pressable
              onPress={onClearAll}
              className="items-center py-2"
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
            >
              <Text className="text-base font-medium text-expense">
                Clear all filters
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCategoryPicker(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowCategoryPicker(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Select Categories
              </Text>
              <Pressable
                onPress={() => setShowCategoryPicker(false)}
                className="p-1 rounded-full active:bg-gray-100"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-gray-500">No categories available</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
            <View className="px-4 pb-4">
              <Pressable
                onPress={() => setShowCategoryPicker(false)}
                className="py-3 items-center rounded-xl bg-primary active:bg-primary-dark"
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text className="text-base font-semibold text-white">
                  Done ({filters.categoryIds.length} selected)
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Tag Picker Modal */}
      <Modal
        visible={showTagPicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowTagPicker(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowTagPicker(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Select Tags
              </Text>
              <Pressable
                onPress={() => setShowTagPicker(false)}
                className="p-1 rounded-full active:bg-gray-100"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>
            <FlatList
              data={tags}
              renderItem={renderTagItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-gray-500">No tags available</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />
            <View className="px-4 pb-4">
              <Pressable
                onPress={() => setShowTagPicker(false)}
                className="py-3 items-center rounded-xl bg-primary active:bg-primary-dark"
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text className="text-base font-semibold text-white">
                  Done ({filters.tagIds.length} selected)
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Start Date Picker Modal */}
      <Modal
        visible={showStartDatePicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowStartDatePicker(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowStartDatePicker(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Start Date
              </Text>
              <Pressable
                onPress={() => setShowStartDatePicker(false)}
                className="p-1 rounded-full active:bg-gray-100"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>
            <View className="p-4">
              <DatePicker
                value={filters.startDate || new Date()}
                onChange={handleStartDateChange}
                label=""
                maxDate={filters.endDate || undefined}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* End Date Picker Modal */}
      <Modal
        visible={showEndDatePicker}
        animationType="fade"
        transparent
        onRequestClose={() => setShowEndDatePicker(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowEndDatePicker(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                End Date
              </Text>
              <Pressable
                onPress={() => setShowEndDatePicker(false)}
                className="p-1 rounded-full active:bg-gray-100"
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color="#6B7280" />
              </Pressable>
            </View>
            <View className="p-4">
              <DatePicker
                value={filters.endDate || new Date()}
                onChange={handleEndDateChange}
                label=""
                minDate={filters.startDate || undefined}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default FilterPanel;
