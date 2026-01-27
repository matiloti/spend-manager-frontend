import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/layout/Screen";
import { Input, Button } from "@/components/ui";
import authService from "@/services/authService";
import { AUTH_ERROR_CODES } from "@/types/auth";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react-native";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      await authService.forgotPassword({ email: data.email });
      setIsSuccess(true);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };

      if (err.code === AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED) {
        setApiError("Too many reset requests. Please try again later.");
      } else {
        // Backend always returns success for security
        // But we might have validation or network errors
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
    router.push("/(auth)/login");
  };

  if (isSuccess) {
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
          <View className="bg-income-light/30 rounded-full p-4 mb-6">
            <CheckCircle size={48} color="#22C55E" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Check Your Email
          </Text>
          <Text className="text-base text-gray-600 text-center mb-8">
            If an account exists with{" "}
            <Text className="font-semibold">{getValues("email")}</Text>, we've
            sent a password reset link. Please check your inbox and spam folder.
          </Text>
          <Button onPress={navigateToLogin} fullWidth testID="back-to-login">
            Back to Sign In
          </Button>
        </View>
      </Screen>
    );
  }

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
              Forgot Password?
            </Text>
            <Text className="text-base text-gray-600 text-center px-4">
              Enter your email address and we'll send you a link to reset your
              password.
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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  testID="forgot-password-email-input"
                  leftIcon={<Mail size={20} color="#6B7280" />}
                />
              )}
            />

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                testID="forgot-password-submit-button"
              >
                Send Reset Link
              </Button>
            </View>
          </View>

          {/* Back to Login Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Remember your password? </Text>
            <Pressable onPress={navigateToLogin} testID="login-link">
              <Text className="text-primary-500 font-semibold">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
