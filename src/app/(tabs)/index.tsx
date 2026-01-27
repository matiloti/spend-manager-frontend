import { View, Text, SafeAreaView } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Spend Manager
        </Text>
        <Text className="text-gray-500 text-center">
          Your personal expense tracker
        </Text>
        <View className="mt-8 p-4 bg-primary-50 rounded-xl">
          <Text className="text-primary-600 font-medium text-center">
            Home screen coming soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
