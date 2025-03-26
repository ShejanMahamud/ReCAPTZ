export type CaptchaType = 'numbers' | 'letters' | 'mixed';

export type CaptchaTheme = 'light' | 'dark' | 'auto';

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: string;
  required?: boolean;
  caseSensitive?: boolean;
  customValidator?: (value: string) => boolean | string;
}

export interface CaptchaProps {
  type?: CaptchaType;
  length?: number;
  inputButtonStyle?: string;
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  refreshable?: boolean;
  caseSensitive?: boolean;
  customCharacters?: string;
  customStyles?: React.CSSProperties;
  validationRules?: ValidationRules;
  errorMessage?: string;
  darkMode?: boolean;
  theme?: CaptchaTheme;
  showSuccessAnimation?: boolean;
  autoFocus?: boolean;
  refreshInterval?: number;
  maxAttempts?: number;
  loadingComponent?: React.ReactNode;
  successComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}