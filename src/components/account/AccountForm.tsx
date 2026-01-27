import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/forms/ColorPicker";
import { Account } from "@/types/models";
import { PRESET_COLORS } from "@/constants/colors";

const accountSchema = z.object({
  name: z
    .string()
    .min(1, "Account name is required")
    .max(50, "Account name must be 50 characters or less"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code"),
});

export type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  initialData?: Partial<Account>;
  onSubmit: (data: AccountFormData) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AccountForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
}: AccountFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      currency: initialData?.currency || "USD",
      colorCode: initialData?.colorCode || PRESET_COLORS[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        currency: initialData.currency || "USD",
        colorCode: initialData.colorCode || PRESET_COLORS[0],
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
              label="Account Name"
              placeholder="e.g., Personal, Household"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={50}
              testID="account-name-input"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Description (Optional)"
              placeholder="What is this account for?"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
              maxLength={200}
              testID="account-description-input"
            />
          )}
        />

        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Currency"
              placeholder="USD"
              value={value}
              onChangeText={(text) => onChange(text.toUpperCase())}
              onBlur={onBlur}
              error={errors.currency?.message}
              autoCapitalize="characters"
              maxLength={3}
              helperText="3-letter currency code (e.g., USD, EUR, GBP)"
              testID="account-currency-input"
            />
          )}
        />

        <Controller
          control={control}
          name="colorCode"
          render={({ field: { onChange, value } }) => (
            <ColorPicker
              label="Account Color"
              value={value}
              onChange={onChange}
            />
          )}
        />

        <View className="mt-4">
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            testID="account-submit-button"
          >
            {submitLabel}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AccountForm;
