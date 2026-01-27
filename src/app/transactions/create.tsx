import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { TransactionForm } from "@/components/transaction/TransactionForm";
import { useCreateTransaction } from "@/hooks/api/useTransactions";
import { useAccountStore } from "@/stores/accountStore";
import { TransactionType } from "@/types/models";
import { EmptyState } from "@/components/layout/EmptyState";
import { Receipt } from "lucide-react-native";

export default function CreateTransactionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const { activeAccountId } = useAccountStore();
  const createMutation = useCreateTransaction();

  const defaultType: TransactionType =
    params.type === "INCOME" ? "INCOME" : "EXPENSE";

  const handleSubmit = useCallback(
    async (data: {
      type: TransactionType;
      categoryId: string;
      amount: number;
      date: string;
      description?: string;
      tagIds?: string[];
    }) => {
      if (!activeAccountId) {
        Alert.alert("Error", "Please select an account first.");
        return;
      }

      try {
        await createMutation.mutateAsync({
          accountId: activeAccountId,
          ...data,
        });
        router.back();
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to create transaction. Please try again."
        );
      }
    },
    [activeAccountId, createMutation, router]
  );

  if (!activeAccountId) {
    return (
      <Screen backgroundColor="#FFFFFF">
        <Header title="New Transaction" showBack />
        <EmptyState
          icon={<Receipt size={48} color="#9CA3AF" />}
          title="No account selected"
          description="Please select an account to create a transaction."
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false} backgroundColor="#FFFFFF">
      <Header title="New Transaction" showBack />
      <TransactionForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        submitLabel="Save Transaction"
        defaultType={defaultType}
      />
    </Screen>
  );
}
