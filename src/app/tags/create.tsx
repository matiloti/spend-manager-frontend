import React, { useCallback } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { TagForm, TagFormData } from "@/components/tag/TagForm";
import { useCreateTag } from "@/hooks/api/useTags";

export default function CreateTagScreen() {
  const router = useRouter();
  const createMutation = useCreateTag();

  const handleSubmit = useCallback(
    async (data: TagFormData) => {
      try {
        await createMutation.mutateAsync({
          name: data.name,
          colorCode: data.colorCode,
        });
        router.back();
      } catch (error: any) {
        let message = "Failed to create tag. Please try again.";

        if (error.code === "TAG_NAME_EXISTS") {
          message = "A tag with this name already exists.";
        } else if (error.code === "TAG_NAME_INVALID_FORMAT") {
          message =
            "Tag name must be lowercase with only letters, numbers, hyphens, and underscores.";
        } else if (error.message) {
          message = error.message;
        }

        Alert.alert("Error", message);
      }
    },
    [createMutation, router]
  );

  return (
    <Screen scroll backgroundColor="#FFFFFF">
      <Header title="New Tag" showBack />

      <TagForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        submitLabel="Create Tag"
      />
    </Screen>
  );
}
