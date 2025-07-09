import { useFocusRing } from "@react-aria/focus";
import { KeyRound, RefreshCw, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { CaptchaProvider, useCaptcha } from "../context/CaptchaContext";
import { CaptchaProps } from "../types";
import { CaptchaAttempts } from "./CaptchaAttempts";
import { CaptchaCanvas } from "./CaptchaCanvas";
import { CaptchaInput } from "./CaptchaInput";
import { CaptchaSuccess } from "./CaptchaSuccess";
import { CaptchaTimer } from "./CaptchaTimer";

const defaultI18n = {
  securityCheck: "Security Check",
  listenToCaptcha: "Listen to CAPTCHA",
  refreshCaptcha: "Refresh CAPTCHA",
  pressSpaceToHearCode: "Press Space to hear the code",
  enterToValidate: "Enter to validate",
  escToClear: "Esc to clear",
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
  rtl = false,
}) => {
  const { isFocusVisible, focusProps } = useFocusRing();
  const { captchaText, refresh, isValid, setUserInput } = useCaptcha();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const handleRefresh = () => {
    setUserInput("");
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 500);
    if (onRefresh) onRefresh();
  };

  const speakCaptcha = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = Array.from(captchaText).join(" ");
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") || voice.name.includes("English")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
      if (onAudioPlay) onAudioPlay();
    }
  };

  React.useEffect(() => {
    if (isValid) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [isValid]);

  const mergedI18n = { ...defaultI18n, ...i18n };

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
        </div>
        <div className="flex items-center gap-1.5">
          {enableAudio && (
            <button
              onClick={speakCaptcha}
              className={`p-1.5 rounded-md transition-colors
              ${
                darkMode
                  ? "hover:bg-gray-800 active:bg-gray-700"
                  : "hover:bg-gray-100 active:bg-gray-200"
              }`}
              aria-label={mergedI18n.listenToCaptcha}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          {refreshable && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1.5 rounded-md transition-colors
                ${
                  darkMode
                    ? "hover:bg-gray-800 active:bg-gray-700"
                    : "hover:bg-gray-100 active:bg-gray-200"
                }
                ${isRefreshing ? "animate-spin" : ""}`}
              aria-label={mergedI18n.refreshCaptcha}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {showSuccessAnimation && showSuccess && (
        <CaptchaSuccess darkMode={darkMode} i18n={i18n} />
      )}
      <div
        className={`rounded-lg border shadow-sm ${
          darkMode
            ? "border-gray-700 bg-gray-900 shadow-gray-900/50"
            : "border-gray-200 bg-white"
        }`}
      >
        <div
          className={`p-3 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div
            className={`transition-opacity duration-300 ${
              isRefreshing ? "opacity-50" : "opacity-100"
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
          />
        </div>
      </div>
      {typeof maxAttempts === "number" && (
        <CaptchaAttempts
          current={0}
          max={maxAttempts}
          darkMode={darkMode}
          i18n={i18n}
        />
      )}

      <div
        className={`mt-1.5 text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {enableAudio && ` ${mergedI18n.pressSpaceToHearCode} •`}{" "}
        {mergedI18n.enterToValidate} •{mergedI18n.escToClear}
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
