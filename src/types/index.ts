export type CaptchaType = "numbers" | "letters" | "mixed";

export type CaptchaTheme = "light" | "dark" | "auto";

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: string;
  required?: boolean;
  caseSensitive?: boolean;
  customValidator?: (value: string) => boolean | string;
}

export interface CaptchaI18n {
  securityCheck?: string;
  listenToCaptcha?: string;
  refreshCaptcha?: string;
  inputPlaceholder?: string;
  pressSpaceToHearCode?: string;
  enterToValidate?: string;
  escToClear?: string;
  verifyButton?: string;
  verificationSuccessful?: string;
  attemptsRemaining?: (n: number) => string;
  captchaRequired?: string;
  minLength?: (min: number) => string;
  maxLength?: (max: number) => string;
  invalidCharacters?: (chars: string) => string;
  customValidationFailed?: string;
  captchaDoesNotMatch?: string;
}

export interface ConfettiOptions {
  /** Number of confetti particles */
  particleCount?: number;
  /** Spread angle in degrees */
  spread?: number;
  /** Origin point for confetti */
  origin?: { x?: number; y?: number };
  /** Colors for confetti particles */
  colors?: string[];
  /** Whether confetti should fall */
  gravity?: number;
  /** Confetti particle size */
  scalar?: number;
  /** Animation duration */
  duration?: number;
}

export interface CaptchaProps {
  enableAudio?: boolean;
  type?: CaptchaType;
  length?: number;
  inputButtonStyle?: string;
  onChange?: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onFail?: () => void;
  onRefresh?: () => void;
  onAudioPlay?: () => void;
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
  i18n?: CaptchaI18n;
  /** Enable right-to-left layout for RTL languages */
  rtl?: boolean;
  /** Enable or disable confetti animation on success */
  showConfetti?: boolean;
  /** Custom confetti options */
  confettiOptions?: ConfettiOptions;
}
