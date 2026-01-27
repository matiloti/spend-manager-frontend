import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/layout/Screen";
import { Button } from "@/components/ui";
import {
  PasswordInput,
  PasswordRequirements,
} from "@/components/auth";
import authService from "@/services/authService";
import { AUTH_ERROR_CODES, PASSWORD_REQUIREMENTS } from "@/types/auth";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react-native";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(
        PASSWORD_REQUIREMENTS.minLength,
        `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`
      )
      .refine(
        (val) => /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "Password must contain at least one number"
      )
      .refine(
        (val) =>
          new RegExp(
            `[${PASSWORD_REQUIREMENTS.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`
          ).test(val),
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type ResetState = "form" | "success" | "error";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [resetState, setResetState] = useState<ResetState>("form");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = watch("newPassword");

  // Validate token presence on mount
  useEffect(() => {
    if (!token) {
      setApiError("Invalid reset link. Please request a new password reset.");
      setResetState("error");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setApiError("Invalid reset link. Please request a new password reset.");
      setResetState("error");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      setResetState("success");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };

      switch (err.code) {
        case AUTH_ERROR_CODES.INVALID_RESET_TOKEN:
          setApiError(
            "This reset link is invalid. Please request a new password reset."
          );
          setResetState("error");
          break;
        case AUTH_ERROR_CODES.TOKEN_EXPIRED:
          setApiError(
            "This reset link has expired. Please request a new password reset."
          );
          setResetState("error");
          break;
        case AUTH_ERROR_CODES.TOKEN_ALREADY_USED:
          setApiError(
            "This reset link has already been used. Please request a new password reset."
          );
          setResetState("error");
          break;
        case AUTH_ERROR_CODES.PASSWORD_TOO_WEAK:
          setApiError(
            "Password does not meet requirements. Please check the requirements below."
          );
          setShowPasswordRequirements(true);
          break;
        default:
          setApiError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const navigateToLogin = () => {
    router.replace("/(auth)/login");
  };

  const navigateToForgotPassword = () => {
    router.replace("/(auth)/forgot-password");
  };

  // Success State
  if (resetState === "success") {
    return (
      <Screen>
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-income-light/30 rounded-full p-4 mb-6">
            <CheckCircle size={48} color="#22C55E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Password Reset Complete
          </Text>
          <Text className="text-base text-gray-600 text-center mb-8">
            Your password has been reset successfully. You can now sign in with
            your new password.
          </Text>
          <Button onPress={navigateToLogin} fullWidth testID="go-to-login">
            Sign In
          </Button>
        </View>
      </Screen>
    );
  }

  // Error State (invalid/expired token)
  if (resetState === "error" && !apiError?.includes("requirements")) {
    return (
      <Screen>
        <Pressable
          onPress={goBack}
          className="flex-row items-center py-4"
          testID="back-button"
        >
          <ArrowLeft size={24} color="#374151" />
          <Text className="text-gray-700 ml-1">Back</Text>
        </Pressable>

        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-expense-light/30 rounded-full p-4 mb-6">
            <XCircle size={48} color="#EF4444" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Reset Link Invalid
          </Text>
          <Text className="text-base text-gray-600 text-center mb-8">
            {apiError}
          </Text>
          <Button
            onPress={navigateToForgotPassword}
            fullWidth
            testID="request-new-reset"
          >
            Request New Reset Link
          </Button>
        </View>
      </Screen>
    );
  }

  // Form State
  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Back Button */}
        <Pressable
          onPress={goBack}
          className="flex-row items-center py-4"
          testID="back-button"
        >
          <ArrowLeft size={24} color="#374151" />
          <Text className="text-gray-700 ml-1">Back</Text>
        </Pressable>

        <View className="flex-1 justify-center py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </Text>
            <Text className="text-base text-gray-600 text-center px-4">
              Enter your new password below.
            </Text>
          </View>

          {/* Error Message */}
          {apiError && (
            <View className="bg-expense-light/30 border border-expense rounded-xl p-4 mb-6">
              <Text className="text-expense text-sm text-center">
                {apiError}
              </Text>
            </View>
          )}

          {/* Form */}
          <View className="gap-5">
            <View>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      if (!showPasswordRequirements && text.length > 0) {
                        setShowPasswordRequirements(true);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.newPassword?.message}
                    testID="reset-new-password-input"
                  />
                )}
              />
              <PasswordRequirements
                password={password}
                show={showPasswordRequirements}
              />
            </View>

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  testID="reset-confirm-password-input"
                />
              )}
            />

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                testID="reset-password-submit-button"
              >
                Reset Password
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
