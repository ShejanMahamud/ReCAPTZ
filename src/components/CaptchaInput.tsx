import { AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useCaptcha } from "../context/CaptchaContext";
import { CaptchaI18n } from "../types";

interface CaptchaInputProps {
  className?: string;
  onChange?: (value: string) => void;
  darkMode?: boolean;
  i18n?: CaptchaI18n;
  disabled?: boolean;
  disableSpaceToHear?: boolean;
}

export const CaptchaInput: React.FC<CaptchaInputProps> = ({
  className,
  onChange,
  darkMode = false,
  i18n = {},
  disabled = false,
  disableSpaceToHear = false,
}) => {
  const {
    userInput,
    setUserInput,
    validate,
    error,
    isValid,
    captchaText,
    isLoading,
    playAudio,
  } = useCaptcha();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = async (e: KeyboardEvent) => {
      if (disabled || isLoading) return;

      if (
        e.code === "Space" &&
        document.activeElement !== inputRef.current &&
        !disableSpaceToHear
      ) {
        e.preventDefault();
        handleSpeakCaptcha();
      }
      if (e.code === "Escape") {
        setUserInput("");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [captchaText, disabled, isLoading, disableSpaceToHear]);

  const handleSpeakCaptcha = () => {
    if (disabled || isLoading || isSpeaking) return;

    setIsSpeaking(true);
    try {
      playAudio();
    } catch (error) {
      // Silently handle audio playback failure
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;
    setUserInput(value);
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Enter") {
      e.preventDefault();
      validate();
    } else if (e.key === " " && !disableSpaceToHear) {
      e.preventDefault();
      handleSpeakCaptcha();
    }
  };

  const handleValidate = async () => {
    if (disabled || isLoading) return;
    await validate();
  };

  const mergedI18n = {
    inputPlaceholder: "Enter the code above",
    verifyButton: "Verify",
    verificationSuccessful: "Verification successful",
    ...i18n,
  };

  const isInputDisabled = disabled || isLoading;

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          disabled={isInputDisabled}
          className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200
            ${error
              ? `${darkMode
                ? "border-red-500/50 bg-red-500/5"
                : "border-red-300 bg-red-50"
              } focus:ring-red-200`
              : isValid
                ? `${darkMode
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-green-300 bg-green-50"
                } focus:ring-green-200`
                : darkMode
                  ? "border-gray-700 bg-gray-800/50 focus:border-blue-500/50"
                  : "border-gray-200 bg-white focus:border-blue-400"
            }
            ${darkMode
              ? "text-white placeholder-gray-500"
              : "text-gray-900 placeholder-gray-400"
            }
            ${isInputDisabled ? "opacity-50 cursor-not-allowed" : ""}
            focus:outline-hidden focus:ring-2 focus:ring-offset-0 border`}
          placeholder={mergedI18n.inputPlaceholder}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "captcha-error" : undefined}
        />
        {error && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <AlertCircle
              className={`w-4 h-4 ${darkMode ? "text-red-400" : "text-red-500"
                }`}
            />
          </div>
        )}
        {isValid && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <CheckCircle2
              className={`w-4 h-4 ${darkMode ? "text-green-400" : "text-green-500"
                }`}
            />
          </div>
        )}
      </div>

      <button
        onClick={handleValidate}
        disabled={isInputDisabled}
        className={`${className} w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium
          transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-0
          ${isInputDisabled ? "opacity-50 cursor-not-allowed" : ""}
          ${darkMode
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50 text-white"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 text-white"
          }`}
      >
        <ShieldCheck className="w-4 h-4" />
        {mergedI18n.verifyButton}
      </button>

      {error && (
        <div
          id="captcha-error"
          className={`text-xs ${darkMode ? "text-red-400" : "text-red-600"}`}
        >
          {error}
        </div>
      )}

      {isValid && (
        <div
          className={`text-xs flex items-center gap-1.5 ${darkMode ? "text-green-400" : "text-green-600"
            }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {mergedI18n.verificationSuccessful}
        </div>
      )}
    </div>
  );
};
