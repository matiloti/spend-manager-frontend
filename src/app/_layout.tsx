import "@/global.css";

import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/stores/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isInitialized || isNavigating) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and not on auth screen - redirect to login
      setIsNavigating(true);
      router.replace("/(auth)/login");
      setTimeout(() => setIsNavigating(false), 500);
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on auth screen - redirect to home
      setIsNavigating(true);
      router.replace("/(tabs)");
      setTimeout(() => setIsNavigating(false), 500);
    }
  }, [isAuthenticated, isInitialized, segments, router, isNavigating]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="accounts/index" options={{ headerShown: false }} />
            <Stack.Screen name="accounts/create" options={{ headerShown: false }} />
            <Stack.Screen name="accounts/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen name="accounts/[id]/edit" options={{ headerShown: false }} />
            <Stack.Screen name="categories/index" options={{ headerShown: false }} />
            <Stack.Screen name="categories/create" options={{ headerShown: false }} />
            <Stack.Screen name="categories/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen name="categories/[id]/edit" options={{ headerShown: false }} />
            <Stack.Screen name="transactions/index" options={{ headerShown: false }} />
            <Stack.Screen name="transactions/create" options={{ headerShown: false }} />
            <Stack.Screen name="transactions/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen name="transactions/[id]/edit" options={{ headerShown: false }} />
            <Stack.Screen name="settings/notifications" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
