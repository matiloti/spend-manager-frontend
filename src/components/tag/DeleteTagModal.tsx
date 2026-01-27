import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { AlertTriangle, Tag as TagIcon } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/types/models";
import { useTags } from "@/hooks/api/useTags";

type DeleteAction = "remove" | "reassign";

interface DeleteTagModalProps {
  visible: boolean;
  tag: Tag | null;
  onClose: () => void;
  onConfirm: (action: DeleteAction, replacementTagId?: string) => void;
  isDeleting?: boolean;
}

export function DeleteTagModal({
  visible,
  tag,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteTagModalProps) {
  const [selectedAction, setSelectedAction] = useState<DeleteAction>("remove");
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(
    null
  );

  const { data: tagsData } = useTags(undefined, {
    enabled: visible && !!tag,
  });

  // Filter out the tag being deleted
  const availableReplacements = useMemo(
    () => (tagsData?.content || []).filter((t) => t.id !== tag?.id),
    [tagsData, tag]
  );

  const hasTransactions =
    tag?.transactionCount !== undefined && tag.transactionCount > 0;
  const needsReplacementSelection =
    hasTransactions && selectedAction === "reassign";

  const handleConfirm = useCallback(() => {
    if (needsReplacementSelection && !selectedReplacement) {
      return; // Button should be disabled
    }
    onConfirm(selectedAction, selectedReplacement || undefined);
  }, [selectedAction, needsReplacementSelection, selectedReplacement, onConfirm]);

  const handleClose = useCallback(() => {
    setSelectedAction("remove");
    setSelectedReplacement(null);
    onClose();
  }, [onClose]);

  const renderReplacementItem = useCallback(
    ({ item }: { item: Tag }) => {
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
            <TagIcon size={16} color={item.colorCode} />
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

  if (!tag) return null;

  return (
    <Modal visible={visible} onClose={handleClose} title="Delete Tag">
      <View className="gap-4">
        {/* Warning icon and message */}
        <View className="items-center py-2">
          <View className="w-12 h-12 rounded-full bg-error-light items-center justify-center mb-3">
            <AlertTriangle size={24} color="#DC2626" />
          </View>
          <Text className="text-center text-gray-900 font-semibold text-lg">
            Delete "{tag.name}"?
          </Text>
        </View>

        {/* Transaction count info */}
        {hasTransactions ? (
          <View className="bg-warning-light rounded-xl p-4">
            <Text className="text-warning-dark text-center">
              This tag is used on{" "}
              <Text className="font-bold">{tag.transactionCount}</Text>{" "}
              transaction{tag.transactionCount !== 1 ? "s" : ""}.
            </Text>
          </View>
        ) : (
          <Text className="text-center text-gray-600">
            This tag has no transactions and can be deleted safely.
          </Text>
        )}

        {/* Action selection for tags with transactions */}
        {hasTransactions && (
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Choose an action:
            </Text>

            {/* Remove option */}
            <Pressable
              onPress={() => {
                setSelectedAction("remove");
                setSelectedReplacement(null);
              }}
              className={`flex-row items-center p-3 rounded-xl ${
                selectedAction === "remove"
                  ? "bg-primary-50 border border-primary-200"
                  : "bg-gray-50 active:bg-gray-100"
              }`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedAction === "remove" }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  selectedAction === "remove"
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {selectedAction === "remove" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-medium ${
                    selectedAction === "remove"
                      ? "text-primary-700"
                      : "text-gray-900"
                  }`}
                >
                  Remove tag from all transactions
                </Text>
                <Text className="text-xs text-gray-500">
                  Transactions will keep their other tags
                </Text>
              </View>
            </Pressable>

            {/* Reassign option */}
            <Pressable
              onPress={() => setSelectedAction("reassign")}
              className={`flex-row items-center p-3 rounded-xl ${
                selectedAction === "reassign"
                  ? "bg-primary-50 border border-primary-200"
                  : "bg-gray-50 active:bg-gray-100"
              }`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedAction === "reassign" }}
            >
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                  selectedAction === "reassign"
                    ? "border-primary bg-primary"
                    : "border-gray-300"
                }`}
              >
                {selectedAction === "reassign" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <View className="flex-1">
                <Text
                  className={`text-sm font-medium ${
                    selectedAction === "reassign"
                      ? "text-primary-700"
                      : "text-gray-900"
                  }`}
                >
                  Replace with another tag
                </Text>
                <Text className="text-xs text-gray-500">
                  All transactions will get the new tag
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Replacement tag selection */}
        {needsReplacementSelection && (
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Select replacement tag:
            </Text>
            {availableReplacements.length === 0 ? (
              <Text className="text-center text-gray-500 py-4">
                No other tags available
              </Text>
            ) : (
              <FlatList
                data={availableReplacements}
                renderItem={renderReplacementItem}
                keyExtractor={(item) => item.id}
                className="max-h-40"
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
              disabled={needsReplacementSelection && !selectedReplacement}
              fullWidth
              testID="delete-tag-confirm-button"
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteTagModal;
