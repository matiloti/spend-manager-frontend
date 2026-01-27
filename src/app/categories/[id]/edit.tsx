import React, { useCallback } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { CategoryForm, CategoryFormData } from "@/components/category/CategoryForm";
import { Badge } from "@/components/ui/Badge";
import { useCategory, useUpdateCategory } from "@/hooks/api/useCategories";

export default function EditCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: category, isLoading, isError, refetch } = useCategory(id || "");
  const updateMutation = useUpdateCategory();

  const handleSubmit = useCallback(
    async (data: CategoryFormData) => {
      if (!category) return;

      try {
        await updateMutation.mutateAsync({
          id: category.id,
          data: {
            name: data.name,
            icon: data.icon,
            colorCode: data.colorCode,
          },
        });
        router.back();
      } catch (error: any) {
        const message =
          error.code === "CATEGORY_NAME_EXISTS"
            ? `Another ${category.type.toLowerCase()} category with this name already exists.`
            : error.message || "Failed to update category. Please try again.";

        Alert.alert("Error", message);
      }
    },
    [category, updateMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Edit Category" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !category) {
    return (
      <Screen>
        <Header title="Edit Category" showBack />
        <ErrorState
          message="Failed to load category details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor="#FFFFFF">
      <Header title="Edit Category" showBack />

      {/* Type indicator (cannot be changed) */}
      <View className="flex-row items-center gap-2 mb-6">
        <Text className="text-sm text-gray-500">Type:</Text>
        <Badge
          variant={category.type === "EXPENSE" ? "expense" : "income"}
          size="sm"
        >
          {category.type === "EXPENSE" ? "Expense" : "Income"}
        </Badge>
        <Text className="text-xs text-gray-400">(cannot be changed)</Text>
      </View>

      <CategoryForm
        initialData={category}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel="Save Changes"
        isEdit
      />
    </Screen>
  );
}
