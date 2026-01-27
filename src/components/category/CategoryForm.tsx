import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/forms/ColorPicker";
import { IconPicker } from "@/components/category/IconPicker";
import { TypeToggle } from "@/components/category/TypeToggle";
import { Category, CategoryType } from "@/types/models";
import { PRESET_COLORS } from "@/constants/colors";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(30, "Category name must be 30 characters or less"),
  icon: z.string().min(1, "Please select an icon"),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code"),
  type: z.enum(["EXPENSE", "INCOME"]),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
  isEdit?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
  isEdit = false,
}: CategoryFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      icon: initialData?.icon || "more-horizontal",
      colorCode: initialData?.colorCode || PRESET_COLORS[0],
      type: initialData?.type || "EXPENSE",
    },
  });

  const watchedColor = watch("colorCode");
  const watchedType = watch("type");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        icon: initialData.icon || "more-horizontal",
        colorCode: initialData.colorCode || PRESET_COLORS[0],
        type: initialData.type || "EXPENSE",
      });
    }
  }, [initialData, reset]);

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
            <Input
              label="Category Name"
              placeholder="e.g., Food, Transport, Salary"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              testID="category-name-input"
            />
          )}
        />

        {!isEdit && (
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-3">
                  Category Type
                </Text>
                <TypeToggle
                  value={value}
                  onChange={onChange}
                  disabled={isEdit}
                />
                {errors.type?.message && (
                  <Text className="text-sm text-error mt-1">
                    {errors.type.message}
                  </Text>
                )}
              </View>
            )}
          />
        )}

        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, value } }) => (
            <View>
              <IconPicker
                label="Icon"
                value={value}
                onChange={onChange}
                color={watchedColor}
              />
              {errors.icon?.message && (
                <Text className="text-sm text-error mt-1">
                  {errors.icon.message}
                </Text>
              )}
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
            testID="category-submit-button"
          >
            {submitLabel}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default CategoryForm;
