import { useFocusRing } from "@react-aria/focus";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  KeyRound,
  Loader2,
  RefreshCw,
  Volume2,
} from "lucide-react";
import React, { useState } from "react";
import { CaptchaProvider, useCaptcha } from "../context/CaptchaContext";
import { CaptchaProps } from "../types";
import { CaptchaAttempts } from "./CaptchaAttempts";
import { CaptchaCanvas } from "./CaptchaCanvas";
import { CaptchaInput } from "./CaptchaInput";
import { CaptchaSuccess } from "./CaptchaSuccess";
import { CaptchaTimer } from "./CaptchaTimer";

// Hook for building custom CAPTCHA UIs
export const useCaptchaState = () => {
  const context = useCaptcha();

  return {
    captchaText: context.captchaText,
    userInput: context.userInput,
    setUserInput: context.setUserInput,
    validate: context.validate,
    refresh: context.refresh,
    isValid: context.isValid,
    error: context.error,
  };
};

const defaultI18n = {
  securityCheck: "Security Check",
  listenToCaptcha: "Listen to CAPTCHA",
  refreshCaptcha: "Refresh CAPTCHA",
  pressSpaceToHearCode: "Press Space to hear the code",
  enterToValidate: "Enter to validate",
  escToClear: "Esc to clear",
};

const ErrorDisplay: React.FC<{
  error: string;
  severity?: "low" | "medium" | "high";
  darkMode: boolean;
}> = ({ error, severity = "medium", darkMode }) => {
  const getErrorIcon = () => {
    switch (severity) {
      case "low":
        return <Info className="w-4 h-4 flex-shrink-0" />;
      case "high":
        return <AlertTriangle className="w-4 h-4 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 flex-shrink-0" />;
    }
  };

  const getErrorStyles = () => {
    const baseStyles = "mb-3 p-3 rounded-md flex items-start gap-2 text-sm";

    switch (severity) {
      case "low":
        return `${baseStyles} ${
          darkMode
            ? "bg-blue-500/10 border border-blue-500/20 text-blue-300"
            : "bg-blue-50 border border-blue-200 text-blue-700"
        }`;
      case "high":
        return `${baseStyles} ${
          darkMode
            ? "bg-red-500/20 border border-red-500/30 text-red-300"
            : "bg-red-50 border border-red-300 text-red-700"
        }`;
      default:
        return `${baseStyles} ${
          darkMode
            ? "bg-yellow-500/15 border border-yellow-500/25 text-yellow-300"
            : "bg-yellow-50 border border-yellow-300 text-yellow-700"
        }`;
    }
  };

  return (
    <div className={getErrorStyles()}>
      {getErrorIcon()}
      <span className="flex-1">{error}</span>
    </div>
  );
};

