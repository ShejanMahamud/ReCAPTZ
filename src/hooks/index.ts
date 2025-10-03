import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    incrementAttempts,
    resetAttempts,
    selectRemainingAttempts,
    setMaxAttempts
} from "../store/slices/attemptsSlice";
import {
    speakTextAsync,
    stopSpeechAsync
} from "../store/slices/audioSlice";
import {
    generateCaptchaAsync,
    refreshCaptchaAsync,
    setConfig,
    setUserInput,
    validateCaptchaAsync
} from "../store/slices/captchaSlice";
import {
    CaptchaAttempts,
    CaptchaAudio,
    CaptchaConfig,
    CaptchaGenerator,
    CaptchaState,
    CaptchaValidator,
    ValidationRules,
} from "../types";

/**
 * Hook for generating captcha text with Redux state management
 * Useful when you need just captcha generation without UI components
 */
export const useCaptchaGenerator = (
    _config: CaptchaConfig = {}
): CaptchaGenerator => {
    const dispatch = useAppDispatch();
    const captchaText = useAppSelector((state) => state.captcha.captchaText);
    const isLoading = useAppSelector((state) => state.captcha.isLoading);

    const refresh = useCallback(() => {
        dispatch(refreshCaptchaAsync());
    }, [dispatch]);

    const generateNew = useCallback(
        (newConfig?: Partial<CaptchaConfig>): string => {
            if (newConfig) {
                dispatch(setConfig(newConfig));
            }
            dispatch(generateCaptchaAsync(newConfig));
            return captchaText;
        },
        [dispatch, captchaText]
    );

    return {
        captchaText,
        refresh,
        generateNew,
        isLoading,
    };
};

/**
 * Hook for validating captcha input with Redux state management
 * Useful for custom validation logic or when building custom UI
 */
export const useCaptchaValidator = (
    _config: CaptchaConfig = {}
): CaptchaValidator => {
    const dispatch = useAppDispatch();
    const error = useAppSelector((state) => state.captcha.error);
    const isValid = useAppSelector((state) => state.captcha.isValid);

    const validate = useCallback(
        (input: string, _captcha: string): boolean => {
            // Update the input in Redux state
            dispatch(setUserInput(input));

            // Trigger validation
            const result = dispatch(validateCaptchaAsync());
            return Boolean(result);
        },
        [dispatch]
    );

    const validateWithRules = useCallback(
        (
            input: string,
            captcha: string,
            rules?: ValidationRules
        ): { isValid: boolean; error: string | null } => {
            if (rules) {
                dispatch(setConfig({ validationRules: rules }));
            }

            const isValidResult = validate(input, captcha);
            return {
                isValid: isValidResult,
                error: error,
            };
        },
        [validate, error, dispatch]
    );

    return {
        validate,
        validateWithRules,
        error,
        isValid,
    };
};

/**
 * Hook for managing captcha attempts with Redux state management
 * Useful for tracking user attempts and implementing max attempt logic
 */
export const useCaptchaAttempts = (maxAttempts: number = 3): CaptchaAttempts => {
    const dispatch = useAppDispatch();
    const attempts = useAppSelector((state) => state.attempts.currentAttempts);
    const maxAttemptsState = useAppSelector((state) => state.attempts.maxAttempts);
    const isMaxReached = useAppSelector((state) => state.attempts.isMaxReached);
    const remainingAttempts = useAppSelector(selectRemainingAttempts);

    const incrementAttemptsAction = useCallback(
        (success: boolean, timeTaken?: number) => {
            dispatch(incrementAttempts({ success, timeTaken }));
        },
        [dispatch]
    );

    const resetAttemptsAction = useCallback(() => {
        dispatch(resetAttempts());
    }, [dispatch]);

    // Set max attempts if different from current
    if (maxAttempts !== maxAttemptsState) {
        dispatch(setMaxAttempts(maxAttempts));
    }

    return {
        attempts,
        maxAttempts: maxAttemptsState,
        remainingAttempts,
        isMaxReached,
        incrementAttempts: incrementAttemptsAction,
        resetAttempts: resetAttemptsAction,
    };
};

