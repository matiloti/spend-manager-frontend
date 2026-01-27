import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Account } from "@/types/models";

interface AccountFilterProps {
  accounts: Account[];
  selectedAccountId: string | null;
  onAccountChange: (accountId: string | null) => void;
  testID?: string;
}

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
        contentContainerStyle={{ paddingHorizontal: 0, gap: 8 }}
        className="pb-4"
      >
        {/* All Accounts chip */}
        <Pressable
          onPress={() => onAccountChange(null)}
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
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: account.colorCode }}
              />
              <Text
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

export default AccountFilter;
