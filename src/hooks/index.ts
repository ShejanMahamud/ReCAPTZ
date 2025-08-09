import { useCallback, useEffect, useState } from "react";
import {
  CaptchaAttempts,
  CaptchaAudio,
  CaptchaConfig,
  CaptchaGenerator,
  CaptchaState,
  CaptchaType,
  CaptchaValidator,
  ValidationRules,
} from "../types";
import { generateCaptcha, validateCaptcha } from "../utils/captchaGenerator";

/**
 * Hook for generating captcha text with customizable configuration
 * Useful when you need just captcha generation without UI components
 */
export const useCaptchaGenerator = (
  config: CaptchaConfig = {}
): CaptchaGenerator => {
  const { type = "mixed", length = 6, customCharacters } = config;

  const [captchaText, setCaptchaText] = useState(() =>
    generateCaptcha(type, length, customCharacters)
  );

  const refresh = useCallback(() => {
    setCaptchaText(generateCaptcha(type, length, customCharacters));
  }, [type, length, customCharacters]);

  const generateNew = useCallback(
    (newConfig?: Partial<CaptchaConfig>) => {
      const mergedConfig = { ...config, ...newConfig };
      const newCaptcha = generateCaptcha(
        mergedConfig.type || type,
        mergedConfig.length || length,
        mergedConfig.customCharacters || customCharacters
      );
      setCaptchaText(newCaptcha);
      return newCaptcha;
    },
    [config, type, length, customCharacters]
  );

  // Refresh when configuration changes
  useEffect(() => {
    refresh();
  }, [type, length, customCharacters]);

  return {
    captchaText,
    refresh,
    generateNew,
  };
};

/**
 * Hook for validating captcha input with custom rules
 * Useful for custom validation logic or when building custom UI
 */
export const useCaptchaValidator = (
  config: CaptchaConfig = {}
): CaptchaValidator => {
  const { caseSensitive = false, validationRules, i18n = {} } = config;
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validate = useCallback(
    (input: string, captcha: string): boolean => {
      const compareInput = caseSensitive ? input : input.toLowerCase();
      const compareCaptcha = caseSensitive ? captcha : captcha.toLowerCase();
      const result = compareInput === compareCaptcha;
      setIsValid(result);
      setError(result ? null : "Invalid captcha");
      return result;
    },
    [caseSensitive]
  );

  const validateWithRules = useCallback(
    (input: string, captcha: string, rules?: ValidationRules) => {
      const mergedRules = { ...validationRules, ...rules, caseSensitive };
      const result = validateCaptcha(input, captcha, mergedRules, i18n);
      setIsValid(result.isValid);
      setError(result.error);
      return result;
    },
    [validationRules, caseSensitive, i18n]
  );

  return {
    validate,
    validateWithRules,
    error,
    isValid,
  };
};

/**
 * Hook for managing captcha attempts and limits
 * Useful for implementing custom attempt limiting logic
 */
export const useCaptchaAttempts = (
  maxAttempts: number = 3
): CaptchaAttempts => {
  const [attempts, setAttempts] = useState(0);

  const incrementAttempts = useCallback(() => {
    setAttempts((prev) => Math.min(prev + 1, maxAttempts));
  }, [maxAttempts]);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
  }, []);

  const remainingAttempts = Math.max(0, maxAttempts - attempts);
  const isMaxReached = attempts >= maxAttempts;

  return {
    attempts,
    maxAttempts,
    remainingAttempts,
    isMaxReached,
    incrementAttempts,
    resetAttempts,
  };
};

/**
 * Hook for text-to-speech functionality
 * Useful for accessibility features in custom implementations
 */
