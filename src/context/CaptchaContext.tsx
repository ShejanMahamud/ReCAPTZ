import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setMaxAttempts } from "../store/slices/attemptsSlice";
import { initializeAudioAsync } from "../store/slices/audioSlice";
import {
  generateCaptchaAsync,
  refreshCaptchaAsync,
  resetSlider,
  setConfig,
  setSliderPosition,
  setSliderTarget,
  validateCaptchaAsync,
  validateSlider
} from "../store/slices/captchaSlice";
import { CaptchaProps, ValidationRules } from "../types";

// Internal component that uses Redux hooks
const CaptchaConfigProvider: React.FC<{
  children: React.ReactNode;
  type?: CaptchaProps["type"];
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  onValidate?: (isValid: boolean) => void;
  maxAttempts?: number;
  i18n?: any;
  onFail?: () => void;
  mathConfig?: CaptchaProps["mathConfig"];
}> = ({
  children,
  type = "mixed",
  length = 6,
  caseSensitive = false,
  customCharacters,
  validationRules,
  onValidate,
  maxAttempts = 3,
  i18n = {},
  onFail,
  mathConfig,
}) => {
    const dispatch = useAppDispatch();
    const isValid = useAppSelector((state) => state.captcha.isValid);
    const isMaxReached = useAppSelector((state) => state.attempts.isMaxReached);
    const isInitialized = useRef(false);

    // Initialize configuration and generate initial CAPTCHA ONCE
    useEffect(() => {
      // Prevent multiple initializations (especially in StrictMode)
      if (isInitialized.current) return;
      isInitialized.current = true;

      dispatch(setConfig({
        type,
        length,
        caseSensitive,
        customCharacters,
        validationRules,
        i18n,
        maxAttempts,
        mathConfig,
      }));

      dispatch(setMaxAttempts(maxAttempts));
      dispatch(initializeAudioAsync());

      // Generate initial CAPTCHA only once
      dispatch(generateCaptchaAsync({ type, length, customCharacters, mathConfig }));
    }, []); // Empty deps - only run once on mount

    // Handle type changes separately to regenerate CAPTCHA
    useEffect(() => {
      // Skip if not initialized yet
      if (!isInitialized.current) return;

      // Only generate new CAPTCHA when type changes
      dispatch(generateCaptchaAsync({ type, length, customCharacters, mathConfig }));
    }, [type, dispatch]); // Only when type changes

    // Handle validation callback - call once when validation state changes
    useEffect(() => {
      if (onValidate) {
        onValidate(isValid);
      }
    }, [isValid]); // Remove onValidate from dependencies to prevent cascade

    // Handle max attempts reached
    useEffect(() => {
      if (isMaxReached && !isValid) {
        setTimeout(() => {
          dispatch(refreshCaptchaAsync());
          onFail?.();
        }, 2000);
      }
    }, [isMaxReached, isValid, dispatch, onFail]);

    return <>{children}</>;
  };

// Main provider component that wraps with Redux Provider
export const CaptchaProvider: React.FC<{
  children: React.ReactNode;
  type?: CaptchaProps["type"];
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  onValidate?: (isValid: boolean) => void;
  maxAttempts?: number;
  i18n?: any;
  onFail?: () => void;
  mathConfig?: CaptchaProps["mathConfig"];
}> = (props) => {
  return (
    <Provider store={store}>
      <CaptchaConfigProvider {...props} />
    </Provider>
  );
};

// Custom hook for components to access CAPTCHA state and actions
export const useCaptcha = () => {
  const dispatch = useAppDispatch();
  const captchaState = useAppSelector((state) => state.captcha);
  const attemptsState = useAppSelector((state) => state.attempts);
  const audioState = useAppSelector((state) => state.audio);

  return {
    // CAPTCHA data
    captchaText: captchaState.captchaText,
    userInput: captchaState.userInput,
    isValid: captchaState.isValid,
    error: captchaState.error,
    isLoading: captchaState.isLoading,

    // Slider data
    sliderPosition: captchaState.sliderPosition,
    sliderTarget: captchaState.sliderTarget,
    sliderValidated: captchaState.sliderValidated,

    // Attempts data
    currentAttempts: attemptsState.currentAttempts,
    maxAttempts: attemptsState.maxAttempts,

    // Audio data
    isAudioSupported: audioState.isSupported,
    isAudioPlaying: audioState.isPlaying,

    // Configuration
    i18n: captchaState.i18n,

    // Actions
    setUserInput: (input: string) => dispatch({ type: 'captcha/setUserInput', payload: input }),
    validate: () => dispatch(validateCaptchaAsync()),
    refresh: () => dispatch(refreshCaptchaAsync()),
    playAudio: () => dispatch({ type: 'audio/speakTextAsync', payload: captchaState.captchaText }),

    // Slider actions
    setSliderPosition: (position: number) => dispatch(setSliderPosition(position)),
    setSliderTarget: (target: number) => dispatch(setSliderTarget(target)),
    validateSlider: (position: number, target: number, tolerance?: number) =>
      dispatch(validateSlider({ position, target, tolerance })),
    resetSlider: () => dispatch(resetSlider()),
  };
};
