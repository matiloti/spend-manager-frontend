import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function Header({
  title,
  showBack = false,
  onBackPress,
  rightElement,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between h-14 px-4 border-b border-gray-100 bg-white">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <Pressable
            onPress={handleBack}
            className="mr-3 p-1 -ml-1 rounded-full active:bg-gray-100"
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ChevronLeft size={24} color="#374151" />
          </Pressable>
        )}
        <Text
          className="text-xl font-bold text-gray-900 flex-1"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {rightElement && <View className="ml-3">{rightElement}</View>}
    </View>
  );
}

export default Header;
