import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Switch,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { ChevronRight, X, Check, KeyRound, Fingerprint, Lock, LogOut } from "lucide-react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ChangePasswordModal } from "@/components/security/ChangePasswordModal";
import {
  useSecurityPreferencesStore,
  APP_LOCK_TIMEOUTS,
  AppLockTimeout,
  getAppLockTimeoutLabel,
} from "@/stores/securityPreferencesStore";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";

// iOS-style toggle list item
interface ToggleItemProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

function ToggleItem({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  testID,
}: ToggleItemProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3 min-h-[44px] ${
        disabled ? "opacity-50" : ""
      }`}
      testID={testID}
    >
      <View className="flex-1 mr-3">
        <Text className="text-base text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

// iOS-style button list item
interface ButtonItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
  showChevron?: boolean;
  value?: string;
  testID?: string;
}

function ButtonItem({
  icon,
  title,
  subtitle,
  onPress,
  disabled = false,
  danger = false,
  showChevron = true,
  value,
  testID,
}: ButtonItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center px-4 py-3 min-h-[44px] ${
        disabled ? "opacity-50" : "active:bg-gray-50"
      }`}
      accessibilityRole="button"
      testID={testID}
    >
      {icon && (
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
          danger ? "bg-red-50" : "bg-gray-100"
        }`}>
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className={`text-base ${danger ? "text-red-600" : "text-gray-900"}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
        )}
      </View>
      {value && (
        <Text className="text-base text-gray-500 mr-2">{value}</Text>
      )}
      {showChevron && <ChevronRight size={20} color="#9CA3AF" />}
    </Pressable>
  );
}

// Section header
function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-sm font-semibold text-gray-500 uppercase px-4 mb-2 mt-6">
      {title}
    </Text>
  );
}

// Section container with rounded corners
function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-xl border border-gray-100 overflow-hidden mx-4">
      {children}
    </View>
  );
}

// Divider
function Divider() {
  return <View className="h-px bg-gray-100 mx-4" />;
}

// App Lock Timeout Picker Modal
interface TimeoutPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: AppLockTimeout;
  onChange: (timeout: AppLockTimeout) => void;
}

