import React, { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Tag as TagIcon, Edit3, Trash2 } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DeleteTagModal } from "@/components/tag/DeleteTagModal";
import { useTag, useDeleteTag } from "@/hooks/api/useTags";
import { formatCurrency } from "@/utils/formatters";

export default function TagDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: tag, isLoading, isError, refetch } = useTag(id || "");
  const deleteMutation = useDeleteTag();

  const handleEdit = useCallback(() => {
    router.push(`/tags/${id}/edit`);
  }, [router, id]);

  const handleDeleteConfirm = useCallback(
    async (action: "remove" | "reassign", replacementTagId?: string) => {
      if (!tag) return;

      try {
        await deleteMutation.mutateAsync({
          id: tag.id,
          params: {
            action,
            replacementTagId,
          },
        });
        setShowDeleteModal(false);
        router.back();
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to delete tag. Please try again."
        );
      }
    },
    [tag, deleteMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Tag Details" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !tag) {
    return (
      <Screen>
        <Header title="Tag Details" showBack />
        <ErrorState message="Failed to load tag details." onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header
        title="Tag Details"
        showBack
        rightElement={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleEdit}
            leftIcon={<Edit3 size={18} color="#3B82F6" />}
          >
            Edit
          </Button>
        }
      />

      {/* Tag header */}
      <View className="items-center mb-6">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: tag.colorCode + "20" }}
        >
          <TagIcon size={36} color={tag.colorCode} />
        </View>
        <Text className="text-2xl font-bold text-gray-900">{tag.name}</Text>
        {tag.transactionCount !== undefined && (
          <Text className="text-base text-gray-500 mt-1">
            {tag.transactionCount === 0
              ? "No transactions"
              : `${tag.transactionCount} transaction${
                  tag.transactionCount !== 1 ? "s" : ""
                }`}
          </Text>
        )}
      </View>

      {/* Statistics */}
      {(tag.totalExpenses !== undefined || tag.totalIncome !== undefined) && (
        <Card className="mb-4">
          <Text className="text-sm font-medium text-gray-500 mb-3">
            Statistics
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Total Income</Text>
              <Text className="text-lg font-semibold text-income">
                {formatCurrency(tag.totalIncome || 0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Total Expenses</Text>
              <Text className="text-lg font-semibold text-expense">
                {formatCurrency(tag.totalExpenses || 0)}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* Info card */}
      <Card className="mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: tag.colorCode }}
          />
          <Text className="text-sm text-gray-500">Color</Text>
          <Text className="ml-auto text-sm text-gray-900">{tag.colorCode}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500">Created</Text>
          <Text className="ml-auto text-sm text-gray-900">
            {new Date(tag.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card>

      {/* Delete button */}
      <View className="mt-4">
        <Button
          variant="danger"
          onPress={() => setShowDeleteModal(true)}
          leftIcon={<Trash2 size={18} color="#FFFFFF" />}
          fullWidth
        >
          Delete Tag
        </Button>
      </View>

      <DeleteTagModal
        visible={showDeleteModal}
        tag={tag}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
