import React from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Account } from "@/types/models";

interface AccountFilterProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountChange: (accountId: string | null) => void;
  testID?: string;
}

// Colors for fallback styling
const COLORS = {
  primary: "#3B82F6",
  primaryLight: "#EFF6FF",
  textPrimary: "#3B82F6",
  textSecondary: "#6B7280",
  bgTertiary: "#F9FAFB",
  border: "#E5E7EB",
};

export function AccountFilter({
  accounts,
  selectedAccountId,
  onAccountChange,
  testID,
}: AccountFilterProps) {
  const isAllSelected = selectedAccountId === null;

  return (
    <View testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        className="pb-4"
      >
        {/* All Accounts chip */}
        <Pressable
          onPress={() => onAccountChange(null)}
          style={[
            styles.chip,
            isAllSelected ? styles.chipSelected : styles.chipUnselected,
          ]}
          className={`h-9 px-3 rounded-chip flex-row items-center border ${
            isAllSelected
              ? "bg-primary-light border-primary"
              : "bg-bg-tertiary border-border"
          }`}
          testID="statistics-account-all"
          accessibilityRole="button"
          accessibilityState={{ selected: isAllSelected }}
        >
          <Text
            style={[
              styles.chipText,
              isAllSelected ? styles.chipTextSelected : styles.chipTextUnselected,
            ]}
            className={`text-sm font-medium ${
              isAllSelected ? "text-primary" : "text-text-secondary"
            }`}
          >
            All Accounts
          </Text>
        </Pressable>

        {/* Individual account chips */}
        {accounts.map((account) => {
          const isSelected = selectedAccountId === account.id;

          return (
            <Pressable
              key={account.id}
              onPress={() => onAccountChange(account.id)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              className={`h-9 px-3 rounded-chip flex-row items-center gap-2 border ${
                isSelected
                  ? "bg-primary-light border-primary"
                  : "bg-bg-tertiary border-border"
              }`}
              testID={`statistics-account-${account.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              {/* Color indicator */}
              <View
                style={[styles.colorIndicator, { backgroundColor: account.colorCode }]}
                className="w-2 h-2 rounded-full"
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
                className={`text-sm font-medium ${
                  isSelected ? "text-primary" : "text-text-secondary"
                }`}
                numberOfLines={1}
              >
                {account.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 0,
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  chipUnselected: {
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.border,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: COLORS.textPrimary,
  },
  chipTextUnselected: {
    color: COLORS.textSecondary,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default AccountFilter;
