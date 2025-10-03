import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CaptchaI18n, CaptchaType, MathCaptchaConfig, ValidationRules } from '../../types';
import { generateCaptcha, validateCaptcha } from '../../utils/captchaGenerator';

export interface CaptchaState {
    // CAPTCHA generation
    captchaText: string;
    type: CaptchaType;
    length: number;
    customCharacters?: string;
    caseSensitive: boolean;
    mathConfig?: MathCaptchaConfig;

    // User interaction
    userInput: string;
    isValid: boolean;

    // Slider-specific state
    sliderPosition: number;
    sliderTarget: number;
    sliderValidated: boolean;
    isSliderValidating: boolean;

    // Error handling
    error: string | null;

    // Loading states
    isLoading: boolean;
    isGenerating: boolean;
    isValidating: boolean;

    // Configuration
    validationRules?: ValidationRules;
    i18n: CaptchaI18n;
    maxAttempts?: number;

    // Analytics
    startTime: number;
    completionTime?: number;
    totalTime?: number;
}

const initialState: CaptchaState = {
    captchaText: '',
    type: 'mixed',
    length: 6,
    caseSensitive: false,
    userInput: '',
    isValid: false,
    sliderPosition: 0,
    sliderTarget: 0,
    sliderValidated: false,
    isSliderValidating: false,
    error: null,
    isLoading: false,
    isGenerating: false,
    isValidating: false,
    i18n: {},
    startTime: Date.now(),
};

const captchaSlice = createSlice({
    name: 'captcha',
    initialState,
    reducers: {
        // Configuration actions
        setConfig: (state, action: PayloadAction<{
            type?: CaptchaType;
            length?: number;
            customCharacters?: string;
            caseSensitive?: boolean;
            validationRules?: ValidationRules;
            i18n?: CaptchaI18n;
            maxAttempts?: number;
            mathConfig?: MathCaptchaConfig;
        }>) => {
            const { type, length, customCharacters, caseSensitive, validationRules, i18n, maxAttempts, mathConfig } = action.payload;
            if (type !== undefined) state.type = type;
            if (length !== undefined) state.length = length;
            if (customCharacters !== undefined) state.customCharacters = customCharacters;
            if (caseSensitive !== undefined) state.caseSensitive = caseSensitive;
            if (validationRules !== undefined) state.validationRules = validationRules;
            if (i18n !== undefined) state.i18n = { ...state.i18n, ...i18n };
            if (maxAttempts !== undefined) state.maxAttempts = maxAttempts;
            if (mathConfig !== undefined) state.mathConfig = mathConfig;
        },

        // CAPTCHA generation actions
        generateStart: (state) => {
            state.isGenerating = true;
            state.isLoading = true;
            state.error = null;
            state.startTime = Date.now();
        },

        generateSuccess: (state, action: PayloadAction<string>) => {
            state.captchaText = action.payload;
            state.isGenerating = false;
            state.isLoading = false;
            state.userInput = '';
            state.isValid = false;
            state.error = null;
            state.completionTime = undefined;
            state.totalTime = undefined;
        },

        generateFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isGenerating = false;
            state.isLoading = false;
        },

        // User input actions
        setUserInput: (state, action: PayloadAction<string>) => {
            state.userInput = action.payload;
            // Clear previous validation state when user types
            if (state.isValid || state.error) {
                state.isValid = false;
                state.error = null;
            }
        },

        // Slider-specific actions
        setSliderPosition: (state, action: PayloadAction<number>) => {
            state.sliderPosition = action.payload;
        },

        setSliderTarget: (state, action: PayloadAction<number>) => {
            state.sliderTarget = action.payload;
        },

        validateSlider: (state, action: PayloadAction<{ position: number; target: number; tolerance?: number }>) => {
            const { position, target, tolerance = 5 } = action.payload;
            const distance = Math.abs(position - target);
            state.sliderValidated = distance <= tolerance;
            state.isValid = state.sliderValidated;

            if (state.sliderValidated) {
                state.userInput = "validated";
                state.error = null;
                state.completionTime = Date.now();
                state.totalTime = state.completionTime - state.startTime;
            } else {
                state.error = "Please position the slider correctly";
            }
        },

        resetSlider: (state) => {
            state.sliderPosition = 0;
            state.sliderTarget = 0;
            state.sliderValidated = false;
        },

        clearUserInput: (state) => {
            state.userInput = '';
            state.isValid = false;
            state.error = null;
        },

        // Validation actions
        validateStart: (state) => {
            state.isValidating = true;
            state.error = null;
        },

        validateSuccess: (state, action: PayloadAction<boolean>) => {
            state.isValid = action.payload;
            state.isValidating = false;
            state.error = null;

            if (action.payload) {
                state.completionTime = Date.now();
                state.totalTime = state.completionTime - state.startTime;
                // Only reset input for text-based captchas, not slider
                if (state.type !== 'slider') {
                    state.userInput = '';
                }
            }
        },

        validateFailure: (state, action: PayloadAction<string>) => {
            state.isValid = false;
            state.error = action.payload;
            state.isValidating = false;
        },

        // Utility actions
        clearError: (state) => {
            state.error = null;
        },

        reset: (state) => {
            state.userInput = '';
            state.isValid = false;
            state.sliderPosition = 0;
            state.sliderTarget = 0;
            state.sliderValidated = false;
            state.error = null;
            state.isLoading = false;
            state.isGenerating = false;
            state.isValidating = false;
            state.startTime = Date.now();
            state.completionTime = undefined;
            state.totalTime = undefined;
        },

        refresh: (state) => {
            state.userInput = '';
            state.isValid = false;
            state.sliderPosition = 0;
            state.sliderTarget = 0;
            state.sliderValidated = false;
            state.error = null;
            state.startTime = Date.now();
            state.completionTime = undefined;
            state.totalTime = undefined;
        },
    },
});

