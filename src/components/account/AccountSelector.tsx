import React, { useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { ChevronDown, Check, Plus } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/layout/LoadingState";
import { useAccounts, useActivateAccount } from "@/hooks/api/useAccounts";
import { AccountWithBalance } from "@/services/accountService";
import { formatCurrency } from "@/utils/formatters";

interface AccountSelectorProps {
  activeAccount?: AccountWithBalance | null;
  onCreateAccount?: () => void;
}

export function AccountSelector({
  activeAccount,
  onCreateAccount,
}: AccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: accountsData, isLoading } = useAccounts({ size: 100 });
  const activateMutation = useActivateAccount();

  const handleSelectAccount = useCallback(
    async (account: AccountWithBalance) => {
      if (account.id !== activeAccount?.id) {
        await activateMutation.mutateAsync(account.id);
      }
      setIsOpen(false);
    },
    [activeAccount?.id, activateMutation]
  );

  const handleCreateAccount = useCallback(() => {
    setIsOpen(false);
    onCreateAccount?.();
  }, [onCreateAccount]);

  const renderAccountItem = useCallback(
    ({ item }: { item: AccountWithBalance }) => {
      const isSelected = item.id === activeAccount?.id;
      const netBalance = item.balance?.netBalance ?? 0;

      return (
        <Pressable
          onPress={() => handleSelectAccount(item)}
          style={[styles.accountItem, isSelected && styles.accountItemSelected]}
          className={`flex-row items-center p-4 ${
            isSelected ? "bg-primary-50" : "active:bg-gray-50"
          }`}
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
        >
          <View
            style={[styles.accountIconOuter, { backgroundColor: item.colorCode + "20" }]}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
          >
            <View
              style={[styles.accountIconInner, { backgroundColor: item.colorCode }]}
              className="w-5 h-5 rounded-full"
            />
          </View>
          <View style={styles.accountInfo} className="flex-1">
            <Text style={styles.accountName} className="text-base font-medium text-gray-900">
              {item.name}
            </Text>
            <Text style={styles.accountBalance} className="text-sm text-gray-500">
              {formatCurrency(netBalance, item.currency)}
            </Text>
          </View>
          {isSelected && <Check size={20} color="#3B82F6" />}
        </Pressable>
      );
    },
    [activeAccount?.id, handleSelectAccount]
  );

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={styles.selectorButton}
        className="flex-row items-center gap-1 py-1 px-2 rounded-lg active:bg-gray-100"
        accessibilityLabel="Select account"
        accessibilityRole="button"
      >
        {activeAccount && (
          <View
            style={[styles.selectorIcon, { backgroundColor: activeAccount.colorCode }]}
            className="w-6 h-6 rounded-full mr-1"
          />
        )}
        <Text style={styles.selectorText} className="text-lg font-semibold text-gray-900" numberOfLines={1}>
          {activeAccount?.name || "Select Account"}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>

      <Modal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title="Select Account"
      >
        {isLoading ? (
          <LoadingState message="Loading accounts..." />
        ) : (
          <View>
            <FlatList
              data={accountsData?.content || []}
              renderItem={renderAccountItem}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => (
                <View style={styles.separator} className="h-px bg-gray-100" />
              )}
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            />
            {onCreateAccount && (
              <View style={styles.createAccountContainer} className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onPress={handleCreateAccount}
                  leftIcon={<Plus size={18} color="#374151" />}
                  fullWidth
                >
                  Add New Account
                </Button>
              </View>
            )}
          </View>
        )}
      </Modal>
    </>
  );
}

// Fallback styles to ensure component works even if NativeWind fails
const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  selectorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  accountItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  accountIconOuter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  accountIconInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  accountBalance: {
    fontSize: 14,
    color: "#6B7280",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  createAccountContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
});

export default AccountSelector;
