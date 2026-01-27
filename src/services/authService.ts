import api from "./api";
import {
  AuthResponse,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutAllResponse,
  LogoutRequest,
  MessageResponse,
  RegisterRequest,
  ResetPasswordRequest,
  TokensResponse,
  UpdateProfileRequest,
} from "@/types/auth";

const AUTH_BASE_PATH = "/auth";

/**
 * Register a new user account
 * @param data - Registration data (email, password, optional name)
 * @returns Auth response with user and tokens
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(`${AUTH_BASE_PATH}/register`, data);
  return response.data;
}

/**
 * Login with email and password
 * @param data - Login credentials
 * @returns Auth response with user and tokens
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(`${AUTH_BASE_PATH}/login`, data);
  return response.data;
}

/**
 * Logout from current device
 * @param data - Logout request with refresh token
 */
export async function logout(data: LogoutRequest): Promise<void> {
  await api.post(`${AUTH_BASE_PATH}/logout`, data);
}

/**
 * Logout from all devices
 * @returns Response with number of revoked sessions
 */
export async function logoutAll(): Promise<LogoutAllResponse> {
  const response = await api.post<LogoutAllResponse>(`${AUTH_BASE_PATH}/logout-all`);
  return response.data;
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - Current refresh token
 * @returns New tokens
 */
export async function refreshTokens(refreshToken: string): Promise<TokensResponse> {
  const response = await api.post<TokensResponse>(`${AUTH_BASE_PATH}/refresh`, {
    refreshToken,
  });
  return response.data;
}

/**
 * Request password reset email
 * @param data - Email to send reset link
 * @returns Success message (always returns success for security)
 */
export async function forgotPassword(data: ForgotPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    `${AUTH_BASE_PATH}/forgot-password`,
    data
  );
  return response.data;
}

/**
 * Reset password using token from email
 * @param data - Reset token and new password
 * @returns Success message
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    `${AUTH_BASE_PATH}/reset-password`,
    data
  );
  return response.data;
}

/**
 * Get current user profile
 * @returns User profile
 */
export async function getProfile(): Promise<AuthUser> {
  const response = await api.get<AuthUser>(`${AUTH_BASE_PATH}/me`);
  return response.data;
}

/**
 * Update current user profile
 * @param data - Profile data to update
 * @returns Updated user profile
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<AuthUser> {
  const response = await api.put<AuthUser>(`${AUTH_BASE_PATH}/me`, data);
  return response.data;
}

/**
 * Change current user password
 * @param data - Current and new password
 * @returns Success message
 */
export async function changePassword(data: ChangePasswordRequest): Promise<MessageResponse> {
  const response = await api.post<MessageResponse>(
    `${AUTH_BASE_PATH}/change-password`,
    data
  );
  return response.data;
}

export default {
  register,
  login,
  logout,
  logoutAll,
  refreshTokens,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
};