// Thunk actions for async operations
export const generateCaptchaAsync = (config?: {
    type?: CaptchaType;
    length?: number;
    customCharacters?: string;
    mathConfig?: MathCaptchaConfig;
}) => {
    return (dispatch: any, getState: any) => {
        const state = getState().captcha;

        // Prevent multiple simultaneous generations
        if (state.isGenerating) {
            console.log('CAPTCHA generation already in progress, skipping...');
            return;
        }

        dispatch(generateStart());

        try {
            const effectiveType = config?.type || state.type;
            const effectiveLength = config?.length || state.length;
            const effectiveCustomChars = config?.customCharacters || state.customCharacters;
            const effectiveMathConfig = config?.mathConfig || state.mathConfig;

            const newCaptcha = generateCaptcha(effectiveType, effectiveLength, effectiveCustomChars, effectiveMathConfig);
            dispatch(generateSuccess(newCaptcha));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate CAPTCHA';
            dispatch(generateFailure(errorMessage));
        }
    };
};

export const validateCaptchaAsync = () => {
    return (dispatch: any, getState: any) => {
        dispatch(validateStart());

        try {
            const state = getState().captcha;
            const { userInput, captchaText, validationRules, caseSensitive, i18n } = state;

            if (!userInput.trim()) {
                dispatch(validateFailure('Please enter the CAPTCHA code'));
                return false;
            }

            const result = validateCaptcha(
                userInput,
                captchaText,
                { ...validationRules, caseSensitive },
                i18n
            );

            if (result.isValid) {
                dispatch(validateSuccess(true));
                // Generate new captcha after successful validation
                // dispatch(generateCaptchaAsync());
            } else {
                dispatch(validateFailure(result.error || 'CAPTCHA validation failed'));
            }

            return result.isValid;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Validation failed';
            dispatch(validateFailure(errorMessage));
            return false;
        }
    };
};

export const refreshCaptchaAsync = () => {
    return (dispatch: any, getState: any) => {
        const state = getState().captcha;

        // Prevent multiple simultaneous refreshes
        if (state.isGenerating) {
            console.log('CAPTCHA generation already in progress, skipping refresh...');
            return;
        }

        dispatch(refresh());
        dispatch(generateCaptchaAsync());
    };
};

export const {
    setConfig,
    generateStart,
    generateSuccess,
    generateFailure,
    setUserInput,
    clearUserInput,
    setSliderPosition,
    setSliderTarget,
    validateSlider,
    resetSlider,
    validateStart,
    validateSuccess,
    validateFailure,
    clearError,
    reset,
    refresh,
} = captchaSlice.actions;

export default captchaSlice.reducer;
