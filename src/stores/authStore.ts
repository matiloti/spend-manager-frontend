import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { AuthUser, AuthTokens } from "@/types/auth";
import authService from "@/services/authService";

const REFRESH_TOKEN_KEY = "auth_refresh_token";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

interface AuthState {
  // State
  user: AuthUser | null;
  accessToken: string | null;
  tokenExpiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setAuth: (user: AuthUser, tokens: AuthTokens) => Promise<void>;
  clearAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  shouldRefreshToken: () => boolean;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  // Set authentication state after login/register
  setAuth: async (user: AuthUser, tokens: AuthTokens) => {
    // Calculate expiry time (expiresIn is in seconds)
    const expiresAt = Date.now() + tokens.expiresIn * 1000;

    // Store refresh token securely
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
    await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiresAt.toString());

    set({
      user,
      accessToken: tokens.accessToken,
      tokenExpiresAt: expiresAt,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  // Clear authentication state on logout
  clearAuth: async () => {
    // Delete stored tokens
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(TOKEN_EXPIRY_KEY);

    set({
      user: null,
      accessToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Initialize auth state on app start
  initializeAuth: async () => {
    const state = get();
    if (state.isInitialized) return;

    set({ isLoading: true });

    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        set({ isInitialized: true, isLoading: false });
        return;
      }

      // Check stored expiry
      const storedExpiry = await SecureStore.getItemAsync(TOKEN_EXPIRY_KEY);
      const tokenExpiresAt = storedExpiry ? parseInt(storedExpiry, 10) : 0;

      // Try to refresh the token
      const success = await get().refreshAccessToken();

      if (!success) {
        await get().clearAuth();
      }

      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      await get().clearAuth();
      set({ isInitialized: true, isLoading: false });
    }
  },

  // Refresh access token using stored refresh token
  refreshAccessToken: async (): Promise<boolean> => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        return false;
      }

      const response = await authService.refreshTokens(refreshToken);
      const { tokens } = response;

      // Calculate new expiry time
      const expiresAt = Date.now() + tokens.expiresIn * 1000;

      // Update stored refresh token (rotation)
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
      await SecureStore.setItemAsync(TOKEN_EXPIRY_KEY, expiresAt.toString());

      // Get user profile with new token
      // We need to temporarily set the token for the API call
      set({
        accessToken: tokens.accessToken,
        tokenExpiresAt: expiresAt,
      });

      const user = await authService.getProfile();

      set({
        user,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  },

  // Get current access token (or refresh if needed)
  getAccessToken: async (): Promise<string | null> => {
    const state = get();

    // If token is about to expire (within 60 seconds), refresh it
    if (state.shouldRefreshToken()) {
      const success = await state.refreshAccessToken();
      if (!success) {
        await state.clearAuth();
        return null;
      }
    }

    return get().accessToken;
  },

  // Get refresh token from secure storage
  getRefreshToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  // Check if token should be refreshed (expires within 60 seconds)
  shouldRefreshToken: (): boolean => {
    const state = get();
    if (!state.tokenExpiresAt || !state.accessToken) {
      return false;
    }
    // Refresh if expires within 60 seconds
    return state.tokenExpiresAt - Date.now() < 60000;
  },
}));

export default useAuthStore;
