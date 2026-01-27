import api from "@/services/api";
import authService from "@/services/authService";
import {
  AuthResponse,
  AuthUser,
  AuthTokens,
  TokensResponse,
  MessageResponse,
  LogoutAllResponse,
} from "@/types/auth";

// Mock the api module
jest.mock("@/services/api", () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

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
  expiresIn: 3600,
};

const mockAuthResponse: AuthResponse = {
  user: mockUser,
  tokens: mockTokens,
};

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("sends registration request with correct data", async () => {
      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const registerData = {
        email: "new@example.com",
        password: "Password123!",
        name: "New User",
      };

      const result = await authService.register(registerData);

      expect(mockApi.post).toHaveBeenCalledWith("/auth/register", registerData);
      expect(result).toEqual(mockAuthResponse);
    });

    it("handles registration without name", async () => {
      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const registerData = {
        email: "new@example.com",
        password: "Password123!",
      };

      await authService.register(registerData);

      expect(mockApi.post).toHaveBeenCalledWith("/auth/register", registerData);
    });

    it("propagates API errors", async () => {
      const apiError = {
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email already registered",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.register({
          email: "existing@example.com",
          password: "Password123!",
        })
      ).rejects.toEqual(apiError);
    });
  });

  describe("login", () => {
    it("sends login request with credentials", async () => {
      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const loginData = {
        email: "test@example.com",
        password: "Password123!",
      };

      const result = await authService.login(loginData);

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", loginData);
      expect(result).toEqual(mockAuthResponse);
    });

    it("includes rememberMe flag", async () => {
      mockApi.post.mockResolvedValue({ data: mockAuthResponse });

      const loginData = {
        email: "test@example.com",
        password: "Password123!",
        rememberMe: true,
      };

      await authService.login(loginData);

      expect(mockApi.post).toHaveBeenCalledWith("/auth/login", loginData);
    });

    it("handles invalid credentials error", async () => {
      const apiError = {
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "WrongPassword!",
        })
      ).rejects.toEqual(apiError);
    });

    it("handles account locked error", async () => {
      const apiError = {
        code: "ACCOUNT_LOCKED",
        message: "Account is locked due to too many failed attempts",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.login({
          email: "locked@example.com",
          password: "Password123!",
        })
      ).rejects.toEqual(apiError);
    });
  });

  describe("logout", () => {
    it("sends logout request with refresh token", async () => {
      mockApi.post.mockResolvedValue({ data: undefined });

      await authService.logout({ refreshToken: "refresh-token-to-invalidate" });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/logout", {
        refreshToken: "refresh-token-to-invalidate",
      });
    });

    it("handles already invalidated token", async () => {
      const apiError = {
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.logout({ refreshToken: "invalid-token" })
      ).rejects.toEqual(apiError);
    });
  });

  describe("logoutAll", () => {
    it("sends logout all request", async () => {
      const logoutAllResponse: LogoutAllResponse = {
        message: "Logged out from all devices",
        revokedSessions: 3,
      };
      mockApi.post.mockResolvedValue({ data: logoutAllResponse });

      const result = await authService.logoutAll();

      expect(mockApi.post).toHaveBeenCalledWith("/auth/logout-all");
      expect(result).toEqual(logoutAllResponse);
    });
  });

  describe("refreshTokens", () => {
    it("sends refresh token request", async () => {
      const tokensResponse: TokensResponse = {
        tokens: {
          ...mockTokens,
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
        },
      };
      mockApi.post.mockResolvedValue({ data: tokensResponse });

      const result = await authService.refreshTokens("current-refresh-token");

      expect(mockApi.post).toHaveBeenCalledWith("/auth/refresh", {
        refreshToken: "current-refresh-token",
      });
      expect(result).toEqual(tokensResponse);
    });

    it("handles token reuse detection", async () => {
      const apiError = {
        code: "TOKEN_REUSE_DETECTED",
        message: "Refresh token reuse detected, all sessions invalidated",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.refreshTokens("reused-token")
      ).rejects.toEqual(apiError);
    });

    it("handles expired refresh token", async () => {
      const apiError = {
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.refreshTokens("expired-token")
      ).rejects.toEqual(apiError);
    });
  });

  describe("forgotPassword", () => {
    it("sends forgot password request", async () => {
      const messageResponse: MessageResponse = {
        message: "If an account exists with this email, a reset link has been sent",
      };
      mockApi.post.mockResolvedValue({ data: messageResponse });

      const result = await authService.forgotPassword({ email: "test@example.com" });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/forgot-password", {
        email: "test@example.com",
      });
      expect(result).toEqual(messageResponse);
    });

    it("returns success even for non-existent email (security)", async () => {
      const messageResponse: MessageResponse = {
        message: "If an account exists with this email, a reset link has been sent",
      };
      mockApi.post.mockResolvedValue({ data: messageResponse });

      const result = await authService.forgotPassword({ email: "nonexistent@example.com" });

      expect(result).toEqual(messageResponse);
    });
  });

  describe("resetPassword", () => {
    it("sends reset password request with token and new password", async () => {
      const messageResponse: MessageResponse = {
        message: "Password has been reset successfully",
      };
      mockApi.post.mockResolvedValue({ data: messageResponse });

      const result = await authService.resetPassword({
        token: "reset-token-123",
        newPassword: "NewPassword123!",
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/reset-password", {
        token: "reset-token-123",
        newPassword: "NewPassword123!",
      });
      expect(result).toEqual(messageResponse);
    });

    it("handles invalid reset token", async () => {
      const apiError = {
        code: "INVALID_RESET_TOKEN",
        message: "Reset token is invalid",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.resetPassword({
          token: "invalid-token",
          newPassword: "NewPassword123!",
        })
      ).rejects.toEqual(apiError);
    });

    it("handles expired reset token", async () => {
      const apiError = {
        code: "TOKEN_EXPIRED",
        message: "Reset token has expired",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.resetPassword({
          token: "expired-token",
          newPassword: "NewPassword123!",
        })
      ).rejects.toEqual(apiError);
    });

    it("handles already used reset token", async () => {
      const apiError = {
        code: "TOKEN_ALREADY_USED",
        message: "Reset token has already been used",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.resetPassword({
          token: "used-token",
          newPassword: "NewPassword123!",
        })
      ).rejects.toEqual(apiError);
    });
  });

  describe("getProfile", () => {
    it("fetches user profile", async () => {
      mockApi.get.mockResolvedValue({ data: mockUser });

      const result = await authService.getProfile();

      expect(mockApi.get).toHaveBeenCalledWith("/auth/me");
      expect(result).toEqual(mockUser);
    });

    it("handles unauthorized error", async () => {
      const apiError = {
        code: "UNAUTHORIZED",
        message: "Access token is invalid or expired",
      };
      mockApi.get.mockRejectedValue(apiError);

      await expect(authService.getProfile()).rejects.toEqual(apiError);
    });
  });

  describe("updateProfile", () => {
    it("sends profile update request", async () => {
      const updatedUser: AuthUser = {
        ...mockUser,
        name: "Updated Name",
      };
      mockApi.put.mockResolvedValue({ data: updatedUser });

      const result = await authService.updateProfile({ name: "Updated Name" });

      expect(mockApi.put).toHaveBeenCalledWith("/auth/me", { name: "Updated Name" });
      expect(result).toEqual(updatedUser);
    });

    it("allows empty name to clear it", async () => {
      const updatedUser: AuthUser = {
        ...mockUser,
        name: undefined,
      };
      mockApi.put.mockResolvedValue({ data: updatedUser });

      const result = await authService.updateProfile({ name: "" });

      expect(mockApi.put).toHaveBeenCalledWith("/auth/me", { name: "" });
      expect(result).toEqual(updatedUser);
    });
  });

  describe("changePassword", () => {
    it("sends change password request", async () => {
      const messageResponse: MessageResponse = {
        message: "Password changed successfully",
      };
      mockApi.post.mockResolvedValue({ data: messageResponse });

      const result = await authService.changePassword({
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      });

      expect(mockApi.post).toHaveBeenCalledWith("/auth/change-password", {
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      });
      expect(result).toEqual(messageResponse);
    });

    it("handles incorrect current password", async () => {
      const apiError = {
        code: "INVALID_CURRENT_PASSWORD",
        message: "Current password is incorrect",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.changePassword({
          currentPassword: "WrongPassword!",
          newPassword: "NewPassword123!",
        })
      ).rejects.toEqual(apiError);
    });

    it("handles same password error", async () => {
      const apiError = {
        code: "SAME_PASSWORD",
        message: "New password must be different from current password",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.changePassword({
          currentPassword: "Password123!",
          newPassword: "Password123!",
        })
      ).rejects.toEqual(apiError);
    });

    it("handles weak password error", async () => {
      const apiError = {
        code: "PASSWORD_TOO_WEAK",
        message: "Password does not meet requirements",
      };
      mockApi.post.mockRejectedValue(apiError);

      await expect(
        authService.changePassword({
          currentPassword: "OldPassword123!",
          newPassword: "weak",
        })
      ).rejects.toEqual(apiError);
    });
  });
});
