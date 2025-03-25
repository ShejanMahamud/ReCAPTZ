import { ValidationRules } from '../types';

export const generateCaptcha = (
  type: 'numbers' | 'letters' | 'mixed',
  length: number,
  customCharacters?: string
): string => {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  
  let characters = customCharacters;
  if (!characters) {
    switch (type) {
      case 'numbers':
        characters = numbers;
        break;
      case 'letters':
        characters = letters;
        break;
      case 'mixed':
        characters = numbers + letters;
        break;
    }
  }

  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

export const validateCaptcha = (
  input: string,
  captcha: string,
  rules?: ValidationRules
): { isValid: boolean; error: string | null } => {
  // Early return if input is empty but required
  if (!input && rules?.required) {
    return { isValid: false, error: 'CAPTCHA response is required' };
  }

  // Length validation
  if (rules?.minLength && input.length < rules.minLength) {
    return { 
      isValid: false, 
      error: `Input must be at least ${rules.minLength} characters long` 
    };
  }

  if (rules?.maxLength && input.length > rules.maxLength) {
    return { 
      isValid: false, 
      error: `Input cannot be longer than ${rules.maxLength} characters` 
    };
  }

  // Character validation
  if (rules?.allowedCharacters) {
    const invalidChars = input.split('').filter(
      char => !rules.allowedCharacters?.includes(char)
    );
    if (invalidChars.length > 0) {
      return { 
        isValid: false, 
        error: `Invalid characters found: ${invalidChars.join(', ')}` 
      };
    }
  }

  // Custom validation
  if (rules?.customValidator) {
    const customResult = rules.customValidator(input);
    if (typeof customResult === 'string') {
      return { isValid: false, error: customResult };
    }
    if (!customResult) {
      return { isValid: false, error: 'Custom validation failed' };
    }
  }

  // Case sensitivity check
  const isValidMatch = rules?.caseSensitive 
    ? input === captcha
    : input.toLowerCase() === captcha.toLowerCase();

  return {
    isValid: isValidMatch,
    error: isValidMatch ? null : 'CAPTCHA does not match'
  };
};