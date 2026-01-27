import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/forms/ColorPicker";
import { Tag } from "@/types/models";
import { PRESET_COLORS } from "@/constants/colors";

// Tag name validation regex: lowercase alphanumeric with hyphens and underscores
const TAG_NAME_REGEX = /^[a-z0-9_-]+$/;

const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(30, "Tag name must be 30 characters or less")
    .regex(
      TAG_NAME_REGEX,
      "Tag name must be lowercase with only letters, numbers, hyphens, and underscores"
    ),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code"),
});

export type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  initialData?: Partial<Tag>;
  onSubmit: (data: TagFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function TagForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
}: TagFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || "",
      colorCode: initialData?.colorCode || PRESET_COLORS[0],
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        colorCode: initialData.colorCode || PRESET_COLORS[0],
      });
    }
  }, [initialData, reset]);

  // Auto-format name to lowercase and replace spaces with hyphens
  const handleNameChange = (text: string, onChange: (value: string) => void) => {
    const formatted = text.toLowerCase().replace(/\s+/g, "-");
    onChange(formatted);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="gap-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Input
                label="Tag Name"
                placeholder="e.g., work-expenses, vacation"
                value={value}
                onChangeText={(text) => handleNameChange(text, onChange)}
                onBlur={onBlur}
                error={errors.name?.message}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                testID="tag-name-input"
              />
              <Text className="text-xs text-gray-500 mt-1">
                Lowercase letters, numbers, hyphens, and underscores only
              </Text>
            </View>
          )}
        />

        <Controller
          control={control}
          name="colorCode"
          render={({ field: { onChange, value } }) => (
            <ColorPicker label="Color" value={value} onChange={onChange} />
          )}
        />

        <View className="mt-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            testID="tag-submit-button"
          >
            {submitLabel}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default TagForm;
