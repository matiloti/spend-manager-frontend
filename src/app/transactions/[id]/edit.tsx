import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import {
  useTransaction,
  useUpdateTransaction,
} from "@/hooks/api/useTransactions";
import { TransactionType } from "@/types/models";

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: transaction,
    isLoading,
    isError,
    refetch,
  } = useTransaction(id || "");
  const updateMutation = useUpdateTransaction();

  const handleSubmit = useCallback(
    async (data: {
      type: TransactionType;
      categoryId: string;
      amount: number;
      date: string;
      description?: string;
      tagIds?: string[];
    }) => {
      if (!id || !transaction) return;

      try {
        await updateMutation.mutateAsync({
          id,
          data: {
            accountId: transaction.accountId,
            ...data,
          },
        });
        router.back();
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to update transaction. Please try again."
        );
      }
    },
    [id, transaction, updateMutation, router]
  );

  if (isLoading) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <Header title="Edit Transaction" showBack />
        <LoadingState message="Loading transaction..." />
      </Screen>
    );
  }

  if (isError || !transaction) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <Header title="Edit Transaction" showBack />
        <ErrorState
          message="Failed to load transaction."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false} backgroundColor="#FFFFFF">
      <Header title="Edit Transaction" showBack />
      <TransactionForm
        initialData={transaction}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </Screen>
  );
}
