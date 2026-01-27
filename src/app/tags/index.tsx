import React, { useCallback, useState, useMemo } from "react";
import { View, FlatList, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Plus, Tag as TagIcon } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { EmptyState } from "@/components/layout/EmptyState";
import { ErrorState } from "@/components/layout/ErrorState";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { TagCard } from "@/components/tag/TagCard";
import { DeleteTagModal } from "@/components/tag/DeleteTagModal";
import { useTags, useDeleteTag } from "@/hooks/api/useTags";
import { Tag } from "@/types/models";

export default function TagListScreen() {
  const router = useRouter();
  const [deleteModalTag, setDeleteModalTag] = useState<Tag | null>(null);

  const {
    data: tagsData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useTags({ sort: "name,asc" });

  const deleteMutation = useDeleteTag();

  const tags = useMemo(() => tagsData?.content || [], [tagsData]);

  const handleTagPress = useCallback(
    (tag: Tag) => {
      router.push(`/tags/${tag.id}`);
    },
    [router]
  );

  const handleTagLongPress = useCallback(
    (tag: Tag) => {
      Alert.alert(tag.name, "What would you like to do?", [
        {
          text: "Edit",
          onPress: () => router.push(`/tags/${tag.id}/edit`),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setDeleteModalTag(tag),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [router]
  );

  const handleCreateTag = useCallback(() => {
    router.push("/tags/create");
  }, [router]);

  const handleDeleteConfirm = useCallback(
    async (action: "remove" | "reassign", replacementTagId?: string) => {
      if (!deleteModalTag) return;

      try {
        await deleteMutation.mutateAsync({
          id: deleteModalTag.id,
          params: {
            action,
            replacementTagId,
          },
        });
        setDeleteModalTag(null);
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to delete tag. Please try again."
        );
      }
    },
    [deleteModalTag, deleteMutation]
  );

  const renderTagItem = useCallback(
    ({ item }: { item: Tag }) => (
      <TagCard
        tag={item}
        onPress={() => handleTagPress(item)}
        onLongPress={() => handleTagLongPress(item)}
        testID={`tag-card-${item.id}`}
      />
    ),
    [handleTagPress, handleTagLongPress]
  );

  const renderEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon={<TagIcon size={48} color="#9CA3AF" />}
        title="No tags yet"
        description="Create your first tag to organize your transactions beyond categories."
        actionLabel="Create Tag"
        onAction={handleCreateTag}
      />
    ),
    [handleCreateTag]
  );

  const renderSeparator = useCallback(() => <View className="h-3" />, []);

  const renderLoadingSkeleton = () => (
    <View className="gap-3 px-4 pt-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Tags" showBack />
        {renderLoadingSkeleton()}
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Tags" showBack />
        <ErrorState message="Failed to load tags." onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen padded={false} backgroundColor="#F9FAFB">
      <Header
        title="Tags"
        showBack
        rightElement={
          <Button
            variant="ghost"
            size="sm"
            onPress={handleCreateTag}
            leftIcon={<Plus size={18} color="#3B82F6" />}
          >
            Add
          </Button>
        }
      />

      <FlatList
        data={tags}
        renderItem={renderTagItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        testID="tag-list"
      />

      <DeleteTagModal
        visible={!!deleteModalTag}
        tag={deleteModalTag}
        onClose={() => setDeleteModalTag(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </Screen>
  );
}
