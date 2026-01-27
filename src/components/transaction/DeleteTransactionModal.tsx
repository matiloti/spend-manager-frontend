import React from "react";
import { View, Text } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types/models";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface DeleteTransactionModalProps {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteTransactionModal({
  visible,
  transaction,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteTransactionModalProps) {
  if (!transaction) return null;

  const formattedAmount = formatCurrency(transaction.amount);
  const amountDisplay =
    transaction.type === "EXPENSE" ? `-${formattedAmount}` : `+${formattedAmount}`;

  return (
    <Modal visible={visible} onClose={onClose} title="Delete Transaction">
      <View className="gap-4">
        {/* Warning icon and message */}
        <View className="items-center py-2">
          <View className="w-12 h-12 rounded-full bg-error-light items-center justify-center mb-3">
            <AlertTriangle size={24} color="#DC2626" />
          </View>
          <Text className="text-center text-gray-900 font-semibold text-lg">
            Delete this transaction?
          </Text>
        </View>

        {/* Transaction summary */}
        <View className="bg-gray-50 rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">Amount</Text>
            <Text
              className={`text-base font-bold ${
                transaction.type === "EXPENSE" ? "text-expense" : "text-income"
              }`}
            >
              {amountDisplay}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">Category</Text>
            <Text className="text-base text-gray-900">
              {transaction.category?.name || "Unknown"}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm text-gray-500">Date</Text>
            <Text className="text-base text-gray-900">
              {formatDate(transaction.date)}
            </Text>
          </View>
          {transaction.description && (
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-500">Description</Text>
              <Text
                className="text-base text-gray-900 flex-1 text-right ml-4"
                numberOfLines={1}
              >
                {transaction.description}
              </Text>
            </View>
          )}
        </View>

        <Text className="text-center text-gray-600 text-sm">
          This action cannot be undone.
        </Text>

        {/* Action buttons */}
        <View className="flex-row gap-3 mt-2">
          <View className="flex-1">
            <Button variant="secondary" onPress={onClose} fullWidth>
              Cancel
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="danger"
              onPress={onConfirm}
              loading={isDeleting}
              fullWidth
              testID="delete-transaction-confirm-button"
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteTransactionModal;
