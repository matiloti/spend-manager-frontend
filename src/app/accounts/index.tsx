import React, { useCallback, useState } from "react";
import { View, FlatList, RefreshControl, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Wallet } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/layout/EmptyState";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { AccountCard } from "@/components/account/AccountCard";
import { DeleteAccountModal } from "@/components/account/DeleteAccountModal";
import {
  useAccounts,
  useDeleteAccount,
  useActivateAccount,
} from "@/hooks/api/useAccounts";
import { AccountWithBalance } from "@/services/accountService";

export default function AccountListScreen() {
  const router = useRouter();
  const [deleteModalAccount, setDeleteModalAccount] =
    useState<AccountWithBalance | null>(null);

  const {
    data: accountsData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAccounts({ includeBalance: true });

  const deleteMutation = useDeleteAccount();
  const activateMutation = useActivateAccount();

  const handleAccountPress = useCallback(
    (account: AccountWithBalance) => {
      router.push(`/accounts/${account.id}`);
    },
    [router]
  );

  const handleAccountLongPress = useCallback(
    (account: AccountWithBalance) => {
      Alert.alert(account.name, "What would you like to do?", [
        {
          text: "Set as Active",
          onPress: () => activateMutation.mutate(account.id),
        },
        {
          text: "Edit",
          onPress: () => router.push(`/accounts/${account.id}/edit`),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setDeleteModalAccount(account),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [activateMutation, router]
  );

  const handleCreateAccount = useCallback(() => {
    router.push("/accounts/create");
  }, [router]);

  const handleDeleteConfirm = useCallback(
    async (confirmName?: string) => {
      if (!deleteModalAccount) return;

      try {
        await deleteMutation.mutateAsync({
          id: deleteModalAccount.id,
          confirmName,
        });
        setDeleteModalAccount(null);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to delete account. Please try again."
        );
      }
    },
    [deleteModalAccount, deleteMutation]
  );

  const renderAccountItem = useCallback(
    ({ item }: { item: AccountWithBalance }) => (
      <AccountCard
        account={item}
        onPress={() => handleAccountPress(item)}
        onLongPress={() => handleAccountLongPress(item)}
        testID={`account-card-${item.id}`}
      />
    ),
    [handleAccountPress, handleAccountLongPress]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon={<Wallet size={48} color="#9CA3AF" />}
        title="No accounts yet"
        description="Create your first account to start tracking your expenses and income."
        actionLabel="Create Account"
        onAction={handleCreateAccount}
      />
    ),
    [handleCreateAccount]
  );

  const renderSeparator = useCallback(
    () => <View className="h-3" />,
    []
  );

  const renderLoadingSkeleton = () => (
    <View className="gap-3 px-4 pt-4">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Accounts" showBack />
        {renderLoadingSkeleton()}
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <Header title="Accounts" showBack />
        <ErrorState
          message="Failed to load accounts."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const accounts = accountsData?.content || [];

  return (
    <Screen padded={false}>
      <Header
        title="Accounts"
        showBack
        rightElement={
          accounts.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleCreateAccount}
              leftIcon={<Plus size={18} color="#3B82F6" />}
            >
              Add
            </Button>
          ) : null
        }
      />

      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        testID="account-list"
      />

      <DeleteAccountModal
        visible={!!deleteModalAccount}
        account={deleteModalAccount}
        onClose={() => setDeleteModalAccount(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
