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
import {
  PasswordInput,
  PasswordRequirements,
  validatePassword,
} from "@/components/auth";
import { useAuthStore } from "@/stores/authStore";
import authService from "@/services/authService";
import { AUTH_ERROR_CODES, PASSWORD_REQUIREMENTS } from "@/types/auth";
import { Mail, User, ArrowLeft } from "lucide-react-native";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    name: z
      .string()
      .max(100, "Name must be 100 characters or less")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    password: z
      .string()
      .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      await setAuth(response.user, response.tokens);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string; details?: Array<{ field: string; message: string }> };

      // Handle specific error codes
      switch (err.code) {
        case AUTH_ERROR_CODES.EMAIL_ALREADY_EXISTS:
          setApiError(
            "An account with this email already exists. Please sign in instead."
          );
          break;
        case AUTH_ERROR_CODES.PASSWORD_TOO_WEAK:
          setApiError(
            "Password does not meet requirements. Please check the requirements below."
          );
          setShowPasswordRequirements(true);
          break;
        case AUTH_ERROR_CODES.VALIDATION_ERROR:
          if (err.details && err.details.length > 0) {
            setApiError(err.details.map((d) => d.message).join(". "));
          } else {
            setApiError("Please check your input and try again.");
          }
          break;
        case AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED:
          setApiError("Too many registration attempts. Please try again later.");
          break;
        default:
          setApiError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.back();
  };

  const goBack = () => {
    router.back();
  };

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

        <View className="flex-1 py-4">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-base text-gray-600 text-center">
              Start tracking your finances today
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
                  testID="register-email-input"
                  leftIcon={<Mail size={20} color="#6B7280" />}
                />
              )}
            />

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name (Optional)"
                  placeholder="Enter your name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="name"
                  maxLength={100}
                  testID="register-name-input"
                  leftIcon={<User size={20} color="#6B7280" />}
                />
              )}
            />

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <PasswordInput
                    label="Password"
                    placeholder="Create a password"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      if (!showPasswordRequirements && text.length > 0) {
                        setShowPasswordRequirements(true);
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    testID="register-password-input"
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
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  testID="register-confirm-password-input"
                />
              )}
            />

            {/* Submit Button */}
            <View className="mt-4">
              <Button
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                testID="register-submit-button"
              >
                Create Account
              </Button>
            </View>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Pressable onPress={navigateToLogin} testID="login-link">
              <Text className="text-primary-500 font-semibold">Sign in</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
