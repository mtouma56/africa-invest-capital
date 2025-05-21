import { validateEmail, validatePassword, validatePhoneNumber } from '../validators.js';

describe('validateEmail', () => {
  test('returns true for valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@sub.domain.co')).toBe(true);
  });

  test('returns false for invalid emails', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
  });
});

describe('validatePassword', () => {
  test('returns true for valid passwords', () => {
    expect(validatePassword('Password1')).toBe(true);
    expect(validatePassword('AnotherPass9')).toBe(true);
  });

  test('returns false for passwords missing criteria', () => {
    expect(validatePassword('password')).toBe(false); // no uppercase or digit
    expect(validatePassword('PASSWORD1')).toBe(false); // no lowercase
    expect(validatePassword('Pass1')).toBe(false); // less than 8 characters
  });
});

describe('validatePhoneNumber', () => {
  test('returns true for valid phone numbers', () => {
    expect(validatePhoneNumber('0123456789')).toBe(true);
    expect(validatePhoneNumber('+33 123456789')).toBe(true);
  });

  test('returns false for invalid phone numbers', () => {
    expect(validatePhoneNumber('12345')).toBe(false); // too short
    expect(validatePhoneNumber('phone123')).toBe(false); // contains letters
  });
});