const CaptchaContent: React.FC<CaptchaProps> = ({
  onChange,
  className = "",
  inputButtonStyle = "",
  refreshable = true,
  darkMode = false,
  enableAudio = true,
  showSuccessAnimation = true,
  refreshInterval = 0,
  i18n = {},
  maxAttempts,
  onRefresh,
  onAudioPlay,
  onError,
  rtl = false,
  showConfetti = false,
  confettiOptions = {},
  loadingComponent,
}) => {
  const { isFocusVisible, focusProps } = useFocusRing();
  const {
    refresh,
    isValid,
    setUserInput,
    isLoading,
    error,
    playAudio,
    currentAttempts,
  } = useCaptcha();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorSeverity, setErrorSeverity] = useState<"low" | "medium" | "high">(
    "medium"
  );

  // Extract error severity from error message (this is a simple approach)
  React.useEffect(() => {
    if (error) {
      if (
        error.includes("attempt") ||
        error.includes("Audio") ||
        error.includes("Enter")
      ) {
        setErrorSeverity("low");
      } else if (
        error.includes("blocked") ||
        error.includes("unavailable") ||
        error.includes("server")
      ) {
        setErrorSeverity("high");
      } else {
        setErrorSeverity("medium");
      }

      // Call onError prop if provided
      onError?.(error);
    }
  }, [error, onError]);

  const handleRefresh = async () => {
    setUserInput("");
    setIsRefreshing(true);
    try {
      await refresh();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleAudioPlay = async () => {
    setIsPlayingAudio(true);
    try {
      await playAudio();
      if (onAudioPlay) onAudioPlay();
    } catch (error) {
      console.error("Audio play failed:", error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  React.useEffect(() => {
    if (isValid) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isValid]);

  const mergedI18n = { ...defaultI18n, ...i18n };

  if (isLoading && loadingComponent) {
    return <div className={className}>{loadingComponent}</div>;
  }

  const isHighSeverityError = errorSeverity === "high";
  const shouldDisableInteraction = isLoading || isHighSeverityError;

  return (
    <div
      className={`w-full max-w-md transition-all duration-200
        ${darkMode ? "text-white" : "text-gray-900"}
        ${className}
        ${rtl ? "direction-rtl rtl" : ""}`}
      {...focusProps}
      dir={rtl ? "rtl" : undefined}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">
            {mergedI18n.securityCheck}
          </span>
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        </div>
        <div className="flex items-center gap-1.5">
          {enableAudio && (
            <button
              onClick={handleAudioPlay}
              disabled={isPlayingAudio || shouldDisableInteraction}
              className={`p-1.5 rounded-md transition-colors disabled:opacity-50
              ${
                darkMode
                  ? "hover:bg-gray-800 active:bg-gray-700"
                  : "hover:bg-gray-100 active:bg-gray-200"
              }
              ${isPlayingAudio ? "animate-pulse" : ""}
              ${shouldDisableInteraction ? "cursor-not-allowed" : ""}`}
              aria-label={mergedI18n.listenToCaptcha}
              title={
                shouldDisableInteraction
                  ? "Audio unavailable"
                  : mergedI18n.listenToCaptcha
              }
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          {refreshable && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || shouldDisableInteraction}
              className={`p-1.5 rounded-md transition-colors disabled:opacity-50
                ${
                  darkMode
                    ? "hover:bg-gray-800 active:bg-gray-700"
                    : "hover:bg-gray-100 active:bg-gray-200"
                }
                ${isRefreshing || isLoading ? "animate-spin" : ""}
                ${shouldDisableInteraction ? "cursor-not-allowed" : ""}`}
              aria-label={mergedI18n.refreshCaptcha}
              title={
                shouldDisableInteraction
                  ? "Refresh unavailable"
                  : mergedI18n.refreshCaptcha
              }
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <ErrorDisplay
          error={error}
          severity={errorSeverity}
          darkMode={darkMode}
        />
      )}

      {showSuccessAnimation && showSuccess && (
        <CaptchaSuccess
          darkMode={darkMode}
          i18n={i18n}
          showConfetti={showConfetti}
          confettiOptions={confettiOptions}
        />
      )}

      <div
        className={`rounded-lg border shadow-sm transition-all duration-200 ${
          darkMode
            ? "border-gray-700 bg-gray-900 shadow-gray-900/50"
            : "border-gray-200 bg-white"
        } ${isHighSeverityError ? "opacity-60" : ""}`}
      >
        <div
          className={`p-3 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`transition-opacity duration-300 ${
              isRefreshing || isLoading ? "opacity-50" : "opacity-100"
            } ${isFocusVisible ? "border-2 border-blue-500" : ""}`}
          >
            <CaptchaCanvas darkMode={darkMode} height={60} />
          </div>
        </div>
        {refreshInterval > 0 && (
          <CaptchaTimer
            duration={refreshInterval}
            darkMode={darkMode}
            onExpire={() => refresh()}
          />
        )}
        <div
          className={`${
            isFocusVisible ? "border-2 border-blue-500 p-3" : "p-3"
          }`}
        >
          <CaptchaInput
            onChange={onChange}
            darkMode={darkMode}
            className={inputButtonStyle}
            i18n={i18n}
            disabled={shouldDisableInteraction}
          />
        </div>
      </div>

      {typeof maxAttempts === "number" && (
        <CaptchaAttempts
          current={currentAttempts}
          max={maxAttempts}
          darkMode={darkMode}
          i18n={i18n}
        />
      )}

      <div
        className={`mt-1.5 text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } ${isHighSeverityError ? "opacity-60" : ""}`}
      >
        {enableAudio &&
          !isHighSeverityError &&
          ` ${mergedI18n.pressSpaceToHearCode} •`}{" "}
        {!isHighSeverityError && `${mergedI18n.enterToValidate} •`}
        {!isHighSeverityError && mergedI18n.escToClear}
        {isHighSeverityError &&
          "Service temporarily unavailable. Please try again later."}
      </div>
    </div>
  );
};

export const Captcha: React.FC<CaptchaProps> = (props) => {
  return (
    <CaptchaProvider
      type={props.type}
      length={props.length}
      caseSensitive={props.caseSensitive}
      customCharacters={props.customCharacters}
      validationRules={props.validationRules}
      onValidate={props.onValidate}
      maxAttempts={props.maxAttempts}
      onFail={props.onFail}
    >
      <CaptchaContent {...props} />
    </CaptchaProvider>
  );
};
