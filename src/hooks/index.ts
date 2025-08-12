import { useCallback, useEffect, useState } from "react";
import {
  CaptchaAttempts,
  CaptchaAudio,
  CaptchaConfig,
  CaptchaGenerator,
  CaptchaState,
  CaptchaType,
  CaptchaValidator,
  ServerCaptchaSession,
  ValidationRules,
} from "../types";
import { generateCaptcha } from "../utils/captchaGenerator";
import { modeManager } from "../utils/captchaMode";

/**
 * Hook for generating captcha text with automatic server/client mode detection
 * Useful when you need just captcha generation without UI components
 */
export const useCaptchaGenerator = (
  config: CaptchaConfig = {}
): CaptchaGenerator => {
  const { type = "mixed", length = 6 } = config;
  const [captchaText, setCaptchaText] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateCaptchaWithMode = useCallback(
    async (
      captchaType: CaptchaType,
      captchaLength: number
    ): Promise<ServerCaptchaSession | string> => {
      const mode = await modeManager.getCurrentMode();

      if (mode === "server") {
        const client = modeManager.getServerClient();
        if (client) {
          return await client.generate({
            type: captchaType === "custom" ? "mixed" : captchaType,
            length: captchaLength,
            enableAudio: true,
            showSuccessAnimation: true,
          });
        }
      }

      // Fallback to client mode
      const effectiveType = captchaType === "custom" ? "mixed" : captchaType;
      return generateCaptcha(
        effectiveType,
        captchaLength,
        config.customCharacters
      );
    },
    [config.customCharacters]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const effectiveType = type === "custom" ? "mixed" : type;
      const result = await generateCaptchaWithMode(effectiveType, length);

      if (typeof result === "string") {
        // Client mode
        setCaptchaText(result);
        setSessionToken(null);
      } else {
        // Server mode
        setCaptchaText(result.challengeText);
        setSessionToken(result.sessionToken);
      }
    } catch (error) {
      console.error("Failed to refresh CAPTCHA:", error);
      // Fallback to client mode
      try {
        const effectiveType = type === "custom" ? "mixed" : type;
        const fallbackCaptcha = generateCaptcha(
          effectiveType,
          length,
          config.customCharacters
        );
        setCaptchaText(fallbackCaptcha);
        setSessionToken(null);
      } catch (fallbackError) {
        console.error("Failed to generate fallback CAPTCHA:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [type, length, generateCaptchaWithMode, config.customCharacters]);

  const generateNew = useCallback(
    async (newConfig?: Partial<CaptchaConfig>): Promise<string> => {
      setIsLoading(true);
      try {
        const mergedConfig = { ...config, ...newConfig };
        const effectiveType =
          (mergedConfig.type || type) === "custom"
            ? "mixed"
            : mergedConfig.type || type;
        const result = await generateCaptchaWithMode(
          effectiveType,
          mergedConfig.length || length
        );

        if (typeof result === "string") {
          setCaptchaText(result);
          setSessionToken(null);
          return result;
        } else {
          setCaptchaText(result.challengeText);
          setSessionToken(result.sessionToken);
          return result.challengeText;
        }
      } catch (error) {
        console.error("Failed to generate new CAPTCHA:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [config, type, length, generateCaptchaWithMode]
  );

  // Generate initial CAPTCHA
  useEffect(() => {
    refresh();
  }, []);

  return {
    captchaText,
    refresh,
    generateNew,
    isLoading,
    sessionToken,
  };
};

/**
 * Hook for validating captcha input with automatic server/client mode detection
 * Useful for custom validation logic or when building custom UI
 */
export const useCaptchaValidator = (
  config: CaptchaConfig = {}
): CaptchaValidator => {
  const { caseSensitive = false, validationRules, i18n = {} } = config;
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = useCallback(
    async (input: string, sessionTokenOrCaptcha: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const mode = await modeManager.getCurrentMode();

        if (mode === "server" && sessionTokenOrCaptcha) {
          const client = modeManager.getServerClient();
          if (client) {
            const result = await client.verify(sessionTokenOrCaptcha, input, {
              inputMethod: "keyboard",
            });

            setIsValid(result.success);
            if (!result.success) {
              setError(result.errorMessage || "CAPTCHA verification failed");
            }

            return result.success;
          }
        }

        // Client mode validation
        const compareInput = caseSensitive ? input : input.toLowerCase();
        const compareCaptcha = caseSensitive
          ? sessionTokenOrCaptcha
          : sessionTokenOrCaptcha.toLowerCase();
        const result = compareInput === compareCaptcha;
        setIsValid(result);
        setError(result ? null : "Invalid captcha");
        return result;
      } catch (err: unknown) {
        setIsValid(false);
        setError(err instanceof Error ? err.message : "Verification failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [caseSensitive]
  );

  const validateWithRules = useCallback(
    async (
      input: string,
      sessionTokenOrCaptcha: string,
      rules?: ValidationRules
    ) => {
      // Perform client-side validation first
      const mergedRules = { ...validationRules, ...rules, caseSensitive };

      // Basic client-side validation
      if (!input && mergedRules?.required) {
        const error = i18n.captchaRequired || "CAPTCHA response is required";
        setError(error);
        setIsValid(false);
        return { isValid: false, error };
      }

      if (mergedRules?.minLength && input.length < mergedRules.minLength) {
        const error = i18n.minLength
          ? i18n.minLength(mergedRules.minLength)
          : `Input must be at least ${mergedRules.minLength} characters long`;
        setError(error);
        setIsValid(false);
        return { isValid: false, error };
      }

      if (mergedRules?.maxLength && input.length > mergedRules.maxLength) {
        const error = i18n.maxLength
          ? i18n.maxLength(mergedRules.maxLength)
          : `Input cannot be longer than ${mergedRules.maxLength} characters`;
        setError(error);
        setIsValid(false);
        return { isValid: false, error };
      }

      // Server-side or client-side validation
      const isValid = await validate(input, sessionTokenOrCaptcha);
      return { isValid, error: isValid ? null : error };
    },
    [validationRules, caseSensitive, i18n, validate, error]
  );

  return {
    validate,
    validateWithRules,
    error,
    isValid,
    isLoading,
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
 * Hook for text-to-speech functionality with automatic server/client mode detection
 * Useful for accessibility features in custom implementations
 */
export const useCaptchaAudio = (): CaptchaAudio => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const playServerAudio = useCallback(
    async (sessionToken: string) => {
      if (!sessionToken) return;

      setIsLoading(true);
      try {
        const mode = await modeManager.getCurrentMode();

        if (mode === "server") {
          const client = modeManager.getServerClient();
          if (client) {
            const audioData = await client.getAudio(sessionToken);

            if (isSupported) {
              // Stop any current speech
              if (currentUtterance) {
                speechSynthesis.cancel();
              }

              const utterance = new SpeechSynthesisUtterance(
                audioData.audioText
              );
              utterance.rate = audioData.audioConfig.rate;
              utterance.pitch = audioData.audioConfig.pitch;
              utterance.volume = audioData.audioConfig.volume;

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
              return;
            }
          }
        }

        // Fallback to basic speak
        speak(sessionToken);
      } catch (error) {
        console.error("Server audio playback failed:", error);
        speak(sessionToken);
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported, currentUtterance, speak]
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
    playServerAudio,
    isSupported,
    isPlaying,
    stop,
    isLoading,
  };
};

/**
 * Comprehensive hook that combines all captcha functionality with automatic mode detection
 * Useful for building completely custom captcha implementations
 */
export const useCaptchaState = (
  initialConfig: CaptchaConfig = {}
): CaptchaState => {
  const [config, setConfig] = useState<CaptchaConfig>(initialConfig);
  const [userInput, setUserInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Use individual hooks
  const generator = useCaptchaGenerator(config);
  const validator = useCaptchaValidator(config);
  const attempts = useCaptchaAttempts(config.maxAttempts);
  const audio = useCaptchaAudio();

  // Enhanced validate function that handles attempts
  const validate = useCallback(async (): Promise<boolean> => {
    if (!generator.sessionToken && !generator.captchaText) {
      return false;
    }

    setIsValidating(true);
    try {
      const result = await validator.validate(
        userInput,
        generator.sessionToken || generator.captchaText
      );

      if (!result) {
        attempts.incrementAttempts();

        // Auto-refresh if max attempts reached
        if (attempts.isMaxReached) {
          await generator.refresh();
          attempts.resetAttempts();
          setUserInput("");
        }
      }

      return result;
    } finally {
      setIsValidating(false);
    }
  }, [userInput, generator, validator, attempts]);

  // Enhanced refresh function that resets everything
  const refresh = useCallback(async () => {
    await generator.refresh();
    setUserInput("");
    attempts.resetAttempts();
  }, [generator, attempts]);

  // Speak captcha function
  const speakCaptcha = useCallback(() => {
    // Add spaces between characters for better pronunciation
    const spokenText = generator.captchaText.split("").join(" ");
    audio.speak(spokenText);
  }, [generator.captchaText, audio]);

  // Play server audio function
  const playServerAudio = useCallback(async () => {
    if (generator.sessionToken) {
      await audio.playServerAudio(generator.sessionToken);
    } else {
      speakCaptcha();
    }
  }, [generator.sessionToken, audio, speakCaptcha]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<CaptchaConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  return {
    // Generator state
    captchaText: generator.captchaText,
    refresh,
    sessionToken: generator.sessionToken,

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
    playServerAudio,
    isAudioSupported: audio.isSupported,
    isAudioPlaying: audio.isPlaying,

    // Loading states
    isLoading: generator.isLoading || audio.isLoading,
    isValidating,

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
  const validate = useCallback(async (): Promise<boolean> => {
    const isValid = await originalValidate();

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