export const useCaptchaAudio = (): CaptchaAudio => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;

      // Stop any current speech
      if (currentUtterance) {
        speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      speechSynthesis.speak(utterance);
    },
    [isSupported, currentUtterance]
  );

  const stop = useCallback(() => {
    if (isSupported && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    isSupported,
    isPlaying,
    stop,
  };
};

/**
 * Comprehensive hook that combines all captcha functionality
 * Useful for building completely custom captcha implementations
 */
export const useCaptchaState = (
  initialConfig: CaptchaConfig = {}
): CaptchaState => {
  const [config, setConfig] = useState<CaptchaConfig>(initialConfig);
  const [userInput, setUserInput] = useState("");

  // Use individual hooks
  const generator = useCaptchaGenerator(config);
  const validator = useCaptchaValidator(config);
  const attempts = useCaptchaAttempts(config.maxAttempts);
  const audio = useCaptchaAudio();

  // Enhanced validate function that handles attempts
  const validate = useCallback(() => {
    const result = validator.validateWithRules(
      userInput,
      generator.captchaText
    );

    if (!result.isValid) {
      attempts.incrementAttempts();

      // Auto-refresh if max attempts reached
      if (attempts.isMaxReached) {
        generator.refresh();
        attempts.resetAttempts();
        setUserInput("");
      }
    }

    return result.isValid;
  }, [userInput, generator, validator, attempts]);

  // Enhanced refresh function that resets everything
  const refresh = useCallback(() => {
    generator.refresh();
    setUserInput("");
    attempts.resetAttempts();
  }, [generator, attempts]);

  // Speak captcha function
  const speakCaptcha = useCallback(() => {
    // Add spaces between characters for better pronunciation
    const spokenText = generator.captchaText.split("").join(" ");
    audio.speak(spokenText);
  }, [generator.captchaText, audio]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<CaptchaConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    // Generator state
    captchaText: generator.captchaText,
    refresh,

    // Input state
    userInput,
    setUserInput,

    // Validation state
    isValid: validator.isValid,
    error: validator.error,
    validate,

    // Attempts state
    attempts: attempts.attempts,
    maxAttempts: attempts.maxAttempts,
    remainingAttempts: attempts.remainingAttempts,
    isMaxReached: attempts.isMaxReached,

    // Audio functionality
    speakCaptcha,
    isAudioSupported: audio.isSupported,
    isAudioPlaying: audio.isPlaying,

    // Configuration
    config,
    updateConfig,
  };
};

/**
 * Hook for creating a captcha with automatic refresh intervals
 * Useful for time-sensitive captcha implementations
 */
export const useCaptchaWithInterval = (
  config: CaptchaConfig & { refreshInterval?: number } = {}
) => {
  const { refreshInterval = 0, ...captchaConfig } = config;
  const captchaState = useCaptchaState(captchaConfig);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        captchaState.refresh();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, captchaState.refresh]);

  return captchaState;
};

/**
 * Hook for creating a captcha that automatically refreshes on failure
 * Useful for implementing progressive difficulty or security measures
 */
export const useCaptchaWithAutoRefresh = (
  config: CaptchaConfig & {
    refreshOnFail?: boolean;
    progressiveDifficulty?: boolean;
  } = {}
) => {
  const {
    refreshOnFail = true,
    progressiveDifficulty = false,
    ...captchaConfig
  } = config;
  const [difficulty, setDifficulty] = useState(0);

  const enhancedConfig = progressiveDifficulty
    ? {
        ...captchaConfig,
        length: (captchaConfig.length || 6) + difficulty,
        type: difficulty > 2 ? ("mixed" as CaptchaType) : captchaConfig.type,
      }
    : captchaConfig;

  const captchaState = useCaptchaState(enhancedConfig);

  // Override validate to handle auto-refresh
  const originalValidate = captchaState.validate;
  const validate = useCallback(() => {
    const isValid = originalValidate();

    if (!isValid && refreshOnFail) {
      if (progressiveDifficulty) {
        setDifficulty((prev) => Math.min(prev + 1, 3));
      }

      setTimeout(() => {
        captchaState.refresh();
      }, 1000); // Small delay before refresh
    } else if (isValid && progressiveDifficulty) {
      setDifficulty(0); // Reset difficulty on success
    }

    return isValid;
  }, [
    originalValidate,
    refreshOnFail,
    progressiveDifficulty,
    captchaState.refresh,
  ]);

  return {
    ...captchaState,
    validate,
    difficulty,
  };
};
