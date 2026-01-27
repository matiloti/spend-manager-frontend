import React from "react";
import { View, Text, Pressable } from "react-native";
import { Check } from "lucide-react-native";
import { PRESET_COLORS } from "@/constants/colors";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  colors?: string[];
}

export function ColorPicker({
  value,
  onChange,
  label,
  colors = PRESET_COLORS,
}: ColorPickerProps) {
  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-3">{label}</Text>
      )}
      <View className="flex-row flex-wrap gap-3">
        {colors.map((color) => (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              value === color ? "border-2 border-gray-900" : "border border-gray-200"
            }`}
            style={{ backgroundColor: color }}
            accessibilityLabel={`Select color ${color}`}
            accessibilityRole="button"
            accessibilityState={{ selected: value === color }}
          >
            {value === color && <Check size={20} color="#FFFFFF" />}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default ColorPicker;
