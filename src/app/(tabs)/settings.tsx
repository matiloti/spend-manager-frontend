import React, { useState } from "react";
import { View, Text, Pressable, Modal, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Wallet,
  FolderOpen,
  Tag,
  ChevronRight,
  User,
  Bell,
  Shield,
  LogOut,
} from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  danger = false,
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
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
        danger ? "bg-red-50" : "bg-gray-100"
      }`}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-base font-medium ${danger ? "text-red-600" : "text-gray-900"}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {!danger && <ChevronRight size={20} color="#9CA3AF" />}
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

function LogoutConfirmationModal({
  visible,
  onCancel,
  onConfirm,
  loading,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
            Log Out
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </Text>
          <View className="gap-3">
            <Button
              variant="danger"
              onPress={onConfirm}
              loading={loading}
              fullWidth
            >
              Log Out
            </Button>
            <Button
              variant="ghost"
              onPress={onCancel}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const getRefreshToken = useAuthStore((state) => state.getRefreshToken);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Get the current refresh token
      const refreshToken = await getRefreshToken();

      // Invalidate the refresh token on the server
      if (refreshToken) {
        try {
          await authService.logout({ refreshToken });
        } catch (error) {
          // Even if server-side logout fails, we still clear local auth
          console.warn("Server-side logout failed:", error);
        }
      }

      // Clear local auth state
      await clearAuth();

      // Close modal
      setShowLogoutModal(false);

      // Router will automatically redirect to login due to auth guards in _layout.tsx
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert(
        "Logout Failed",
        "An error occurred while logging out. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLogoutLoading(false);
    }
  };

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
            onPress={() => router.push("/settings/profile" as any)}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <SettingsItem
            icon={<Shield size={20} color="#EF4444" />}
            title="Security"
            subtitle="Password and authentication"
            onPress={() => router.push("/settings/security" as any)}
          />
          <View className="h-px bg-gray-100 mx-4" />
          <SettingsItem
            icon={<LogOut size={20} color="#EF4444" />}
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={() => setShowLogoutModal(true)}
            danger
          />
        </SettingsSection>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm">Spend Manager v0.0.1</Text>
        </View>
      </View>

      <LogoutConfirmationModal
        visible={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={logoutLoading}
      />
    </Screen>
  );
}
