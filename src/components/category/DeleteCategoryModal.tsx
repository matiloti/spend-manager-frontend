import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/models";
import { getCategoryIcon } from "@/constants/icons";
import { useCategoriesByType } from "@/hooks/api/useCategories";

interface DeleteCategoryModalProps {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
  onConfirm: (replacementCategoryId?: string) => void;
  isDeleting?: boolean;
}

export function DeleteCategoryModal({
  visible,
  category,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteCategoryModalProps) {
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(
    null
  );

  const { data: categoriesData } = useCategoriesByType(
    category?.type || "EXPENSE",
    {
      enabled: visible && !!category,
    }
  );

  // Filter out the category being deleted
  const availableReplacements = useMemo(
    () =>
      (categoriesData?.content || []).filter((c) => c.id !== category?.id),
    [categoriesData, category]
  );

  const hasTransactions =
    category?.transactionCount !== undefined && category.transactionCount > 0;
  const needsReplacement = hasTransactions;

  const handleConfirm = useCallback(() => {
    if (needsReplacement && !selectedReplacement) {
      return; // Shouldn't happen due to button being disabled
    }
    onConfirm(selectedReplacement || undefined);
  }, [needsReplacement, selectedReplacement, onConfirm]);

  const handleClose = useCallback(() => {
    setSelectedReplacement(null);
    onClose();
  }, [onClose]);

  const renderReplacementItem = useCallback(
    ({ item }: { item: Category }) => {
      const Icon = getCategoryIcon(item.icon);
      const isSelected = selectedReplacement === item.id;

      return (
        <Pressable
          onPress={() => setSelectedReplacement(item.id)}
          className={`flex-row items-center p-3 rounded-xl mb-2 ${
            isSelected
              ? "bg-primary-50 border border-primary-200"
              : "bg-gray-50 active:bg-gray-100"
          }`}
          accessibilityLabel={item.name}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: item.colorCode + "20" }}
          >
            <Icon size={16} color={item.colorCode} />
          </View>
          <Text
            className={`flex-1 text-sm ${
              isSelected ? "font-semibold text-primary-700" : "text-gray-900"
            }`}
          >
            {item.name}
          </Text>
          {isSelected && (
            <View className="w-4 h-4 rounded-full bg-primary-500" />
          )}
        </Pressable>
      );
    },
    [selectedReplacement]
  );

  if (!category) return null;

  return (
    <Modal visible={visible} onClose={handleClose} title="Delete Category">
      <View className="gap-4">
        {/* Warning icon and message */}
        <View className="items-center py-2">
          <View className="w-12 h-12 rounded-full bg-error-light items-center justify-center mb-3">
            <AlertTriangle size={24} color="#DC2626" />
          </View>
          <Text className="text-center text-gray-900 font-semibold text-lg">
            Delete "{category.name}"?
          </Text>
        </View>

        {/* Message based on transaction count */}
        {hasTransactions ? (
          <View className="bg-warning-light rounded-xl p-4">
            <Text className="text-warning-dark text-center">
              This category has{" "}
              <Text className="font-bold">{category.transactionCount}</Text>{" "}
              transaction{category.transactionCount !== 1 ? "s" : ""}. Please
              select a replacement category below.
            </Text>
          </View>
        ) : (
          <Text className="text-center text-gray-600">
            This category has no transactions and can be deleted safely.
          </Text>
        )}

        {/* Replacement category selection */}
        {needsReplacement && (
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Move transactions to:
            </Text>
            {availableReplacements.length === 0 ? (
              <Text className="text-center text-gray-500 py-4">
                No other categories available
              </Text>
            ) : (
              <FlatList
                data={availableReplacements}
                renderItem={renderReplacementItem}
                keyExtractor={(item) => item.id}
                className="max-h-48"
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}

        {/* Action buttons */}
        <View className="flex-row gap-3 mt-2">
          <View className="flex-1">
            <Button variant="secondary" onPress={handleClose} fullWidth>
              Cancel
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="danger"
              onPress={handleConfirm}
              loading={isDeleting}
              disabled={needsReplacement && !selectedReplacement}
              fullWidth
              testID="delete-category-confirm-button"
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteCategoryModal;
