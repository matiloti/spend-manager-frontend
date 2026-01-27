import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { AccountForm, AccountFormData } from "@/components/account/AccountForm";
import { useAccount, useUpdateAccount } from "@/hooks/api/useAccounts";

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: account, isLoading, isError, refetch } = useAccount(id!);
  const updateMutation = useUpdateAccount();

  const handleSubmit = useCallback(
    async (data: AccountFormData) => {
      if (!account) return;

      try {
        await updateMutation.mutateAsync({
          id: account.id,
          data: {
            name: data.name,
            description: data.description,
            colorCode: data.colorCode,
          },
        });
        router.back();
      } catch (error: any) {
        const message =
          error.code === "ACCOUNT_NAME_EXISTS"
            ? "An account with this name already exists."
            : error.message || "Failed to update account. Please try again.";
        Alert.alert("Error", message);
      }
    },
    [account, updateMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Edit Account" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !account) {
    return (
      <Screen>
        <Header title="Edit Account" showBack />
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
      <Header title="Edit Account" showBack />
      <AccountForm
        initialData={account}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </Screen>
  );
}
