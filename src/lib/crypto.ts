import { randomBytes, pbkdf2Sync } from "crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 32;
const ALGORITHM = "sha512";

/**
 * Securely hash a password using PBKDF2
 * @param password - Plain text password
 * @returns Hashed password with salt (format: salt:hash)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    ALGORITHM
  ).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored hash
 * @param password - Plain text password to verify
 * @param storedPassword - Stored password hash (format: salt:hash)
 * @returns Boolean indicating if password matches
 */
export function verifyPassword(
  password: string,
  storedPassword: string
): boolean {
  try {
    const [salt, hash] = storedPassword.split(":");
    if (!salt || !hash) {
      return false;
    }
    const verifyHash = pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      ALGORITHM
    ).toString("hex");
    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(hash, verifyHash);
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Generate a secure random token for email verification
 * @returns Random token string
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (password.length > 128) {
    return { valid: false, message: "Password must be less than 128 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }
  return { valid: true, message: "Password is valid" };
}

/**
 * Sanitize user input to prevent XSS
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}
