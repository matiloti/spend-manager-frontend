import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { X, Eye, EyeOff, Check, AlertCircle } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import authService from "@/services/authService";
import { AUTH_ERROR_CODES, PASSWORD_REQUIREMENTS } from "@/types/auth";
import { AxiosError } from "axios";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PasswordRequirement {
  id: string;
  label: string;
  check: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    check: (p) => p.length >= PASSWORD_REQUIREMENTS.minLength,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter",
    check: (p) => /[A-Z]/.test(p),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter",
    check: (p) => /[a-z]/.test(p),
  },
  {
    id: "number",
    label: "At least one number",
    check: (p) => /[0-9]/.test(p),
  },
  {
    id: "special",
    label: "At least one special character",
    check: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const allRequirementsMet = passwordRequirements.every((req) =>
    req.check(newPassword)
  );
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== "";

  const canSubmit =
    currentPassword.trim() !== "" &&
    allRequirementsMet &&
    passwordsMatch &&
    !loading;

  const handleChangePassword = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully.",
        [{ text: "OK", onPress: handleClose }]
      );
    } catch (err) {
      const axiosError = err as AxiosError<{ error: { code: string; message: string } }>;
      const errorCode = axiosError.response?.data?.error?.code;
      const errorMessage = axiosError.response?.data?.error?.message;

      if (errorCode === AUTH_ERROR_CODES.INVALID_CURRENT_PASSWORD) {
        setError("Current password is incorrect");
      } else if (errorCode === AUTH_ERROR_CODES.SAME_PASSWORD) {
        setError("New password must be different from current password");
      } else if (errorCode === AUTH_ERROR_CODES.PASSWORD_TOO_WEAK) {
        setError("New password does not meet requirements");
      } else {
        setError(errorMessage || "Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
          <Pressable
            onPress={handleClose}
            className="p-2 -ml-2 rounded-full active:bg-gray-100"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={24} color="#6B7280" />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-900">
            Change Password
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-4 pt-6">
          {/* Error Message */}
          {error && (
            <View className="flex-row items-center bg-red-50 rounded-xl p-4 mb-6">
              <AlertCircle size={20} color="#EF4444" />
              <Text className="flex-1 ml-3 text-red-600 text-sm">{error}</Text>
            </View>
          )}

          {/* Current Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Current Password
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-3 text-base text-gray-900"
                autoCapitalize="none"
                autoCorrect={false}
                testID="current-password-input"
              />
              <Pressable
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                className="p-2"
                accessibilityRole="button"
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </Pressable>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              New Password
            </Text>
            <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-4">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-3 text-base text-gray-900"
                autoCapitalize="none"
                autoCorrect={false}
                testID="new-password-input"
              />
              <Pressable
                onPress={() => setShowNewPassword(!showNewPassword)}
                className="p-2"
                accessibilityRole="button"
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </Pressable>
            </View>
          </View>

          {/* Password Requirements */}
          <View className="mb-6 bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Password Requirements
            </Text>
            {passwordRequirements.map((req) => {
              const isMet = req.check(newPassword);
              return (
                <View key={req.id} className="flex-row items-center mb-2">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      isMet ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {isMet && <Check size={12} color="#FFFFFF" />}
                  </View>
                  <Text
                    className={`ml-3 text-sm ${
                      isMet ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {req.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </Text>
            <View
              className={`flex-row items-center bg-white border rounded-xl px-4 ${
                confirmPassword && !passwordsMatch
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                className="flex-1 py-3 text-base text-gray-900"
                autoCapitalize="none"
                autoCorrect={false}
                testID="confirm-password-input"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-2"
                accessibilityRole="button"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </Pressable>
            </View>
            {confirmPassword && !passwordsMatch && (
              <Text className="text-sm text-red-500 mt-2">
                Passwords do not match
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 border-t border-gray-100">
          <Button
            onPress={handleChangePassword}
            disabled={!canSubmit}
            loading={loading}
            fullWidth
          >
            Change Password
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ChangePasswordModal;
