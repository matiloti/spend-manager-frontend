import React from "react";
import { View, Text, Pressable } from "react-native";
import { Check, ChevronRight } from "lucide-react-native";
import { AccountWithBalance } from "@/services/accountService";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/Badge";

interface AccountCardProps {
  account: AccountWithBalance;
  onPress?: () => void;
  onLongPress?: () => void;
  showChevron?: boolean;
  testID?: string;
}

export function AccountCard({
  account,
  onPress,
  onLongPress,
  showChevron = true,
  testID,
}: AccountCardProps) {
  const netBalance = account.balance?.netBalance ?? 0;
  const isPositive = netBalance >= 0;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="bg-white rounded-2xl p-4 border border-gray-100 active:bg-gray-50"
      accessibilityRole="button"
      accessibilityLabel={`Account ${account.name}${account.isActive ? ", active" : ""}`}
      testID={testID}
    >
      <View className="flex-row items-center">
        {/* Color indicator */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: account.colorCode + "20" }}
        >
          <View
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: account.colorCode }}
          />
        </View>

        {/* Account info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="text-base font-semibold text-gray-900"
              numberOfLines={1}
            >
              {account.name}
            </Text>
            {account.isActive && (
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            )}
          </View>
          {account.description && (
            <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
              {account.description}
            </Text>
          )}
        </View>

        {/* Balance and chevron */}
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-base font-semibold ${
              isPositive ? "text-income-dark" : "text-expense"
            }`}
          >
            {formatCurrency(netBalance, account.currency)}
          </Text>
          {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
        </View>
      </View>
    </Pressable>
  );
}

export default AccountCard;
