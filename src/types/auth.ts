// Authentication types

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface TokensResponse {
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutAllResponse {
  message: string;
  revokedSessions: number;
}

export interface MessageResponse {
  message: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  timestamp?: string;
  path?: string;
}

export interface ApiErrorResponse {
  error: AuthError;
}

// Error codes from the backend
export const AUTH_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",
  PASSWORD_TOO_WEAK: "PASSWORD_TOO_WEAK",
  SAME_PASSWORD: "SAME_PASSWORD",
  INVALID_RESET_TOKEN: "INVALID_RESET_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_ALREADY_USED: "TOKEN_ALREADY_USED",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
  INVALID_CURRENT_PASSWORD: "INVALID_CURRENT_PASSWORD",
  TOKEN_REUSE_DETECTED: "TOKEN_REUSE_DETECTED",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

// Password requirements for client-side validation
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  specialChars: '!@#$%^&*(),.?":{}|<>',
};
