import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  Wallet,
  FolderOpen,
  Tag,
  ChevronRight,
  User,
  Bell,
  Shield,
} from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center p-4 ${
        disabled ? "opacity-50" : "active:bg-gray-50"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2">
        {title}
      </Text>
      <View className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header title="Settings" />

      <View className="pt-4">
        {/* Data Management */}
        <SettingsSection title="Data Management">
          <SettingsItem
            icon={<Wallet size={20} color="#3B82F6" />}
            title="Accounts"
            subtitle="Manage your spending accounts"
            onPress={() => router.push("/accounts")}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <SettingsItem
            icon={<FolderOpen size={20} color="#22C55E" />}
            title="Categories"
            subtitle="Organize your transactions"
            onPress={() => router.push("/categories")}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <SettingsItem
            icon={<Tag size={20} color="#F97316" />}
            title="Tags"
            subtitle="Add custom labels"
            onPress={() => router.push("/tags")}
          />
        </SettingsSection>

        {/* Preferences */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon={<Bell size={20} color="#8B5CF6" />}
            title="Notifications"
            subtitle="Alerts and reminders"
            onPress={() => router.push("/settings/notifications" as any)}
          />
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account">
          <SettingsItem
            icon={<User size={20} color="#64748B" />}
            title="Profile"
            subtitle="Your personal information"
            disabled
          />
          <View className="h-px bg-gray-100 mx-4" />
          <SettingsItem
            icon={<Shield size={20} color="#EF4444" />}
            title="Security"
            subtitle="Password and authentication"
            disabled
          />
        </SettingsSection>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">Spend Manager v0.0.1</Text>
        </View>
      </View>
    </Screen>
  );
}
