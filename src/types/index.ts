export type CaptchaType = "numbers" | "letters" | "mixed" | "custom";

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

// Internal server-side ReCAPTZ types (not exposed to users)
export interface ReCAPTZConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  debug?: boolean;
}

export interface ServerCaptchaSession {
  sessionToken: string;
  challengeText: string;
  expiresAt: string;
  config: {
    type: CaptchaType;
    length: number;
    caseSensitive: boolean;
    maxAttempts: number;
    expiryMinutes: number;
    enableAudio: boolean;
    showSuccessAnimation: boolean;
    showConfetti: boolean;
    darkMode: boolean;
    rtl: boolean;
    refreshable: boolean;
    autoFocus: boolean;
  };
  maxAttempts: number;
  attemptsRemaining: number;
}

export interface ServerCaptchaVerification {
  success: boolean;
  verified: boolean;
  sessionToken: string;
  attemptsRemaining: number;
  message?: string;
  errorMessage?: string;
  analytics?: {
    timeTaken: number;
    difficulty: number;
    inputMethod: string;
  };
}

export interface ServerCaptchaAudio {
  audioText: string;
  audioConfig: {
    language: string;
    rate: number;
    pitch: number;
    volume: number;
    spellOut: boolean;
  };
  supportedLanguages: string[];
}

export interface CaptchaProps {
  // User-facing props only
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

// Internal context type (simplified for internal use)
export interface CaptchaContextType {
  captchaText: string;
  userInput: string;
  isValid: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setUserInput: (input: string) => void;
  validate: () => Promise<boolean>;
  currentAttempts: number;
  maxAttempts: number | undefined;
  i18n: CaptchaI18n;
  isLoading: boolean;
  sessionToken: string | null;
  playAudio: () => Promise<void>;
}

// Configuration for hooks-based API (simplified)
export interface CaptchaConfig {
  type?: CaptchaType;
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  maxAttempts?: number;
  i18n?: CaptchaI18n;
}

// Return type for useCaptchaGenerator hook
export interface CaptchaGenerator {
  captchaText: string;
  refresh: () => Promise<void>;
  generateNew: (config?: Partial<CaptchaConfig>) => Promise<string>;
  isLoading: boolean;
  sessionToken: string | null;
}

// Return type for useCaptchaValidator hook
export interface CaptchaValidator {
  validate: (input: string, sessionToken: string) => Promise<boolean>;
  validateWithRules: (
    input: string,
    sessionToken: string,
    rules?: ValidationRules
  ) => Promise<{
    isValid: boolean;
    error: string | null;
  }>;
  error: string | null;
  isValid: boolean;
  isLoading: boolean;
}

// Return type for useCaptchaAttempts hook
export interface CaptchaAttempts {
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;
  incrementAttempts: () => void;
  resetAttempts: () => void;
}

// Return type for useCaptchaAudio hook
export interface CaptchaAudio {
  speak: (text: string) => void;
  playServerAudio: (sessionToken: string) => Promise<void>;
  isSupported: boolean;
  isPlaying: boolean;
  stop: () => void;
  isLoading: boolean;
}

// Return type for comprehensive useCaptchaState hook
export interface CaptchaState {
  // Generator state
  captchaText: string;
  refresh: () => Promise<void>;
  sessionToken: string | null;

  // Input state
  userInput: string;
  setUserInput: (input: string) => void;

  // Validation state
  isValid: boolean;
  error: string | null;
  validate: () => Promise<boolean>;

  // Attempts state
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;

  // Audio functionality
  speakCaptcha: () => void;
  playServerAudio: () => Promise<void>;
  isAudioSupported: boolean;
  isAudioPlaying: boolean;

  // Loading states
  isLoading: boolean;
  isValidating: boolean;

  // Configuration
  config: CaptchaConfig;
  updateConfig: (newConfig: Partial<CaptchaConfig>) => void;
}
