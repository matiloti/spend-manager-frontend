import React, { useCallback, useState, useMemo } from "react";
import { View, SectionList, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Plus, FolderOpen } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/layout/EmptyState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { CategoryCard } from "@/components/category/CategoryCard";
import { TypeToggle } from "@/components/category/TypeToggle";
import { DeleteCategoryModal } from "@/components/category/DeleteCategoryModal";
import { useCategories, useDeleteCategory } from "@/hooks/api/useCategories";
import { Category, CategoryType } from "@/types/models";

interface SectionData {
  title: string;
  data: Category[];
}

export default function CategoryListScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<CategoryType>("EXPENSE");
  const [deleteModalCategory, setDeleteModalCategory] =
    useState<Category | null>(null);

  const {
    data: categoriesData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCategories({ includeCount: true });

  const deleteMutation = useDeleteCategory();

  // Group categories by type
  const sections = useMemo<SectionData[]>(() => {
    const categories = categoriesData?.content || [];
    const filtered = categories.filter((c) => c.type === activeType);

    if (filtered.length === 0) {
      return [];
    }

    return [
      {
        title: activeType === "EXPENSE" ? "Expense Categories" : "Income Categories",
        data: filtered,
      },
    ];
  }, [categoriesData, activeType]);

  const handleCategoryPress = useCallback(
    (category: Category) => {
      router.push(`/categories/${category.id}`);
    },
    [router]
  );

  const handleCategoryLongPress = useCallback(
    (category: Category) => {
      Alert.alert(category.name, "What would you like to do?", [
        {
          text: "Edit",
          onPress: () => router.push(`/categories/${category.id}/edit`),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setDeleteModalCategory(category),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [router]
  );

  const handleCreateCategory = useCallback(() => {
    router.push(`/categories/create?type=${activeType}`);
  }, [router, activeType]);

  const handleDeleteConfirm = useCallback(
    async (replacementCategoryId?: string) => {
      if (!deleteModalCategory) return;

      try {
        await deleteMutation.mutateAsync({
          id: deleteModalCategory.id,
          replacementCategoryId,
        });
        setDeleteModalCategory(null);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to delete category. Please try again."
        );
      }
    },
    [deleteModalCategory, deleteMutation]
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryCard
        category={item}
        onPress={() => handleCategoryPress(item)}
        onLongPress={() => handleCategoryLongPress(item)}
        testID={`category-card-${item.id}`}
      />
    ),
    [handleCategoryPress, handleCategoryLongPress]
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionData }) => (
      <View className="pt-4 pb-2 bg-bg-secondary">
        <View className="text-sm font-semibold text-gray-500 uppercase" />
      </View>
    ),
    []
  );

  const renderEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon={<FolderOpen size={48} color="#9CA3AF" />}
        title={`No ${activeType.toLowerCase()} categories`}
        description={`Create your first ${activeType.toLowerCase()} category to organize your transactions.`}
        actionLabel="Create Category"
        onAction={handleCreateCategory}
      />
    ),
    [activeType, handleCreateCategory]
  );

  const renderSeparator = useCallback(() => <View className="h-3" />, []);

  const renderLoadingSkeleton = () => (
    <View className="gap-3 px-4 pt-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  const renderListHeader = useCallback(
    () => (
      <View className="px-4 py-4">
        <TypeToggle value={activeType} onChange={setActiveType} />
      </View>
    ),
    [activeType]
  );

  if (isLoading) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Categories" showBack />
        <View className="px-4 py-4">
          <TypeToggle value={activeType} onChange={setActiveType} />
        </View>
        {renderLoadingSkeleton()}
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Categories" showBack />
        <ErrorState
          message="Failed to load categories."
          onRetry={refetch}
        />
      </Screen>
    );
  }

  return (
    <Screen padded={false} backgroundColor="#F9FAFB">
      <Header
        title="Categories"
        showBack
        rightElement={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleCreateCategory}
            leftIcon={<Plus size={18} color="#3B82F6" />}
          >
            Add
          </Button>
        }
      />

      <SectionList
        sections={sections}
        renderItem={renderCategoryItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        testID="category-list"
      />

      <DeleteCategoryModal
        visible={!!deleteModalCategory}
        category={deleteModalCategory}
        onClose={() => setDeleteModalCategory(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
