import React, { createContext, useContext, useState, useCallback } from 'react';
import { CaptchaContextType, CaptchaProps, ValidationRules } from '../types';
import { generateCaptcha, validateCaptcha } from '../utils/captchaGenerator';

const CaptchaContext = createContext<CaptchaContextType | null>(null);

export const CaptchaProvider: React.FC<{
  children: React.ReactNode;
  type?: CaptchaProps['type'];
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  onValidate?: (isValid: boolean) => void;
  maxAttempts: number | undefined;
}> = ({
  children,
  type = 'mixed',
  length = 6,
  caseSensitive = false,
  customCharacters,
  validationRules,
  onValidate,
  maxAttempts
}) => {
  const [captchaText, setCaptchaText] = useState(() =>
    generateCaptcha(type, length, customCharacters)
  );
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const refresh = useCallback(() => {
    const newCaptcha = generateCaptcha(type, length, customCharacters);
    setCaptchaText(newCaptcha);
    setUserInput('');
    setIsValid(false);
    setError(null);
    setAttempts(0);
  }, [type, length, customCharacters]);

  const validate = useCallback(() => {
    if (attempts >= maxAttempts) {
      refresh(); // Automatically refresh captcha when max attempts are reached
      return false;
    }
    const rules: ValidationRules = {
      ...validationRules,
      caseSensitive,
      allowedCharacters: customCharacters,
      minLength: length,
      maxLength: length,
    };

    const { isValid: valid, error: validationError } = validateCaptcha(userInput, captchaText, rules);
    setIsValid(valid);
    setError(validationError);
    if (!valid) {
      setAttempts(prev => prev + 1); // Increment attempts on invalid input
    }
    onValidate?.(valid);
    return valid;
  }, [userInput, captchaText, caseSensitive, customCharacters, length, validationRules, onValidate,attempts, maxAttempts, refresh]);

  return (
    <CaptchaContext.Provider
      value={{
        captchaText,
        userInput,
        isValid,
        error,
        refresh,
        setUserInput,
        validate,
        currentAttempts: attempts, // Provide current attempts
        maxAttempts, // Provide max attempts (now handled by the parent)
      }}
    >
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = () => {
  const context = useContext(CaptchaContext);
  if (!context) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return context;
};