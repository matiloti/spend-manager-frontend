import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Tag, Plus, X, Check, Search } from "lucide-react-native";
import { Tag as TagModel } from "@/types/models";
import { useTags, useCreateTag } from "@/hooks/api/useTags";

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  error?: string;
  testID?: string;
}

export function TagSelector({
  selectedTagIds,
  onChange,
  label = "Tags",
  error,
  testID,
}: TagSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const { data: tagsData, isLoading } = useTags();
  const createTagMutation = useCreateTag();

  const tags = tagsData?.content || [];

  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.includes(tag.id)),
    [tags, selectedTagIds]
  );

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [tags, searchQuery]
  );

  const openModal = useCallback(() => {
    setSearchQuery("");
    setIsCreating(false);
    setNewTagName("");
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearchQuery("");
    setIsCreating(false);
    setNewTagName("");
  }, []);

  const toggleTag = useCallback(
    (tagId: string) => {
      if (selectedTagIds.includes(tagId)) {
        onChange(selectedTagIds.filter((id) => id !== tagId));
      } else {
        onChange([...selectedTagIds, tagId]);
      }
    },
    [selectedTagIds, onChange]
  );

  const removeTag = useCallback(
    (tagId: string) => {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    },
    [selectedTagIds, onChange]
  );

  const handleCreateTag = useCallback(async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTagMutation.mutateAsync({
        name: newTagName.trim(),
      });
      onChange([...selectedTagIds, newTag.id]);
      setNewTagName("");
      setIsCreating(false);
    } catch {
      // Error is handled by mutation
    }
  }, [newTagName, createTagMutation, selectedTagIds, onChange]);

  const hasError = !!error;

  const renderTagItem = useCallback(
    ({ item }: { item: TagModel }) => {
      const isSelected = selectedTagIds.includes(item.id);

      return (
        <Pressable
          onPress={() => toggleTag(item.id)}
          className={`
            flex-row items-center p-3 rounded-xl mb-2
            ${isSelected ? "bg-primary-50 border border-primary-200" : "bg-gray-50 active:bg-gray-100"}
          `}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={item.name}
        >
          <View
            className={`
              w-6 h-6 rounded-full items-center justify-center mr-3
              ${isSelected ? "bg-primary" : "border-2 border-gray-300"}
            `}
          >
            {isSelected && <Check size={14} color="#FFFFFF" />}
          </View>
          <Text
            className={`
              flex-1 text-base
              ${isSelected ? "font-semibold text-primary-700" : "text-gray-900"}
            `}
          >
            {item.name}
          </Text>
        </Pressable>
      );
    },
    [selectedTagIds, toggleTag]
  );

  return (
    <View className="w-full" testID={testID}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}

      {/* Selected tags display */}
      <Pressable
        onPress={openModal}
        className={`
          rounded-xl border px-4 py-3 bg-white min-h-[48px]
          ${hasError ? "border-expense bg-expense-light/20" : "border-gray-300"}
        `}
        accessibilityRole="button"
        accessibilityLabel={`Select ${label}`}
        testID={`${testID}-trigger`}
      >
        {selectedTags.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <View
                key={tag.id}
                className="flex-row items-center bg-primary-50 rounded-full px-3 py-1"
              >
                <Text className="text-sm text-primary-700 mr-1">{tag.name}</Text>
                <Pressable
                  onPress={() => removeTag(tag.id)}
                  hitSlop={8}
                  accessibilityLabel={`Remove ${tag.name}`}
                  accessibilityRole="button"
                >
                  <X size={14} color="#3B82F6" />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-row items-center">
            <Tag size={18} color="#9CA3AF" />
            <Text className="ml-2 text-base text-gray-400">
              Add tags (optional)
            </Text>
          </View>
        )}
      </Pressable>

      {error && <Text className="text-sm text-expense mt-1.5">{error}</Text>}

      {/* Tag selection modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={closeModal}
        >
          <Pressable
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden max-h-[80%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Select Tags
              </Text>
              <View className="flex-row items-center gap-2">
                <Pressable
                  onPress={() => setIsCreating(!isCreating)}
                  className="p-2 rounded-full active:bg-gray-100"
                  accessibilityLabel="Create new tag"
                  accessibilityRole="button"
                >
                  <Plus size={22} color="#3B82F6" />
                </Pressable>
                <Pressable
                  onPress={closeModal}
                  className="p-2 rounded-full active:bg-gray-100"
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <X size={22} color="#6B7280" />
                </Pressable>
              </View>
            </View>

            {/* Create new tag */}
            {isCreating && (
              <View className="px-4 pt-4">
                <View className="flex-row items-center gap-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base"
                    value={newTagName}
                    onChangeText={setNewTagName}
                    placeholder="Enter tag name"
                    placeholderTextColor="#9CA3AF"
                    autoFocus
                    returnKeyType="done"
                    onSubmitEditing={handleCreateTag}
                  />
                  <Pressable
                    onPress={handleCreateTag}
                    disabled={!newTagName.trim() || createTagMutation.isPending}
                    className={`
                      p-3 rounded-xl
                      ${newTagName.trim() ? "bg-primary active:bg-primary-dark" : "bg-gray-200"}
                    `}
                    accessibilityRole="button"
                    accessibilityLabel="Create tag"
                  >
                    <Check
                      size={20}
                      color={newTagName.trim() ? "#FFFFFF" : "#9CA3AF"}
                    />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Search input */}
            <View className="px-4 pt-4">
              <View className="flex-row items-center border border-gray-300 rounded-xl px-3">
                <Search size={18} color="#9CA3AF" />
                <TextInput
                  className="flex-1 py-3 px-2 text-base"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search tags"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Tags list */}
            <FlatList
              data={filteredTags}
              renderItem={renderTagItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-gray-500">
                    {isLoading
                      ? "Loading tags..."
                      : searchQuery
                      ? "No tags found"
                      : "No tags yet. Create one!"}
                  </Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
            />

            {/* Done button */}
            <View className="px-4 pb-4">
              <Pressable
                onPress={closeModal}
                className="py-3 items-center rounded-xl bg-primary active:bg-primary-dark"
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text className="text-base font-semibold text-white">
                  Done ({selectedTagIds.length} selected)
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export default TagSelector;
