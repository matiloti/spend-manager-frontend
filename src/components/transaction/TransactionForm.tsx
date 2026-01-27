import React, { useCallback, useEffect } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { AmountInput } from "@/components/forms/AmountInput";
import { DatePicker } from "@/components/forms/DatePicker";
import { TagSelector } from "@/components/forms/TagSelector";
import { CategoryPicker } from "@/components/category/CategoryPicker";
import { TypeToggle } from "@/components/category/TypeToggle";
import { Transaction, TransactionType } from "@/types/models";
import { formatDateISO } from "@/utils/formatters";

const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Please select a category"),
  amount: z.number().positive("Amount must be greater than 0").max(999999999.99, "Amount too large"),
  date: z.date(),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
  tagIds: z.array(z.string()).optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: {
    type: TransactionType;
    categoryId: string;
    amount: number;
    date: string;
    description?: string;
    tagIds?: string[];
  }) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultType?: TransactionType;
}

export function TransactionForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  defaultType = "EXPENSE",
}: TransactionFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialData?.type || defaultType,
      categoryId: initialData?.categoryId || "",
      amount: initialData?.amount || undefined,
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      description: initialData?.description || "",
      tagIds: initialData?.tags?.map((t) => t.id) || [],
    },
  });

  const currentType = watch("type");

  // Clear category when type changes (since categories are type-specific)
  useEffect(() => {
    if (!initialData) {
      setValue("categoryId", "");
    }
  }, [currentType, initialData, setValue]);

  const handleFormSubmit = useCallback(
    async (data: TransactionFormData) => {
      await onSubmit({
        type: data.type,
        categoryId: data.categoryId,
        amount: data.amount,
        date: formatDateISO(data.date),
        description: data.description || undefined,
        tagIds: data.tagIds?.length ? data.tagIds : undefined,
      });
    },
    [onSubmit]
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6">
        {/* Type Toggle */}
        {!initialData && (
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <TypeToggle value={value} onChange={onChange} />
            )}
          />
        )}

        {/* Amount */}
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <AmountInput
              value={value}
              onChange={onChange}
              label="Amount"
              error={errors.amount?.message}
              testID="transaction-amount"
            />
          )}
        />

        {/* Category */}
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange } }) => (
            <CategoryPicker
              value={value}
              onChange={onChange}
              type={currentType}
              label="Category"
              error={errors.categoryId?.message}
              testID="transaction-category"
            />
          )}
        />

        {/* Date */}
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <DatePicker
              value={value}
              onChange={onChange}
              label="Date"
              error={errors.date?.message}
              testID="transaction-date"
            />
          )}
        />

        {/* Description */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            Description (optional)
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                className={`
                  border rounded-xl px-4 py-3 text-base text-gray-900 bg-white
                  ${errors.description ? "border-expense" : "border-gray-300"}
                `}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="What was this for?"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                maxLength={200}
                accessibilityLabel="Description"
                testID="transaction-description"
              />
            )}
          />
          {errors.description && (
            <Text className="text-sm text-expense mt-1.5">
              {errors.description.message}
            </Text>
          )}
        </View>

        {/* Tags */}
        <Controller
          control={control}
          name="tagIds"
          render={({ field: { value, onChange } }) => (
            <TagSelector
              selectedTagIds={value || []}
              onChange={onChange}
              label="Tags (optional)"
              testID="transaction-tags"
            />
          )}
        />

        {/* Submit Button */}
        <View className="pt-4">
          <Button
            onPress={handleSubmit(handleFormSubmit)}
            loading={isSubmitting}
            fullWidth
            size="lg"
            testID="transaction-submit"
          >
            {submitLabel}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

export default TransactionForm;
