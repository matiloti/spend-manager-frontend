import React from "react";
import { View, Text } from "react-native";
import { Check, X } from "lucide-react-native";
import { PASSWORD_REQUIREMENTS } from "@/types/auth";

interface PasswordRequirementsProps {
  password: string;
  show?: boolean;
}

interface RequirementProps {
  met: boolean;
  text: string;
}

function Requirement({ met, text }: RequirementProps) {
  return (
    <View className="flex-row items-center gap-2 py-0.5">
      {met ? (
        <Check size={14} color="#22C55E" />
      ) : (
        <X size={14} color="#9CA3AF" />
      )}
      <Text
        className={`text-sm ${met ? "text-green-600" : "text-gray-500"}`}
      >
        {text}
      </Text>
    </View>
  );
}

export function validatePassword(password: string): {
  isValid: boolean;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: new RegExp(
      `[${PASSWORD_REQUIREMENTS.specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}]`
    ).test(password),
  };

  const isValid = Object.values(requirements).every(Boolean);

  return { isValid, requirements };
}

export function PasswordRequirements({
  password,
  show = true,
}: PasswordRequirementsProps) {
  if (!show) return null;

  const { requirements } = validatePassword(password);

  return (
    <View className="mt-2 px-1">
      <Text className="text-sm font-medium text-gray-700 mb-1">
        Password requirements:
      </Text>
      <Requirement
        met={requirements.minLength}
        text={`At least ${PASSWORD_REQUIREMENTS.minLength} characters`}
      />
      <Requirement
        met={requirements.hasUppercase}
        text="At least one uppercase letter"
      />
      <Requirement
        met={requirements.hasLowercase}
        text="At least one lowercase letter"
      />
      <Requirement met={requirements.hasNumber} text="At least one number" />
      <Requirement
        met={requirements.hasSpecialChar}
        text="At least one special character"
      />
    </View>
  );
}

export default PasswordRequirements;
