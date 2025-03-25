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
}> = ({
  children,
  type = 'mixed',
  length = 6,
  caseSensitive = false,
  customCharacters,
  validationRules,
  onValidate
}) => {
  const [captchaText, setCaptchaText] = useState(() =>
    generateCaptcha(type, length, customCharacters)
  );
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const newCaptcha = generateCaptcha(type, length, customCharacters);
    setCaptchaText(newCaptcha);
    setUserInput('');
    setIsValid(false);
    setError(null);
  }, [type, length, customCharacters]);

  const validate = useCallback(() => {
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
    onValidate?.(valid);
    return valid;
  }, [userInput, captchaText, caseSensitive, customCharacters, length, validationRules, onValidate]);

  return (
    <CaptchaContext.Provider
      value={{
        captchaText,
        userInput,
        isValid,
        error,
        refresh,
        setUserInput,
        validate
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