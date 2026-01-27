import React, { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Edit3, Trash2, CheckCircle } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AccountBalance } from "@/components/account/AccountBalance";
import { DeleteAccountModal } from "@/components/account/DeleteAccountModal";
import {
  useAccount,
  useDeleteAccount,
  useActivateAccount,
} from "@/hooks/api/useAccounts";
import { formatDate } from "@/utils/formatters";

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: account, isLoading, isError, refetch } = useAccount(id!);
  const deleteMutation = useDeleteAccount();
  const activateMutation = useActivateAccount();

  const handleEdit = useCallback(() => {
    router.push(`/accounts/${id}/edit`);
  }, [router, id]);

  const handleActivate = useCallback(async () => {
    if (!account || account.isActive) return;

    try {
      await activateMutation.mutateAsync(account.id);
      Alert.alert("Success", `${account.name} is now your active account.`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to set account as active.");
    }
  }, [account, activateMutation]);

  const handleDeleteConfirm = useCallback(
    async (confirmName?: string) => {
      if (!account) return;

      try {
        await deleteMutation.mutateAsync({
          id: account.id,
          confirmName,
        });
        setShowDeleteModal(false);
        router.back();
      } catch (error: any) {
        const message =
          error.code === "LAST_ACCOUNT"
            ? "You cannot delete your last account."
            : error.message || "Failed to delete account.";
        Alert.alert("Error", message);
      }
    },
    [account, deleteMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Account Details" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !account) {
    return (
      <Screen>
        <Header title="Account Details" showBack />
        <ErrorState
          title="Account not found"
          message="This account may have been deleted."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Header title="Account Details" showBack />

      <View className="gap-4 pt-4">
        {/* Account Header */}
        <Card>
          <View className="flex-row items-center gap-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: account.colorCode + "20" }}
            >
              <View
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: account.colorCode }}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-xl font-bold text-gray-900">
                  {account.name}
                </Text>
                {account.isActive && (
                  <Badge variant="primary">Active</Badge>
                )}
              </View>
              {account.description && (
                <Text className="text-gray-500 mt-1">
                  {account.description}
                </Text>
              )}
              <Text className="text-sm text-gray-400 mt-2">
                Currency: {account.currency}
              </Text>
            </View>
          </View>
        </Card>

        {/* Balance */}
        {account.balance && (
          <AccountBalance balance={account.balance} currency={account.currency} />
        )}

        {/* Metadata */}
        <Card>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Created</Text>
              <Text className="text-gray-900 font-medium">
                {formatDate(account.createdAt)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Last updated</Text>
              <Text className="text-gray-900 font-medium">
                {formatDate(account.updatedAt)}
              </Text>
            </View>
            {account.transactionCount !== undefined && (
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Transactions</Text>
                <Text className="text-gray-900 font-medium">
                  {account.transactionCount}
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Actions */}
        <View className="gap-3">
          {!account.isActive && (
            <Button
              variant="primary"
              onPress={handleActivate}
              loading={activateMutation.isPending}
              leftIcon={<CheckCircle size={18} color="#FFFFFF" />}
              fullWidth
            >
              Set as Active Account
            </Button>
          )}

          <Button
            variant="outline"
            onPress={handleEdit}
            leftIcon={<Edit3 size={18} color="#374151" />}
            fullWidth
          >
            Edit Account
          </Button>

          <Button
            variant="ghost"
            onPress={() => setShowDeleteModal(true)}
            leftIcon={<Trash2 size={18} color="#EF4444" />}
            fullWidth
          >
            <Text className="text-expense font-semibold">Delete Account</Text>
          </Button>
        </View>
      </View>

      <DeleteAccountModal
        visible={showDeleteModal}
        account={account}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
