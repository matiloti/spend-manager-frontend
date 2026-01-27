import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { ChevronRight, X, Check, Camera, User } from "lucide-react-native";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";
import {
  useUserPreferencesStore,
  CURRENCIES,
  DATE_FORMATS,
  Currency,
  DateFormat,
  getCurrencyDisplayName,
  formatDateWithPreference,
} from "@/stores/userPreferencesStore";

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

// iOS-style selection item with chevron
interface SelectionItemProps {
  title: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

function SelectionItem({
  title,
  value,
  onPress,
  disabled = false,
  testID,
}: SelectionItemProps) {
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
      <Text className="flex-1 text-base text-gray-900">{title}</Text>
      <Text className="text-base text-gray-500 mr-2" numberOfLines={1}>
        {value}
      </Text>
      <ChevronRight size={20} color="#9CA3AF" />
    </Pressable>
  );
}

// Static display item (non-editable)
interface DisplayItemProps {
  title: string;
  value: string;
  testID?: string;
}

function DisplayItem({ title, value, testID }: DisplayItemProps) {
  return (
    <View
      className="flex-row items-center px-4 py-3 min-h-[44px]"
      testID={testID}
    >
      <Text className="flex-1 text-base text-gray-900">{title}</Text>
      <Text className="text-base text-gray-500" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

// Profile Avatar with initials
interface ProfileAvatarProps {
  name?: string;
  size?: number;
  onPress?: () => void;
}

function ProfileAvatar({ name, size = 80, onPress }: ProfileAvatarProps) {
  const getInitials = (fullName?: string): string => {
    if (!fullName) return "?";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="items-center"
      accessibilityRole={onPress ? "button" : "none"}
      accessibilityLabel={onPress ? "Change profile photo" : "Profile photo"}
    >
      <View
        className="bg-primary-100 rounded-full items-center justify-center"
        style={{ width: size, height: size }}
      >
        {name ? (
          <Text
            className="text-primary-600 font-bold"
            style={{ fontSize: size * 0.35 }}
          >
            {initials}
          </Text>
        ) : (
          <User size={size * 0.5} color="#3B82F6" />
        )}
      </View>
      {onPress && (
        <View className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-1.5 border-2 border-white">
          <Camera size={14} color="#FFFFFF" />
        </View>
      )}
    </Pressable>
  );
}

// Edit Name Modal
interface EditNameModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => Promise<void>;
}

function EditNameModal({
  visible,
  onClose,
  currentName,
  onSave,
}: EditNameModalProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setName(currentName);
      setError(null);
    }
  }, [visible, currentName]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    if (name.trim().length > 100) {
      setError("Name must be 100 characters or less");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError("Failed to update name. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Edit Display Name
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
              disabled={loading}
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text className="text-sm text-gray-500 mb-2">Display Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
              autoFocus
              maxLength={100}
              editable={!loading}
            />
            {error && (
              <Text className="text-sm text-red-500 mt-2">{error}</Text>
            )}
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 p-4 pt-0">
            <View className="flex-1">
              <Button
                variant="ghost"
                onPress={onClose}
                disabled={loading}
                fullWidth
              >
                Cancel
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="primary"
                onPress={handleSave}
                loading={loading}
                fullWidth
              >
                Save
              </Button>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Currency Picker Modal
interface CurrencyPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: Currency;
  onChange: (currency: Currency) => void;
}

function CurrencyPickerModal({
  visible,
  onClose,
  value,
  onChange,
}: CurrencyPickerModalProps) {
  const handleSelect = (currency: Currency) => {
    onChange(currency);
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
          className="bg-white rounded-2xl w-full max-w-sm overflow-hidden max-h-[70%]"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              Select Currency
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Currencies */}
          <View className="py-2">
            {CURRENCIES.map((currency) => (
              <Pressable
                key={currency.code}
                onPress={() => handleSelect(currency.code)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                accessibilityRole="button"
              >
                <Text className="w-12 text-base text-gray-500">
                  {currency.symbol}
                </Text>
                <View className="flex-1">
                  <Text className="text-base text-gray-900">
                    {currency.code}
                  </Text>
                  <Text className="text-sm text-gray-500">{currency.name}</Text>
                </View>
                {value === currency.code && <Check size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Date Format Picker Modal
interface DateFormatPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: DateFormat;
  onChange: (format: DateFormat) => void;
}

function DateFormatPickerModal({
  visible,
  onClose,
  value,
  onChange,
}: DateFormatPickerModalProps) {
  const handleSelect = (format: DateFormat) => {
    onChange(format);
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
              Select Date Format
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Date Formats */}
          <View className="py-2">
            {DATE_FORMATS.map((format) => (
              <Pressable
                key={format.value}
                onPress={() => handleSelect(format.value)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                accessibilityRole="button"
              >
                <View className="flex-1">
                  <Text className="text-base text-gray-900">{format.label}</Text>
                  <Text className="text-sm text-gray-500">
                    Example: {format.example}
                  </Text>
                </View>
                {value === format.value && <Check size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-500">
              This affects how dates are displayed throughout the app.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Photo Options Modal (placeholder for future implementation)
interface PhotoOptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

function PhotoOptionsModal({ visible, onClose }: PhotoOptionsModalProps) {
  const handleOption = (option: string) => {
    Alert.alert(
      "Coming Soon",
      "Profile photo upload will be available in a future update.",
      [{ text: "OK" }]
    );
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
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className="items-center py-4 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              Change Profile Photo
            </Text>
          </View>

          {/* Options */}
          <View className="py-2">
            <Pressable
              onPress={() => handleOption("camera")}
              className="px-4 py-4 active:bg-gray-50"
              accessibilityRole="button"
            >
              <Text className="text-base text-center text-primary-500">
                Take Photo
              </Text>
            </Pressable>
            <View className="h-px bg-gray-100" />
            <Pressable
              onPress={() => handleOption("library")}
              className="px-4 py-4 active:bg-gray-50"
              accessibilityRole="button"
            >
              <Text className="text-base text-center text-primary-500">
                Choose from Library
              </Text>
            </Pressable>
            <View className="h-px bg-gray-100" />
            <Pressable
              onPress={() => handleOption("remove")}
              className="px-4 py-4 active:bg-gray-50"
              accessibilityRole="button"
            >
              <Text className="text-base text-center text-red-500">
                Remove Photo
              </Text>
            </Pressable>
          </View>

          {/* Cancel */}
          <View className="p-4 pt-2">
            <Button variant="ghost" onPress={onClose} fullWidth>
              Cancel
            </Button>
          </View>

          {/* Safe area padding */}
          <View className="h-4" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [refreshing, setRefreshing] = useState(false);

  // Modal visibility states
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);
  const [dateFormatPickerVisible, setDateFormatPickerVisible] = useState(false);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);

  // User preferences
  const { currency, dateFormat, setCurrency, setDateFormat } =
    useUserPreferencesStore();

  // Refresh user profile from server
  const refreshProfile = async () => {
    setRefreshing(true);
    try {
      const profile = await authService.getProfile();
      // Update the auth store with fresh profile data
      updateUser(profile);
    } catch (error) {
      console.error("Failed to refresh profile:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle name update
  const handleUpdateName = async (newName: string) => {
    const updatedUser = await authService.updateProfile({ name: newName });
    // Sync the updated user data with the auth store
    updateUser(updatedUser);
    Alert.alert("Success", "Your display name has been updated.");
  };

  // Format account creation date
  const formatAccountDate = (dateString?: string): string => {
    if (!dateString) return "Unknown";
    return formatDateWithPreference(dateString, dateFormat);
  };

  // Format last login (using updatedAt as proxy)
  const formatLastLogin = (dateString?: string): string => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    return formatDateWithPreference(dateString, dateFormat);
  };

  if (!user) {
    return (
      <Screen backgroundColor="#F9FAFB">
        <Header title="Profile" showBack />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header title="Profile" showBack />

      <View className="pt-6 pb-8">
        {/* Profile Photo Section */}
        <View className="items-center mb-6">
          <ProfileAvatar
            name={user.name}
            size={100}
            onPress={() => setPhotoOptionsVisible(true)}
          />
          <Text className="text-lg font-semibold text-gray-900 mt-3">
            {user.name || "No name set"}
          </Text>
          <Text className="text-sm text-gray-500">{user.email}</Text>
        </View>

        {/* Personal Information */}
        <SectionHeader title="Personal Information" />
        <SectionContainer>
          <SelectionItem
            title="Display Name"
            value={user.name || "Not set"}
            onPress={() => setEditNameModalVisible(true)}
            testID="display-name-item"
          />
          <Divider />
          <DisplayItem
            title="Email"
            value={user.email}
            testID="email-item"
          />
        </SectionContainer>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <SectionContainer>
          <SelectionItem
            title="Currency"
            value={getCurrencyDisplayName(currency)}
            onPress={() => setCurrencyPickerVisible(true)}
            testID="currency-item"
          />
          <Divider />
          <SelectionItem
            title="Date Format"
            value={dateFormat}
            onPress={() => setDateFormatPickerVisible(true)}
            testID="date-format-item"
          />
        </SectionContainer>

        {/* Account Information */}
        <SectionHeader title="Account Information" />
        <SectionContainer>
          <DisplayItem
            title="Member Since"
            value={formatAccountDate(user.createdAt)}
            testID="created-at-item"
          />
          <Divider />
          <DisplayItem
            title="Last Active"
            value={formatLastLogin(user.updatedAt || user.createdAt)}
            testID="last-login-item"
          />
        </SectionContainer>

        {/* Info text */}
        <View className="px-4 mt-4">
          <Text className="text-sm text-gray-500">
            Currency and date format preferences are stored locally on this
            device.
          </Text>
        </View>
      </View>

      {/* Modals */}
      <EditNameModal
        visible={editNameModalVisible}
        onClose={() => setEditNameModalVisible(false)}
        currentName={user.name || ""}
        onSave={handleUpdateName}
      />

      <CurrencyPickerModal
        visible={currencyPickerVisible}
        onClose={() => setCurrencyPickerVisible(false)}
        value={currency}
        onChange={setCurrency}
      />

      <DateFormatPickerModal
        visible={dateFormatPickerVisible}
        onClose={() => setDateFormatPickerVisible(false)}
        value={dateFormat}
        onChange={setDateFormat}
      />

      <PhotoOptionsModal
        visible={photoOptionsVisible}
        onClose={() => setPhotoOptionsVisible(false)}
      />
    </Screen>
  );
}
