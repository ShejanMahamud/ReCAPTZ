export type CaptchaType = "numbers" | "letters" | "mixed" | "custom" | "slider" | "math" | "pattern";

export type CaptchaTheme = "light" | "dark" | "auto";

export interface SliderCaptchaConfig {
  /** Width of the slider captcha canvas */
  width?: number;
  /** Height of the slider captcha canvas */
  height?: number;
  /** Size of the puzzle piece */
  pieceSize?: number;
  /** Tolerance for slider position validation (in pixels) */
  tolerance?: number;
  /** Background image URL or base64 data URL */
  backgroundImage?: string;
  /** Array of predefined background images */
  backgroundImages?: string[];
  /** Enable puzzle piece shadow for better visibility */
  enableShadow?: boolean;
  /** Custom puzzle piece shape complexity (1-5) */
  complexity?: number;
}

export interface MathCaptchaConfig {
  /** Difficulty level affecting number ranges and operations */
  difficulty?: "easy" | "medium" | "hard";
  /** Operations to include in math problems */
  operations?: ("add" | "subtract" | "multiply" | "divide")[];
  /** Range for numbers in equations */
  numberRange?: {
    min: number;
    max: number;
  };
  /** Whether to include negative numbers */
  allowNegative?: boolean;
  /** Whether to include decimal results */
  allowDecimals?: boolean;
  /** Display format for the equation */
  displayFormat?: "horizontal" | "vertical";
}

export interface PatternCaptchaConfig {
  /** Difficulty level affecting pattern complexity */
  difficulty?: "easy" | "medium" | "hard";
  /** Number of items to display in the pattern */
  gridSize?: number;
  /** Pattern types to include */
  patternTypes?: ("shape" | "color" | "sequence" | "rotation" | "size" | "mixed")[];
  /** Whether to include distractors (similar but incorrect options) */
  includeDistractors?: boolean;
}

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

// Client-side analytics (optional)
export interface CaptchaAnalytics {
  timeTaken: number;
  attempts: number;
  difficulty: number;
  inputMethod: string;
}

export interface CaptchaProps {
  // User-facing props only
  enableAudio?: boolean;
  /** Disable the space key to hear code functionality while keeping audio available via button */
  disableSpaceToHear?: boolean;
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
  /** Slider captcha configuration */
  sliderConfig?: SliderCaptchaConfig;
  /** Math captcha configuration */
  mathConfig?: MathCaptchaConfig;
  /** Pattern captcha configuration */
  patternConfig?: PatternCaptchaConfig;
}

// Internal context type (simplified for client-side use)
export interface CaptchaContextType {
  captchaText: string;
  userInput: string;
  isValid: boolean;
  error: string | null;
  refresh: () => void;
  setUserInput: (input: string) => void;
  validate: () => boolean;
  currentAttempts: number;
  maxAttempts: number | undefined;
  i18n: CaptchaI18n;
  isLoading: boolean;
  playAudio: () => void;
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
  refresh: () => void;
  generateNew: (config?: Partial<CaptchaConfig>) => string;
  isLoading: boolean;
}

// Return type for useCaptchaValidator hook
export interface CaptchaValidator {
  validate: (input: string, captcha: string) => boolean;
  validateWithRules: (
    input: string,
    captcha: string,
    rules?: ValidationRules
  ) => {
    isValid: boolean;
    error: string | null;
  };
  error: string | null;
  isValid: boolean;
}

// Return type for useCaptchaAttempts hook
export interface CaptchaAttempts {
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;
  incrementAttempts: (success: boolean, timeTaken?: number) => void;
  resetAttempts: () => void;
}

// Return type for useCaptchaAudio hook
export interface CaptchaAudio {
  speak: (text: string) => void;
  isSupported: boolean;
  isPlaying: boolean;
  stop: () => void;
}

// Return type for comprehensive useCaptchaState hook
export interface CaptchaState {
  // Generator state
  captchaText: string;
  refresh: () => void;

  // Input state
  userInput: string;
  setUserInput: (input: string) => void;

  // Validation state
  isValid: boolean;
  error: string | null;
  validate: () => boolean;

  // Attempts state
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;

  // Audio functionality
  speakCaptcha: () => void;
  isAudioSupported: boolean;
  isAudioPlaying: boolean;

  // Loading states
  isLoading: boolean;

  // Configuration
  config: CaptchaConfig;
  updateConfig: (newConfig: Partial<CaptchaConfig>) => void;
}