/**
 * Hook for captcha audio functionality using Redux state management
 * Useful for accessibility features and audio feedback
 */
export const useCaptchaAudio = (): CaptchaAudio => {
    const dispatch = useAppDispatch();
    const isSupported = useAppSelector((state) => state.audio.isSupported);
    const isPlaying = useAppSelector((state) => state.audio.isPlaying);

    const speak = useCallback(
        (text: string) => {
            dispatch(speakTextAsync(text));
        },
        [dispatch]
    );

    const stop = useCallback(() => {
        dispatch(stopSpeechAsync());
    }, [dispatch]);

    return {
        speak,
        isSupported,
        isPlaying,
        stop,
    };
};

/**
 * Comprehensive hook that combines all captcha functionality with Redux
 * Perfect for building custom captcha implementations with full control
 */
export const useCaptchaState = (config: CaptchaConfig = {}): CaptchaState => {
    const dispatch = useAppDispatch();

    // Redux state selectors
    const captchaText = useAppSelector((state) => state.captcha.captchaText);
    const userInput = useAppSelector((state) => state.captcha.userInput);
    const isValid = useAppSelector((state) => state.captcha.isValid);
    const error = useAppSelector((state) => state.captcha.error);
    const isLoading = useAppSelector((state) => state.captcha.isLoading);

    const attempts = useAppSelector((state) => state.attempts.currentAttempts);
    const maxAttempts = useAppSelector((state) => state.attempts.maxAttempts);
    const remainingAttempts = useAppSelector(selectRemainingAttempts);
    const isMaxReached = useAppSelector((state) => state.attempts.isMaxReached);

    const isAudioSupported = useAppSelector((state) => state.audio.isSupported);
    const isAudioPlaying = useAppSelector((state) => state.audio.isPlaying);

    // Actions
    const setUserInputAction = useCallback(
        (input: string) => {
            dispatch(setUserInput(input));
        },
        [dispatch]
    );

    const validate = useCallback((): boolean => {
        const result = dispatch(validateCaptchaAsync());
        return Boolean(result);
    }, [dispatch]);

    const refresh = useCallback(() => {
        dispatch(refreshCaptchaAsync());
    }, [dispatch]);

    const speakCaptcha = useCallback(() => {
        dispatch(speakTextAsync(captchaText));
    }, [dispatch, captchaText]);

    const updateConfig = useCallback(
        (newConfig: Partial<CaptchaConfig>) => {
            dispatch(setConfig(newConfig));
        },
        [dispatch]
    );

    return {
        // Generator state
        captchaText,
        refresh,

        // Input state
        userInput,
        setUserInput: setUserInputAction,

        // Validation state
        isValid,
        error,
        validate,

        // Attempts state
        attempts,
        maxAttempts,
        remainingAttempts,
        isMaxReached,

        // Audio functionality
        speakCaptcha,
        isAudioSupported,
        isAudioPlaying,

        // Loading states
        isLoading,

        // Configuration
        config,
        updateConfig,
    };
};

/**
 * Hook for captcha with automatic refresh functionality using Redux
 * Useful for implementing time-based captcha refresh
 */
export const useCaptchaWithAutoRefresh = (
    config: CaptchaConfig & { refreshInterval?: number } = {}
): CaptchaGenerator => {
    const generator = useCaptchaGenerator(config);
    // TODO: Implement auto-refresh logic using the refreshInterval
    // For now, just return the generator
    return generator;
};

/**
 * Hook for captcha with interval-based refresh using Redux
 * Alternative to auto-refresh with more control over timing
 */
export const useCaptchaWithInterval = (
    config: CaptchaConfig = {},
    _intervalMs: number = 30000
): CaptchaGenerator => {
    const generator = useCaptchaGenerator(config);
    // TODO: Implement interval-based refresh logic
    // For now, just return the generator
    return generator;
};
