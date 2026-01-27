import React, { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Edit3, Trash2, TrendingDown, TrendingUp } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DeleteCategoryModal } from "@/components/category/DeleteCategoryModal";
import { useCategory, useDeleteCategory } from "@/hooks/api/useCategories";
import { getCategoryIcon } from "@/constants/icons";
import { formatCurrency, formatDate } from "@/utils/formatters";

export default function CategoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: category, isLoading, isError, refetch } = useCategory(id || "");
  const deleteMutation = useDeleteCategory();

  const handleEdit = useCallback(() => {
    router.push(`/categories/${id}/edit`);
  }, [router, id]);

  const handleDeleteConfirm = useCallback(
    async (replacementCategoryId?: string) => {
      if (!category) return;

      try {
        await deleteMutation.mutateAsync({
          id: category.id,
          replacementCategoryId,
        });
        setShowDeleteModal(false);
        router.back();
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to delete category. Please try again."
        );
      }
    },
    [category, deleteMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Category" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !category) {
    return (
      <Screen>
        <Header title="Category" showBack />
        <ErrorState
          message="Failed to load category details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const Icon = getCategoryIcon(category.icon);
  const TypeIcon = category.type === "EXPENSE" ? TrendingDown : TrendingUp;

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header title="Category Details" showBack />

      {/* Category Header */}
      <Card className="mb-4">
        <View className="items-center py-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: category.colorCode + "20" }}
          >
            <Icon size={36} color={category.colorCode} />
          </View>
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-2xl font-bold text-gray-900">
              {category.name}
            </Text>
            {category.isDefault && (
              <Badge variant="secondary" size="sm">
                Default
              </Badge>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <TypeIcon
              size={16}
              color={category.type === "EXPENSE" ? "#EA580C" : "#16A34A"}
            />
            <Text
              className={`text-sm font-medium ${
                category.type === "EXPENSE" ? "text-expense" : "text-income"
              }`}
            >
              {category.type === "EXPENSE" ? "Expense" : "Income"} Category
            </Text>
          </View>
        </View>
      </Card>

      {/* Statistics */}
      <Card className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900">Statistics</Text>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-gray-50 rounded-xl p-4">
            <Text className="text-sm text-gray-500 mb-1">Transactions</Text>
            <Text className="text-xl font-bold text-gray-900">
              {category.transactionCount ?? 0}
            </Text>
          </View>

          {category.totalAmount !== undefined && (
            <View className="flex-1 bg-gray-50 rounded-xl p-4">
              <Text className="text-sm text-gray-500 mb-1">Total Amount</Text>
              <Text
                className={`text-xl font-bold ${
                  category.type === "EXPENSE" ? "text-expense" : "text-income"
                }`}
              >
                {formatCurrency(category.totalAmount)}
              </Text>
            </View>
          )}
        </View>
      </Card>

      {/* Details */}
      <Card className="mb-4">
        <Text className="text-lg font-semibold text-gray-900 mb-4">Details</Text>

        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Color</Text>
            <View className="flex-row items-center gap-2">
              <View
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: category.colorCode }}
              />
              <Text className="text-gray-900">{category.colorCode}</Text>
            </View>
          </View>

          <View className="h-px bg-gray-100" />

          <View className="flex-row justify-between">
            <Text className="text-gray-500">Created</Text>
            <Text className="text-gray-900">{formatDate(category.createdAt)}</Text>
          </View>

          <View className="h-px bg-gray-100" />

          <View className="flex-row justify-between">
            <Text className="text-gray-500">Last Updated</Text>
            <Text className="text-gray-900">{formatDate(category.updatedAt)}</Text>
          </View>
        </View>
      </Card>

      {/* Actions */}
      <View className="flex-row gap-3 mb-8">
        <View className="flex-1">
          <Button
            variant="secondary"
            onPress={handleEdit}
            leftIcon={<Edit3 size={18} color="#374151" />}
            fullWidth
          >
            Edit
          </Button>
        </View>
        <View className="flex-1">
          <Button
            variant="danger"
            onPress={() => setShowDeleteModal(true)}
            leftIcon={<Trash2 size={18} color="#FFFFFF" />}
            fullWidth
          >
            Delete
          </Button>
        </View>
      </View>

      <DeleteCategoryModal
        visible={showDeleteModal}
        category={category}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
