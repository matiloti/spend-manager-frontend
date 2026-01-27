import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Switch,
  Modal,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { ChevronRight, X, Check } from "lucide-react-native";
import * as Notifications from "expo-notifications";
import { Screen } from "@/components/layout/Screen";
import { Header } from "@/components/layout/Header";
import {
  useNotificationPreferencesStore,
  DAYS_OF_WEEK,
  BUDGET_THRESHOLDS,
  formatTime,
  DayOfWeek,
  BudgetThreshold,
} from "@/stores/notificationPreferencesStore";

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
      <Text className="text-base text-gray-500 mr-2">{value}</Text>
      <ChevronRight size={20} color="#9CA3AF" />
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

// Time Picker Modal
interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: { hour: number; minute: number };
  onChange: (time: { hour: number; minute: number }) => void;
  title: string;
}

function TimePickerModal({
  visible,
  onClose,
  value,
  onChange,
  title,
}: TimePickerModalProps) {
  const [selectedHour, setSelectedHour] = useState(value.hour);
  const [selectedMinute, setSelectedMinute] = useState(value.minute);

  useEffect(() => {
    if (visible) {
      setSelectedHour(value.hour);
      setSelectedMinute(value.minute);
    }
  }, [visible, value]);

  const handleSave = () => {
    onChange({ hour: selectedHour, minute: selectedMinute });
    onClose();
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12} ${period}`;
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
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <Pressable
              onPress={onClose}
              className="py-1 px-2"
              accessibilityRole="button"
            >
              <Text className="text-base text-gray-500">Cancel</Text>
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <Pressable
              onPress={handleSave}
              className="py-1 px-2"
              accessibilityRole="button"
            >
              <Text className="text-base font-semibold text-primary">Save</Text>
            </Pressable>
          </View>

          {/* Time Selection */}
          <View className="flex-row py-4">
            {/* Hour Column */}
            <View className="flex-1 px-4">
              <Text className="text-sm font-semibold text-gray-500 mb-3 text-center">
                Hour
              </Text>
              <View className="max-h-[200px]">
                {hours.map((hour) => (
                  <Pressable
                    key={hour}
                    onPress={() => setSelectedHour(hour)}
                    className={`py-2 px-4 rounded-lg mb-1 ${
                      selectedHour === hour ? "bg-primary" : "active:bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`text-base text-center ${
                        selectedHour === hour
                          ? "text-white font-semibold"
                          : "text-gray-900"
                      }`}
                    >
                      {formatHour(hour)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Minute Column */}
            <View className="flex-1 px-4">
              <Text className="text-sm font-semibold text-gray-500 mb-3 text-center">
                Minute
              </Text>
              {minutes.map((minute) => (
                <Pressable
                  key={minute}
                  onPress={() => setSelectedMinute(minute)}
                  className={`py-2 px-4 rounded-lg mb-1 ${
                    selectedMinute === minute ? "bg-primary" : "active:bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-base text-center ${
                      selectedMinute === minute
                        ? "text-white font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    :{minute.toString().padStart(2, "0")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Safe area padding */}
          <View className="h-8" />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Day Picker Modal
interface DayPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: DayOfWeek;
  onChange: (day: DayOfWeek) => void;
}

function DayPickerModal({
  visible,
  onClose,
  value,
  onChange,
}: DayPickerModalProps) {
  const handleSelect = (day: DayOfWeek) => {
    onChange(day);
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
              Select Day
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Days */}
          <View className="py-2">
            {DAYS_OF_WEEK.map((day) => (
              <Pressable
                key={day.value}
                onPress={() => handleSelect(day.value)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                accessibilityRole="button"
              >
                <Text className="flex-1 text-base text-gray-900">
                  {day.label}
                </Text>
                {value === day.value && <Check size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Threshold Picker Modal
interface ThresholdPickerModalProps {
  visible: boolean;
  onClose: () => void;
  value: BudgetThreshold;
  onChange: (threshold: BudgetThreshold) => void;
}

function ThresholdPickerModal({
  visible,
  onClose,
  value,
  onChange,
}: ThresholdPickerModalProps) {
  const handleSelect = (threshold: BudgetThreshold) => {
    onChange(threshold);
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
              Alert Threshold
            </Text>
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-gray-100"
              accessibilityRole="button"
            >
              <X size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Thresholds */}
          <View className="py-2">
            {BUDGET_THRESHOLDS.map((threshold) => (
              <Pressable
                key={threshold.value}
                onPress={() => handleSelect(threshold.value)}
                className="flex-row items-center px-4 py-3 active:bg-gray-50"
                accessibilityRole="button"
              >
                <Text className="flex-1 text-base text-gray-900">
                  {threshold.label} of budget
                </Text>
                {value === threshold.value && <Check size={20} color="#3B82F6" />}
              </Pressable>
            ))}
          </View>

          {/* Description */}
          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-500">
              You'll be notified when your spending reaches this percentage of
              your budget.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function NotificationsScreen() {
  const [permissionStatus, setPermissionStatus] =
    useState<Notifications.PermissionStatus | null>(null);

  // Modal visibility states
  const [dailyTimePickerVisible, setDailyTimePickerVisible] = useState(false);
  const [weeklyTimePickerVisible, setWeeklyTimePickerVisible] = useState(false);
  const [weeklyDayPickerVisible, setWeeklyDayPickerVisible] = useState(false);
  const [thresholdPickerVisible, setThresholdPickerVisible] = useState(false);

  // Store
  const {
    notificationsEnabled,
    dailyReminderEnabled,
    dailyReminderTime,
    weeklySummaryEnabled,
    weeklySummaryDay,
    weeklySummaryTime,
    budgetAlertsEnabled,
    budgetAlertThreshold,
    transactionConfirmationsEnabled,
    setNotificationsEnabled,
    setDailyReminderEnabled,
    setDailyReminderTime,
    setWeeklySummaryEnabled,
    setWeeklySummaryDay,
    setWeeklySummaryTime,
    setBudgetAlertsEnabled,
    setBudgetAlertThreshold,
    setTransactionConfirmationsEnabled,
  } = useNotificationPreferencesStore();

  // Check permission status on mount
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermissions = async (): Promise<boolean> => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);

    if (status !== "granted") {
      Alert.alert(
        "Notifications Disabled",
        "To enable notifications, please go to Settings and allow notifications for Spend Manager.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
        ]
      );
      return false;
    }

    return true;
  };

  const handleMasterToggle = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestPermissions();
      if (!granted) {
        return;
      }
    }
    setNotificationsEnabled(enabled);
  };

  const handleToggleWithPermissionCheck = async (
    setter: (enabled: boolean) => void,
    enabled: boolean
  ) => {
    if (enabled && !notificationsEnabled) {
      const granted = await requestPermissions();
      if (!granted) {
        return;
      }
      setNotificationsEnabled(true);
    }
    setter(enabled);
  };

  const getDayLabel = (day: DayOfWeek) => {
    return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "Sunday";
  };

  const getThresholdLabel = (threshold: BudgetThreshold) => {
    return BUDGET_THRESHOLDS.find((t) => t.value === threshold)?.label || "80%";
  };

  return (
    <Screen scroll backgroundColor="#F9FAFB">
      <Header title="Notifications" showBack />

      <View className="pt-2 pb-8">
        {/* Master Toggle */}
        <SectionContainer>
          <ToggleItem
            title="Enable Notifications"
            subtitle="Receive alerts and reminders"
            value={notificationsEnabled}
            onValueChange={handleMasterToggle}
            testID="master-toggle"
          />
        </SectionContainer>

        {/* Permission Warning */}
        {permissionStatus === "denied" && (
          <View className="mx-4 mt-3 p-3 bg-warning-light rounded-xl">
            <Text className="text-sm text-warning">
              Notification permissions are disabled. Enable them in Settings to
              receive notifications.
            </Text>
          </View>
        )}

        {/* Reminders Section */}
        <SectionHeader title="Reminders" />
        <SectionContainer>
          <ToggleItem
            title="Daily Spending Reminder"
            subtitle="Get reminded to log your spending"
            value={dailyReminderEnabled}
            onValueChange={(enabled) =>
              handleToggleWithPermissionCheck(setDailyReminderEnabled, enabled)
            }
            disabled={!notificationsEnabled}
            testID="daily-reminder-toggle"
          />
          {dailyReminderEnabled && notificationsEnabled && (
            <>
              <Divider />
              <SelectionItem
                title="Time"
                value={formatTime(dailyReminderTime)}
                onPress={() => setDailyTimePickerVisible(true)}
                testID="daily-reminder-time"
              />
            </>
          )}
          <Divider />
          <ToggleItem
            title="Weekly Summary"
            subtitle="Review your weekly spending"
            value={weeklySummaryEnabled}
            onValueChange={(enabled) =>
              handleToggleWithPermissionCheck(setWeeklySummaryEnabled, enabled)
            }
            disabled={!notificationsEnabled}
            testID="weekly-summary-toggle"
          />
          {weeklySummaryEnabled && notificationsEnabled && (
            <>
              <Divider />
              <SelectionItem
                title="Day"
                value={getDayLabel(weeklySummaryDay)}
                onPress={() => setWeeklyDayPickerVisible(true)}
                testID="weekly-summary-day"
              />
              <Divider />
              <SelectionItem
                title="Time"
                value={formatTime(weeklySummaryTime)}
                onPress={() => setWeeklyTimePickerVisible(true)}
                testID="weekly-summary-time"
              />
            </>
          )}
        </SectionContainer>

        {/* Alerts Section */}
        <SectionHeader title="Alerts" />
        <SectionContainer>
          <ToggleItem
            title="Budget Alerts"
            subtitle="Get notified when approaching budget limits"
            value={budgetAlertsEnabled}
            onValueChange={(enabled) =>
              handleToggleWithPermissionCheck(setBudgetAlertsEnabled, enabled)
            }
            disabled={!notificationsEnabled}
            testID="budget-alerts-toggle"
          />
          {budgetAlertsEnabled && notificationsEnabled && (
            <>
              <Divider />
              <SelectionItem
                title="Alert at"
                value={getThresholdLabel(budgetAlertThreshold)}
                onPress={() => setThresholdPickerVisible(true)}
                testID="budget-alert-threshold"
              />
            </>
          )}
          <Divider />
          <ToggleItem
            title="Transaction Confirmations"
            subtitle="Confirm when transactions are saved"
            value={transactionConfirmationsEnabled}
            onValueChange={(enabled) =>
              handleToggleWithPermissionCheck(
                setTransactionConfirmationsEnabled,
                enabled
              )
            }
            disabled={!notificationsEnabled}
            testID="transaction-confirmations-toggle"
          />
        </SectionContainer>

        {/* Info text */}
        <View className="px-4 mt-4">
          <Text className="text-sm text-gray-500">
            Notification preferences are stored locally on this device. Actual
            notification scheduling will be implemented in a future update.
          </Text>
        </View>
      </View>

      {/* Modals */}
      <TimePickerModal
        visible={dailyTimePickerVisible}
        onClose={() => setDailyTimePickerVisible(false)}
        value={dailyReminderTime}
        onChange={setDailyReminderTime}
        title="Daily Reminder Time"
      />

      <TimePickerModal
        visible={weeklyTimePickerVisible}
        onClose={() => setWeeklyTimePickerVisible(false)}
        value={weeklySummaryTime}
        onChange={setWeeklySummaryTime}
        title="Weekly Summary Time"
      />

      <DayPickerModal
        visible={weeklyDayPickerVisible}
        onClose={() => setWeeklyDayPickerVisible(false)}
        value={weeklySummaryDay}
        onChange={setWeeklySummaryDay}
      />

      <ThresholdPickerModal
        visible={thresholdPickerVisible}
        onClose={() => setThresholdPickerVisible(false)}
        value={budgetAlertThreshold}
        onChange={setBudgetAlertThreshold}
      />
    </Screen>
  );
}
