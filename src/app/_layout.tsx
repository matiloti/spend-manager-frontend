import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="accounts/index" options={{ headerShown: false }} />
          <Stack.Screen name="accounts/create" options={{ headerShown: false }} />
          <Stack.Screen name="accounts/[id]/index" options={{ headerShown: false }} />
          <Stack.Screen name="accounts/[id]/edit" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
