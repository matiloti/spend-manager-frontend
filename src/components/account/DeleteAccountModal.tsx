import React, { useState, useCallback } from "react";
import { View, Text } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AccountWithBalance } from "@/services/accountService";

interface DeleteAccountModalProps {
  visible: boolean;
  account: AccountWithBalance | null;
  onClose: () => void;
  onConfirm: (confirmName?: string) => void;
  isDeleting?: boolean;
}

export function DeleteAccountModal({
  visible,
  account,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteAccountModalProps) {
  const [confirmName, setConfirmName] = useState("");

  const hasTransactions = (account?.transactionCount ?? 0) > 0;
  const nameMatches = confirmName.trim().toLowerCase() === account?.name.toLowerCase();

  const handleConfirm = useCallback(() => {
    if (hasTransactions) {
      onConfirm(confirmName.trim());
    } else {
      onConfirm();
    }
  }, [hasTransactions, confirmName, onConfirm]);

  const handleClose = useCallback(() => {
    setConfirmName("");
    onClose();
  }, [onClose]);

  if (!account) return null;

  return (
    <Modal visible={visible} onClose={handleClose} title="Delete Account">
      <View className="items-center mb-4">
        <View className="p-3 rounded-full bg-expense-light mb-3">
          <AlertTriangle size={32} color="#EF4444" />
        </View>
        <Text className="text-lg font-semibold text-gray-900 text-center">
          Delete "{account.name}"?
        </Text>
      </View>

      {hasTransactions ? (
        <View className="mb-4">
          <View className="bg-expense-light/30 rounded-xl p-4 mb-4">
            <Text className="text-expense-dark text-center font-medium">
              This account has {account.transactionCount} transaction
              {(account.transactionCount ?? 0) > 1 ? "s" : ""} that will also be
              deleted.
            </Text>
          </View>
          <Text className="text-gray-600 text-center mb-4">
            Type "{account.name}" to confirm deletion:
          </Text>
          <Input
            value={confirmName}
            onChangeText={setConfirmName}
            placeholder={account.name}
            autoCapitalize="none"
            autoCorrect={false}
            testID="delete-confirm-input"
          />
        </View>
      ) : (
        <Text className="text-gray-600 text-center mb-4">
          This action cannot be undone.
        </Text>
      )}

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button variant="outline" onPress={handleClose} fullWidth>
            Cancel
          </Button>
        </View>
        <View className="flex-1">
          <Button
            variant="danger"
            onPress={handleConfirm}
            disabled={hasTransactions && !nameMatches}
            loading={isDeleting}
            fullWidth
            testID="delete-confirm-button"
          >
            Delete
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteAccountModal;
