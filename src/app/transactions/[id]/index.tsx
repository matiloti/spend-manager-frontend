import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Edit3, Trash2, Calendar, Tag, FileText } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { DeleteTransactionModal } from "@/components/transaction/DeleteTransactionModal";
import { useTransaction, useDeleteTransaction } from "@/hooks/api/useTransactions";
import { getCategoryIcon } from "@/constants/icons";
import { formatCurrency, formatDate, formatTime } from "@/utils/formatters";

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: transaction, isLoading, isError, refetch } = useTransaction(id || "");
  const deleteMutation = useDeleteTransaction();

  const handleEdit = useCallback(() => {
    router.push(`/transactions/${id}/edit`);
  }, [router, id]);

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!id) return;

    try {
      await deleteMutation.mutateAsync(id);
      setShowDeleteModal(false);
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to delete transaction. Please try again."
      );
    }
  }, [id, deleteMutation, router]);

  if (isLoading) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Transaction" showBack />
        <LoadingState message="Loading transaction..." />
      </Screen>
    );
  }

  if (isError || !transaction) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Transaction" showBack />
        <ErrorState
          message="Failed to load transaction details."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  const { category, type, amount, date, description, tags, createdAt, updatedAt } =
    transaction;

  const Icon = category ? getCategoryIcon(category.icon) : null;
  const categoryColor = category?.colorCode || "#6B7280";

  const isExpense = type === "EXPENSE";
  const formattedAmount = formatCurrency(amount);
  const amountDisplay = isExpense ? `-${formattedAmount}` : `+${formattedAmount}`;

  return (
    <Screen padded={false} backgroundColor="#F9FAFB">
      <Header
        title="Transaction Details"
        showBack
        rightElement={
          <Pressable
            onPress={handleEdit}
            className="p-2 rounded-full active:bg-gray-100"
            accessibilityLabel="Edit transaction"
            accessibilityRole="button"
          >
            <Edit3 size={20} color="#3B82F6" />
          </Pressable>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Card */}
        <View className="bg-white rounded-2xl p-6 shadow-card mb-4 items-center">
          {/* Category Icon */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: categoryColor + "20" }}
          >
            {Icon && <Icon size={32} color={categoryColor} />}
          </View>

          {/* Category Name */}
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {category?.name || "Unknown Category"}
          </Text>

          {/* Transaction Type */}
          <View
            className={`px-3 py-1 rounded-full mb-4 ${
              isExpense ? "bg-expense-light" : "bg-income-light"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isExpense ? "text-expense-text" : "text-income-text"
              }`}
            >
              {isExpense ? "Expense" : "Income"}
            </Text>
          </View>

          {/* Amount */}
          <Text
            className={`text-4xl font-bold ${
              isExpense ? "text-expense" : "text-income"
            }`}
          >
            {amountDisplay}
          </Text>
        </View>

        {/* Details Card */}
        <View className="bg-white rounded-2xl p-4 shadow-card mb-4">
          {/* Date */}
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
              <Calendar size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-0.5">Date</Text>
              <Text className="text-base text-gray-900">{formatDate(date)}</Text>
            </View>
          </View>

          {/* Description */}
          {description && (
            <View className="flex-row items-start py-3 border-b border-gray-100">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <FileText size={20} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-0.5">Description</Text>
                <Text className="text-base text-gray-900">{description}</Text>
              </View>
            </View>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <View className="flex-row items-start py-3">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Tag size={20} color="#6B7280" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-2">Tags</Text>
                <View className="flex-row flex-wrap gap-2">
                  {tags.map((tag) => (
                    <View
                      key={tag.id}
                      className="bg-primary-50 rounded-full px-3 py-1"
                    >
                      <Text className="text-sm text-primary-700">{tag.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Metadata Card */}
        <View className="bg-white rounded-2xl p-4 shadow-card mb-4">
          <View className="flex-row justify-between py-2">
            <Text className="text-sm text-gray-500">Created</Text>
            <Text className="text-sm text-gray-900">
              {formatDate(createdAt)} at {formatTime(createdAt)}
            </Text>
          </View>
          {updatedAt && updatedAt !== createdAt && (
            <View className="flex-row justify-between py-2">
              <Text className="text-sm text-gray-500">Last updated</Text>
              <Text className="text-sm text-gray-900">
                {formatDate(updatedAt)} at {formatTime(updatedAt)}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Delete Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <Button
          variant="danger"
          onPress={handleDelete}
          leftIcon={<Trash2 size={18} color="#FFFFFF" />}
          fullWidth
        >
          Delete Transaction
        </Button>
      </View>

      <DeleteTransactionModal
        visible={showDeleteModal}
        transaction={transaction}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
