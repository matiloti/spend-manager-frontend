import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { CategoryForm, CategoryFormData } from "@/components/category/CategoryForm";
import { useCreateCategory } from "@/hooks/api/useCategories";
import { CategoryType } from "@/types/models";

export default function CreateCategoryScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type?: CategoryType }>();
  const createMutation = useCreateCategory();

  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      try {
        await createMutation.mutateAsync(data);
        router.back();
      } catch (error: any) {
        const message =
          error.code === "CATEGORY_NAME_EXISTS"
            ? `A ${data.type.toLowerCase()} category with this name already exists.`
            : error.message || "Failed to create category. Please try again.";

        Alert.alert("Error", message);
      }
    },
    [createMutation, router]
  );

  return (
    <Screen scroll backgroundColor="#FFFFFF">
      <Header title="New Category" showBack />

      <CategoryForm
        initialData={{ type: type || "EXPENSE" }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel="Create Category"
      />
    </Screen>
  );
}
