import React from "react";
import { View, Text } from "react-native";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react-native";
import { Card } from "@/components/ui/Card";
import { BalanceSummary } from "@/types/models";
import { formatCurrency } from "@/utils/formatters";

interface AccountBalanceProps {
  balance: BalanceSummary;
  currency: string;
}

export function AccountBalance({ balance, currency }: AccountBalanceProps) {
  const isPositive = balance.netBalance >= 0;

  return (
    <Card>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-medium text-gray-500">Net Balance</Text>
        <View
          className={`p-2 rounded-full ${
            isPositive ? "bg-income-light" : "bg-expense-light"
          }`}
        >
          <Wallet
            size={20}
            color={isPositive ? "#15803D" : "#B91C1C"}
          />
        </View>
      </View>

      <Text
        className={`text-3xl font-bold mb-4 ${
          isPositive ? "text-income-dark" : "text-expense"
        }`}
      >
        {formatCurrency(balance.netBalance, currency)}
      </Text>

      <View className="flex-row gap-4">
        <View className="flex-1 bg-income-light/50 rounded-xl p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <TrendingUp size={16} color="#15803D" />
            <Text className="text-sm text-income-dark font-medium">Income</Text>
          </View>
          <Text className="text-lg font-semibold text-income-dark">
            {formatCurrency(balance.totalIncome, currency)}
          </Text>
        </View>

        <View className="flex-1 bg-expense-light/50 rounded-xl p-3">
          <View className="flex-row items-center gap-2 mb-1">
            <TrendingDown size={16} color="#B91C1C" />
            <Text className="text-sm text-expense-dark font-medium">Expenses</Text>
          </View>
          <Text className="text-lg font-semibold text-expense-dark">
            {formatCurrency(balance.totalExpenses, currency)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

export default AccountBalance;