function TimeoutPickerModal({
  visible,
  onClose,
  value,
  onChange,
}: TimeoutPickerModalProps) {
  const handleSelect = (timeout: AppLockTimeout) => {
    onChange(timeout);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-4"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              App Lock Timeout
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Options */}
          <View className="py-2">
            {APP_LOCK_TIMEOUTS.map((timeout) => (
              <Pressable
                key={timeout.value}
                onPress={() => handleSelect(timeout.value)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                accessibilityRole="button"
              >
                <Text className="flex-1 text-base text-gray-900">
                  {timeout.label}
                </Text>
                {value === timeout.value && <Check size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-500">
              Choose how long to wait before requiring authentication when you return to the app.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Logout All Confirmation Modal
interface LogoutAllModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function LogoutAllModal({
  visible,
  onClose,
  onConfirm,
  loading,
}: LogoutAllModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
            Log Out All Devices
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            This will log you out of all devices except this one. You will need to sign in again on other devices.
          </Text>
          <View className="gap-3">
            <Button
              variant="danger"
              onPress={onConfirm}
              loading={loading}
              fullWidth
            >
              Log Out All Devices
            </Button>
            <Button
              variant="ghost"
              onPress={onClose}
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

export default function SecurityScreen() {
  // Biometrics state
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType | null>(null);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);

  // Modal visibility states
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [timeoutPickerVisible, setTimeoutPickerVisible] = useState(false);
  const [logoutAllModalVisible, setLogoutAllModalVisible] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);

  // Stores
  const {
    biometricsEnabled,
    appLockEnabled,
    appLockTimeout,
    setBiometricsEnabled,
    setAppLockEnabled,
    setAppLockTimeout,
  } = useSecurityPreferencesStore();

  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Check biometrics availability on mount
  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      setIsBiometricsAvailable(compatible && enrolled);

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType(LocalAuthentication.AuthenticationType.FINGERPRINT);
        }
      }
    } catch (error) {
      console.error("Error checking biometrics:", error);
    }
  };

  const getBiometricLabel = (): string => {
    if (Platform.OS === "ios") {
      return biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        ? "Face ID"
        : "Touch ID";
    }
    return biometricType === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      ? "Face Recognition"
      : "Fingerprint";
  };

  const handleBiometricsToggle = async (enabled: boolean) => {
    if (!enabled) {
      setBiometricsEnabled(false);
      return;
    }

    // Prompt for biometric authentication to enable
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${getBiometricLabel()}`,
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricsEnabled(true);
        // Also enable app lock if not already enabled
        if (!appLockEnabled) {
          setAppLockEnabled(true);
        }
      } else {
        Alert.alert(
          "Authentication Failed",
          "Could not verify your identity. Please try again."
        );
      }
    } catch (error) {
      console.error("Biometrics error:", error);
      Alert.alert(
        "Error",
        "An error occurred while enabling biometrics. Please try again."
      );
    }
  };

  const handleAppLockToggle = async (enabled: boolean) => {
    if (!enabled) {
      // Confirm before disabling
      Alert.alert(
        "Disable App Lock",
        "Are you sure you want to disable app lock? Your data will be less secure.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            style: "destructive",
            onPress: () => setAppLockEnabled(false),
          },
        ]
      );
      return;
    }

    setAppLockEnabled(true);
  };

  const handleLogoutAll = async () => {
    setLogoutAllLoading(true);
    try {
      const response = await authService.logoutAll();

      Alert.alert(
        "Success",
        `Logged out from ${response.revokedSessions} ${
          response.revokedSessions === 1 ? "session" : "sessions"
        } on other devices.`,
        [{ text: "OK" }]
      );

      setLogoutAllModalVisible(false);
    } catch (error) {
      console.error("Logout all error:", error);
      Alert.alert(
        "Error",
        "Failed to log out from other devices. Please try again."
      );
    } finally {
      setLogoutAllLoading(false);
    }
  };

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header title="Security" showBack />

      <View className="pt-2 pb-8">
        {/* Password Section */}
        <SectionHeader title="Password" />
        <SectionContainer>
          <ButtonItem
            icon={<KeyRound size={18} color="#3B82F6" />}
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => setChangePasswordModalVisible(true)}
            testID="change-password-button"
          />
        </SectionContainer>

        {/* Biometrics Section */}
        <SectionHeader title="Biometrics" />
        <SectionContainer>
          {isBiometricsAvailable ? (
            <ToggleItem
              title={getBiometricLabel()}
              subtitle={`Use ${getBiometricLabel()} to unlock the app`}
              value={biometricsEnabled}
              onValueChange={handleBiometricsToggle}
              testID="biometrics-toggle"
            />
          ) : (
            <View className="px-4 py-3">
              <Text className="text-base text-gray-500">
                Biometric authentication is not available on this device.
              </Text>
              <Text className="text-sm text-gray-400 mt-1">
                {Platform.OS === "ios"
                  ? "Set up Face ID or Touch ID in Settings to use this feature."
                  : "Set up fingerprint or face recognition in Settings to use this feature."}
              </Text>
            </View>
          )}
        </SectionContainer>

        {/* App Lock Section */}
        <SectionHeader title="App Lock" />
        <SectionContainer>
          <ToggleItem
            title="Enable App Lock"
            subtitle="Require authentication when opening the app"
            value={appLockEnabled}
            onValueChange={handleAppLockToggle}
            testID="app-lock-toggle"
          />
          {appLockEnabled && (
            <>
              <Divider />
              <ButtonItem
                icon={<Lock size={18} color="#6B7280" />}
                title="Lock Timeout"
                value={getAppLockTimeoutLabel(appLockTimeout)}
                onPress={() => setTimeoutPickerVisible(true)}
                testID="lock-timeout-button"
              />
            </>
          )}
        </SectionContainer>

        {/* App Lock Info */}
        {appLockEnabled && (
          <View className="px-4 mt-3">
            <Text className="text-sm text-gray-500">
              {biometricsEnabled
                ? `You will be asked to authenticate with ${getBiometricLabel()} ${
                    appLockTimeout === "immediately"
                      ? "every time you open the app"
                      : appLockTimeout === "never"
                      ? "only when the app is terminated"
                      : `after ${appLockTimeout === "1min" ? "1 minute" : "5 minutes"} away`
                  }.`
                : "Enable biometrics above for easier authentication."}
            </Text>
          </View>
        )}

        {/* Sessions Section */}
        <SectionHeader title="Sessions" />
        <SectionContainer>
          <ButtonItem
            icon={<LogOut size={18} color="#EF4444" />}
            title="Log Out All Devices"
            subtitle="Sign out of all other devices"
            onPress={() => setLogoutAllModalVisible(true)}
            danger
            showChevron={false}
            testID="logout-all-button"
          />
        </SectionContainer>

        {/* Info text */}
        <View className="px-4 mt-4">
          <Text className="text-sm text-gray-500">
            Security preferences are stored locally on this device. App lock functionality will be fully implemented in a future update.
          </Text>
        </View>
      </View>

      {/* Modals */}
      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />

      <TimeoutPickerModal
        visible={timeoutPickerVisible}
        onClose={() => setTimeoutPickerVisible(false)}
        value={appLockTimeout}
        onChange={setAppLockTimeout}
      />

      <LogoutAllModal
        visible={logoutAllModalVisible}
        onClose={() => setLogoutAllModalVisible(false)}
        onConfirm={handleLogoutAll}
        loading={logoutAllLoading}
      />
    </Screen>
  );
}
