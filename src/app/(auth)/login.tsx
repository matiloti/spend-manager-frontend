import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { useRouter, RelativePathString } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Screen } from "@/components/layout/Screen";
import { Input, Button } from "@/components/ui";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";
import { AUTH_ERROR_CODES } from "@/types/auth";
import { Mail, Check } from "lucide-react-native";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      await setAuth(response.user, response.tokens);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };

      // Handle specific error codes
      switch (err.code) {
        case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
          setApiError("Invalid email or password. Please try again.");
          break;
        case AUTH_ERROR_CODES.ACCOUNT_LOCKED:
          setApiError(
            "Your account has been temporarily locked due to too many failed attempts. Please try again in 15 minutes."
          );
          break;
        case AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED:
          setApiError("Too many login attempts. Please try again later.");
          break;
        default:
          setApiError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/(auth)/register");
  };

  const navigateToForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center py-8">
          {/* Header */}
          <View className="items-center mb-10">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Sign in to continue managing your finances
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
                  testID="login-email-input"
                  leftIcon={<Mail size={20} color="#6B7280" />}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  testID="login-password-input"
                />
              )}
            />

            {/* Remember Me & Forgot Password Row */}
            <View className="flex-row items-center justify-between">
              <Controller
                control={control}
                name="rememberMe"
                render={({ field: { onChange, value } }) => (
                  <Pressable
                    onPress={() => onChange(!value)}
                    className="flex-row items-center"
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: value }}
                    testID="remember-me-checkbox"
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                        value
                          ? "bg-primary-500 border-primary-500"
                          : "border-gray-300"
                      }`}
                    >
                      {value && <Check size={14} color="#FFFFFF" />}
                    </View>
                    <Text className="text-gray-700">Remember me</Text>
                  </Pressable>
                )}
              />

              <Pressable
                onPress={navigateToForgotPassword}
                testID="forgot-password-link"
              >
                <Text className="text-primary-500 font-medium">
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                testID="login-submit-button"
              >
                Sign In
              </Button>
            </View>
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Pressable onPress={navigateToRegister} testID="register-link">
              <Text className="text-primary-500 font-semibold">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
