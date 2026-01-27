import { useAuthStore } from "@/stores/authStore";
import * as SecureStore from "expo-secure-store";
import authService from "@/services/authService";
import { AuthUser, AuthTokens } from "@/types/auth";

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock authService
jest.mock("@/services/authService", () => ({
  refreshTokens: jest.fn(),
  getProfile: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;
const mockAuthService = authService as jest.Mocked<typeof authService>;

const mockUser: AuthUser = {
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2026-01-01T00:00:00Z",
};

const mockTokens: AuthTokens = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  tokenType: "Bearer",
  expiresIn: 3600, // 1 hour
};

describe("authStore", () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("has null user by default", () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });

    it("has null accessToken by default", () => {
      const state = useAuthStore.getState();
      expect(state.accessToken).toBeNull();
    });

    it("has isAuthenticated false by default", () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it("has isLoading false by default", () => {
      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
    });

    it("has isInitialized false by default", () => {
      const state = useAuthStore.getState();
      expect(state.isInitialized).toBe(false);
    });
  });

  describe("setAuth", () => {
    it("sets user and tokens correctly", async () => {
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("stores refresh token in SecureStore", async () => {
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_refresh_token",
        mockTokens.refreshToken
      );
    });

    it("stores token expiry in SecureStore", async () => {
      const beforeTime = Date.now();
      await useAuthStore.getState().setAuth(mockUser, mockTokens);
      const afterTime = Date.now();

      // Verify expiry was stored
      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_token_expiry",
        expect.any(String)
      );

      // Verify expiry time is approximately correct (within 1 second)
      const storedExpiry = parseInt(
        (mockSecureStore.setItemAsync as jest.Mock).mock.calls[1][1],
        10
      );
      const expectedExpiry = beforeTime + mockTokens.expiresIn * 1000;
      expect(storedExpiry).toBeGreaterThanOrEqual(expectedExpiry);
      expect(storedExpiry).toBeLessThanOrEqual(afterTime + mockTokens.expiresIn * 1000);
    });

    it("calculates tokenExpiresAt from expiresIn", async () => {
      const beforeTime = Date.now();
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      const state = useAuthStore.getState();
      const expectedExpiry = beforeTime + mockTokens.expiresIn * 1000;

      expect(state.tokenExpiresAt).toBeGreaterThanOrEqual(expectedExpiry);
      expect(state.tokenExpiresAt).toBeLessThanOrEqual(
        expectedExpiry + 100 // Allow 100ms tolerance
      );
    });
  });

  describe("updateUser", () => {
    it("updates user name while preserving other fields", async () => {
      // First set auth
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      // Update only the name
      useAuthStore.getState().updateUser({ name: "Updated Name" });

      const state = useAuthStore.getState();
      expect(state.user).toEqual({
        ...mockUser,
        name: "Updated Name",
      });
    });

    it("updates user email while preserving other fields", async () => {
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      useAuthStore.getState().updateUser({ email: "updated@example.com" });

      const state = useAuthStore.getState();
      expect(state.user?.email).toBe("updated@example.com");
      expect(state.user?.name).toBe(mockUser.name);
    });

    it("updates multiple fields at once", async () => {
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      useAuthStore.getState().updateUser({
        name: "New Name",
        updatedAt: "2026-01-27T12:00:00Z",
      });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe("New Name");
      expect(state.user?.updatedAt).toBe("2026-01-27T12:00:00Z");
    });

    it("does nothing if user is null", () => {
      // User is null by default
      useAuthStore.getState().updateUser({ name: "Should Not Set" });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });

    it("does not affect authentication state", async () => {
      await useAuthStore.getState().setAuth(mockUser, mockTokens);

      useAuthStore.getState().updateUser({ name: "New Name" });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe(mockTokens.accessToken);
    });
  });

  describe("clearAuth", () => {
    it("clears user and tokens", async () => {
      // First set auth
      await useAuthStore.getState().setAuth(mockUser, mockTokens);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // Then clear
      await useAuthStore.getState().clearAuth();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
      expect(state.tokenExpiresAt).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it("deletes tokens from SecureStore", async () => {
      await useAuthStore.getState().clearAuth();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_refresh_token");
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token_expiry");
    });
  });

  describe("setLoading", () => {
    it("sets loading state to true", () => {
      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
    });

    it("sets loading state to false", () => {
      useAuthStore.getState().setLoading(true);
      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("initializeAuth", () => {
    it("sets isInitialized to true after initialization", async () => {
      await useAuthStore.getState().initializeAuth();
      expect(useAuthStore.getState().isInitialized).toBe(true);
    });

    it("does not run twice if already initialized", async () => {
      await useAuthStore.getState().initializeAuth();
      const firstCallCount = (mockSecureStore.getItemAsync as jest.Mock).mock.calls.length;

      await useAuthStore.getState().initializeAuth();
      expect((mockSecureStore.getItemAsync as jest.Mock).mock.calls.length).toBe(firstCallCount);
    });

    it("does not authenticate if no refresh token stored", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isInitialized).toBe(true);
    });

    it("refreshes token if refresh token is stored", async () => {
      mockSecureStore.getItemAsync.mockImplementation((key: string) => {
        if (key === "auth_refresh_token") return Promise.resolve("stored-refresh-token");
        if (key === "auth_token_expiry") return Promise.resolve(String(Date.now() + 3600000));
        return Promise.resolve(null);
      });

      mockAuthService.refreshTokens.mockResolvedValue({
        tokens: mockTokens,
      });
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      await useAuthStore.getState().initializeAuth();

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith("stored-refresh-token");
    });

    it("clears auth if token refresh fails", async () => {
      mockSecureStore.getItemAsync.mockImplementation((key: string) => {
        if (key === "auth_refresh_token") return Promise.resolve("stored-refresh-token");
        return Promise.resolve(null);
      });

      mockAuthService.refreshTokens.mockRejectedValue(new Error("Refresh failed"));

      await useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isInitialized).toBe(true);
      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe("refreshAccessToken", () => {
    it("returns false if no refresh token stored", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBe(false);
    });

    it("updates tokens on successful refresh", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("stored-refresh-token");
      mockAuthService.refreshTokens.mockResolvedValue({
        tokens: mockTokens,
      });
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBe(true);
      const state = useAuthStore.getState();
      expect(state.accessToken).toBe(mockTokens.accessToken);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it("stores new refresh token after rotation", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("old-refresh-token");
      mockAuthService.refreshTokens.mockResolvedValue({
        tokens: { ...mockTokens, refreshToken: "new-refresh-token" },
      });
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      await useAuthStore.getState().refreshAccessToken();

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        "auth_refresh_token",
        "new-refresh-token"
      );
    });

    it("returns false on refresh error", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("stored-refresh-token");
      mockAuthService.refreshTokens.mockRejectedValue(new Error("Refresh failed"));

      const result = await useAuthStore.getState().refreshAccessToken();

      expect(result).toBe(false);
    });
  });

  describe("getAccessToken", () => {
    it("returns current access token if not expiring soon", async () => {
      // Set up authenticated state with token not expiring soon
      useAuthStore.setState({
        accessToken: "current-token",
        tokenExpiresAt: Date.now() + 120000, // 2 minutes from now
        isAuthenticated: true,
      });

      const token = await useAuthStore.getState().getAccessToken();

      expect(token).toBe("current-token");
      expect(mockAuthService.refreshTokens).not.toHaveBeenCalled();
    });

    it("refreshes token if expiring within 60 seconds", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("stored-refresh-token");
      mockAuthService.refreshTokens.mockResolvedValue({
        tokens: { ...mockTokens, accessToken: "new-access-token" },
      });
      mockAuthService.getProfile.mockResolvedValue(mockUser);

      // Set up state with token expiring soon
      useAuthStore.setState({
        accessToken: "expiring-token",
        tokenExpiresAt: Date.now() + 30000, // 30 seconds from now
        isAuthenticated: true,
      });

      const token = await useAuthStore.getState().getAccessToken();

      expect(mockAuthService.refreshTokens).toHaveBeenCalled();
      expect(token).toBe("new-access-token");
    });

    it("returns null and clears auth if refresh fails", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("stored-refresh-token");
      mockAuthService.refreshTokens.mockRejectedValue(new Error("Refresh failed"));

      // Set up state with token expiring soon
      useAuthStore.setState({
        accessToken: "expiring-token",
        tokenExpiresAt: Date.now() + 30000,
        isAuthenticated: true,
      });

      const token = await useAuthStore.getState().getAccessToken();

      expect(token).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe("getRefreshToken", () => {
    it("retrieves refresh token from SecureStore", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue("stored-refresh-token");

      const token = await useAuthStore.getState().getRefreshToken();

      expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("auth_refresh_token");
      expect(token).toBe("stored-refresh-token");
    });

    it("returns null if no refresh token stored", async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      const token = await useAuthStore.getState().getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe("shouldRefreshToken", () => {
    it("returns false if no token exists", () => {
      useAuthStore.setState({
        accessToken: null,
        tokenExpiresAt: null,
      });

      expect(useAuthStore.getState().shouldRefreshToken()).toBe(false);
    });

    it("returns false if no expiry set", () => {
      useAuthStore.setState({
        accessToken: "some-token",
        tokenExpiresAt: null,
      });

      expect(useAuthStore.getState().shouldRefreshToken()).toBe(false);
    });

    it("returns false if token expires in more than 60 seconds", () => {
      useAuthStore.setState({
        accessToken: "some-token",
        tokenExpiresAt: Date.now() + 120000, // 2 minutes
      });

      expect(useAuthStore.getState().shouldRefreshToken()).toBe(false);
    });

    it("returns true if token expires within 60 seconds", () => {
      useAuthStore.setState({
        accessToken: "some-token",
        tokenExpiresAt: Date.now() + 30000, // 30 seconds
      });

      expect(useAuthStore.getState().shouldRefreshToken()).toBe(true);
    });

    it("returns true if token is already expired", () => {
      useAuthStore.setState({
        accessToken: "some-token",
        tokenExpiresAt: Date.now() - 1000, // Already expired
      });

      expect(useAuthStore.getState().shouldRefreshToken()).toBe(true);
    });
  });
});
