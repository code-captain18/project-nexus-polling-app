// Validation utilities

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain an uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain a lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain a number');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Validate text input length
 */
export function isValidLength(
    text: string,
    min: number,
    max: number
): boolean {
    const length = text.trim().length;
    return length >= min && length <= max;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
}
