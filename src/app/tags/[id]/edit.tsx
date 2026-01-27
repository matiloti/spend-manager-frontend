import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { LoadingState } from "@/components/layout/LoadingState";
import { ErrorState } from "@/components/layout/ErrorState";
import { TagForm, TagFormData } from "@/components/tag/TagForm";
import { useTag, useUpdateTag } from "@/hooks/api/useTags";

export default function EditTagScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: tag, isLoading, isError, refetch } = useTag(id || "");
  const updateMutation = useUpdateTag();

  const handleSubmit = useCallback(
    async (data: TagFormData) => {
      if (!tag) return;

      try {
        await updateMutation.mutateAsync({
          id: tag.id,
          data: {
            name: data.name,
            colorCode: data.colorCode,
          },
        });
        router.back();
      } catch (error: any) {
        let message = "Failed to update tag. Please try again.";

        if (error.code === "TAG_NAME_EXISTS") {
          message = "Another tag with this name already exists.";
        } else if (error.code === "TAG_NAME_INVALID_FORMAT") {
          message =
            "Tag name must be lowercase with only letters, numbers, hyphens, and underscores.";
        } else if (error.message) {
          message = error.message;
        }

        Alert.alert("Error", message);
      }
    },
    [tag, updateMutation, router]
  );

  if (isLoading) {
    return (
      <Screen>
        <Header title="Edit Tag" showBack />
        <LoadingState />
      </Screen>
    );
  }

  if (isError || !tag) {
    return (
      <Screen>
        <Header title="Edit Tag" showBack />
        <ErrorState message="Failed to load tag details." onRetry={refetch} />
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor="#FFFFFF">
      <Header title="Edit Tag" showBack />

      <TagForm
        initialData={tag}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </Screen>
  );
}
