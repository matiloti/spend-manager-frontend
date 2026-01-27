import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { AccountForm, AccountFormData } from "@/components/account/AccountForm";
import { useCreateAccount } from "@/hooks/api/useAccounts";

export default function CreateAccountScreen() {
  const router = useRouter();
  const createMutation = useCreateAccount();

  const handleSubmit = useCallback(
    async (data: AccountFormData) => {
      try {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description,
          currency: data.currency,
          colorCode: data.colorCode,
        });
        router.back();
      } catch (error: any) {
        const message =
          error.code === "ACCOUNT_NAME_EXISTS"
            ? "An account with this name already exists."
            : error.message || "Failed to create account. Please try again.";
        Alert.alert("Error", message);
      }
    },
    [createMutation, router]
  );

  return (
    <Screen scroll>
      <Header title="Create Account" showBack />
      <AccountForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel="Create Account"
      />
    </Screen>
  );
}
