import crypto from 'crypto';

/**
 * Generate a random string with specified length and character set
 * @param length - Length of the random string (default: 16)
 * @param charset - Character set to use (default: alphanumeric)
 * @returns Random string
 */
export const generateRandomString = (
    length: number = 16,
    charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
    let result = '';
    const charactersLength = charset.length;

    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

/**
 * Generate a cryptographically secure random string
 * @param length - Length of the random string (default: 16)
 * @returns Cryptographically secure random string
 */
export const generateSecureRandomString = (length: number = 16): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomBytes = crypto.randomBytes(length);
    let result = '';

    for (let i = 0; i < length; i++) {
        result += charset[randomBytes[i]! % charset.length];
    }

    return result;
};

/**
 * Generate a random string with only letters
 * @param length - Length of the random string (default: 16)
 * @param uppercase - Include uppercase letters (default: true)
 * @param lowercase - Include lowercase letters (default: true)
 * @returns Random alphabetic string
 */
export const generateRandomAlpha = (
    length: number = 16 ,
    uppercase: boolean = true,
    lowercase: boolean = true
): string => {
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';

    if (!charset) {
        throw new Error('At least one character type must be enabled');
    }

    return generateRandomString(length, charset);
};

/**
 * Generate a random string with only numbers
 * @param length - Length of the random string (default: 16)
 * @returns Random numeric string
 */
export const generateRandomNumeric = (length: number = 16): string => {
    return generateRandomString(length, '0123456789');
};

/**
 * Generate a random hex string
 * @param length - Length of the random string (default: 16)
 * @returns Random hexadecimal string
 */
export const generateRandomHex = (length: number = 16): string => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

/**
 * Generate a random URL-safe string (base64url)
 * @param length - Length of the random string (default: 16)
 * @returns Random URL-safe string
 */
export const generateRandomUrlSafe = (length: number = 16): string => {
    return crypto.randomBytes(Math.ceil(length * 3 / 4))
        .toString('base64url')
        .slice(0, length);
};

/**
 * Generate a random UUID v4
 * @returns Random UUID v4 string
 */
export const generateRandomUUID = (): string => {
    return crypto.randomUUID();
};

// Shorter aliases for convenience
export const randomString = generateRandomString;
export const randomSecureString = generateSecureRandomString;
export const randomAlpha = generateRandomAlpha;
export const randomNumeric = generateRandomNumeric;
export const randomHex = generateRandomHex;
export const randomUrlSafe = generateRandomUrlSafe;
export const randomUUID = generateRandomUUID;