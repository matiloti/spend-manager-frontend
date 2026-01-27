import React, { useState } from "react";
import { Pressable } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Input } from "@/components/ui/Input";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  testID?: string;
  autoFocus?: boolean;
}

export function PasswordInput({
  label = "Password",
  placeholder = "Enter your password",
  value,
  onChangeText,
  onBlur,
  error,
  helperText,
  testID = "password-input",
  autoFocus = false,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      secureTextEntry={!isVisible}
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="password"
      testID={testID}
      autoFocus={autoFocus}
      rightIcon={
        <Pressable
          onPress={toggleVisibility}
          accessibilityLabel={isVisible ? "Hide password" : "Show password"}
          hitSlop={8}
        >
          {isVisible ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </Pressable>
      }
    />
  );
}

export default PasswordInput;
