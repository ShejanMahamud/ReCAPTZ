import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CaptchaContextType, CaptchaProps, ValidationRules } from "../types";
import { generateCaptcha, validateCaptcha } from "../utils/captchaGenerator";
import { modeManager } from "../utils/captchaMode";
import { CaptchaError } from "../utils/recaptzClient";

const CaptchaContext = createContext<CaptchaContextType | null>(null);

export const CaptchaProvider: React.FC<{
  children: React.ReactNode;
  type?: CaptchaProps["type"];
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  onValidate?: (isValid: boolean) => void;
  maxAttempts: number | undefined;
  i18n?: any;
  onFail?: () => void;
}> = ({
  children,
  type = "mixed",
  length = 6,
  caseSensitive = false,
  customCharacters,
  validationRules,
  onValidate,
  maxAttempts,
  i18n = {},
  onFail,
}) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [errorSeverity, setErrorSeverity] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [retryCount, setRetryCount] = useState(0);
  const [currentMode, setCurrentMode] = useState<"client" | "server">("client");

  // Generate initial CAPTCHA on mount
  useEffect(() => {
    generateCaptchaWithAutoMode();
  }, []);

  const handleError = useCallback((err: unknown, fallbackMessage: string) => {
    if (err instanceof CaptchaError) {
      setError(err.message);
      setErrorSeverity(err.severity);
      return err;
    } else {
      const errorMessage = err instanceof Error ? err.message : fallbackMessage;
      setError(errorMessage);
      setErrorSeverity("medium");
      console.error("Unexpected error:", err);
      return new Error(errorMessage);
    }
  }, []);

  const generateCaptchaWithAutoMode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorSeverity("medium");

    try {
      const mode = await modeManager.getCurrentMode();
      setCurrentMode(mode);

      if (mode === "server") {
        const client = modeManager.getServerClient();
        if (client) {
          const session = await client.generate({
            type: type === "custom" ? "mixed" : type,
            length,
            caseSensitive,
            maxAttempts: maxAttempts || 3,
            enableAudio: true,
            showSuccessAnimation: true,
          });

          setCaptchaText(session.challengeText);
          setSessionToken(session.sessionToken);
          setStartTime(Date.now());
          setRetryCount(0);
          return;
        }
      }

      // Fallback to client mode
      setCurrentMode("client");
      const clientCaptcha = generateCaptcha(
        type || "mixed",
        length,
        customCharacters
      );
      setCaptchaText(clientCaptcha);
      setSessionToken(null);
      setStartTime(Date.now());
      setRetryCount(0);
    } catch (err) {
      const captchaError = handleError(err, "Failed to generate CAPTCHA");

      // For high severity errors, don't auto-retry
      if (
        captchaError instanceof CaptchaError &&
        captchaError.severity === "high"
      ) {
        console.error(
          "High severity error, manual intervention required:",
          captchaError
        );
        return;
      }

      // Implement exponential backoff for retries
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          generateCaptchaWithAutoMode();
        }, delay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    type,
    length,
    caseSensitive,
    customCharacters,
    maxAttempts,
    retryCount,
    handleError,
  ]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorSeverity("medium");
    setUserInput("");
    setIsValid(false);
    setAttempts(0);

    try {
      const mode = await modeManager.getCurrentMode();
      setCurrentMode(mode);

      if (mode === "server" && sessionToken) {
        const client = modeManager.getServerClient();
        if (client) {
          try {
            const session = await client.refresh(sessionToken, {
              reason: "manual",
            });

            setCaptchaText(session.challengeText);
            setSessionToken(session.sessionToken);
            setStartTime(Date.now());
            setRetryCount(0);
            return;
          } catch (refreshError) {
            // If refresh fails, fall back to generating new CAPTCHA
            if (
              refreshError instanceof CaptchaError &&
              refreshError.severity !== "high"
            ) {
              console.info(
                "Refresh failed, generating new CAPTCHA:",
                refreshError.message
              );
              await generateCaptchaWithAutoMode();
              return;
            }
            throw refreshError;
          }
        }
      }

      // Client mode or fallback
      await generateCaptchaWithAutoMode();
    } catch (err) {
      handleError(err, "Failed to refresh CAPTCHA");
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, generateCaptchaWithAutoMode, handleError]);

  const validate = useCallback(async (): Promise<boolean> => {
    if (attempts >= (maxAttempts || 3)) {
      setError("Maximum attempts reached. Please refresh the CAPTCHA.");
      setErrorSeverity("medium");
      await refresh();
      return false;
    }

    if (!userInput.trim()) {
      setError("Please enter the CAPTCHA code.");
      setErrorSeverity("low");
      return false;
    }

    setIsLoading(true);
    setError(null);
    setErrorSeverity("medium");

    try {
      const mode = await modeManager.getCurrentMode();
      let result = false;

      if (mode === "server" && sessionToken) {
        const client = modeManager.getServerClient();
        if (client) {
          const timeTaken = Date.now() - startTime;
          const serverResult = await client.verify(sessionToken, userInput, {
            timeTaken,
            attempts: attempts + 1,
            inputMethod: "keyboard",
          });

          result = serverResult.success;
          setIsValid(result);

          if (result) {
            onValidate?.(true);
            setError(null);
          } else {
            setAttempts((prev) => prev + 1);
            const remainingAttempts = serverResult.attemptsRemaining;

            if (remainingAttempts > 0) {
              setError(
                `Incorrect code. ${remainingAttempts} attempt${
                  remainingAttempts !== 1 ? "s" : ""
                } remaining.`
              );
              setErrorSeverity("low");
            } else {
              setError("Maximum attempts reached. Generating a new CAPTCHA.");
              setErrorSeverity("medium");
              setTimeout(async () => {
                await refresh();
              }, 1500);
            }

            onValidate?.(false);
            onFail?.();
          }

          return result;
        }
      }

      // Client mode validation
      const rules = {
        ...validationRules,
        caseSensitive,
        allowedCharacters: customCharacters,
        minLength: length,
        maxLength: length,
      };

      const { isValid: valid, error: validationError } = validateCaptcha(
        userInput,
        captchaText,
        rules,
        i18n
      );

      setIsValid(valid);
      result = valid;

      if (!valid) {
        setAttempts((prev) => prev + 1);
        setError(validationError);
        setErrorSeverity("low");

        if (attempts + 1 >= (maxAttempts || 3)) {
          setTimeout(async () => {
            await refresh();
          }, 1500);
        }

        onValidate?.(false);
        onFail?.();
      } else {
        setError(null);
        onValidate?.(true);
      }

      return result;
    } catch (err) {
      const captchaError = handleError(err, "Verification failed");
      setAttempts((prev) => prev + 1);
      onValidate?.(false);
      onFail?.();

      // For certain errors, auto-refresh
      if (captchaError instanceof CaptchaError) {
        if (
          captchaError.type === "NotFound" ||
          captchaError.type === "SessionExpired"
        ) {
          setTimeout(async () => {
            await refresh();
          }, 1000);
        }
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [
    attempts,
    maxAttempts,
    userInput,
    sessionToken,
    startTime,
    onValidate,
    onFail,
    refresh,
    handleError,
    validationRules,
    caseSensitive,
    customCharacters,
    length,
    captchaText,
    i18n,
  ]);

  const playAudio = useCallback(async () => {
    try {
      const mode = await modeManager.getCurrentMode();

      if (mode === "server" && sessionToken) {
        const client = modeManager.getServerClient();
        if (client) {
          try {
            const audioData = await client.getAudio(sessionToken);

            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(
                audioData.audioText
              );
              utterance.rate = audioData.audioConfig.rate;
              utterance.pitch = audioData.audioConfig.pitch;
              utterance.volume = audioData.audioConfig.volume;
              window.speechSynthesis.speak(utterance);
              return;
            }
          } catch (err) {
            console.info("Server audio failed, using fallback:", err);
          }
        }
      }

      // Client mode audio or fallback
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance();
          utterance.text = Array.from(captchaText).join(" ");
          utterance.rate = 0.7;
          utterance.pitch = 1;
          utterance.volume = 1;
          window.speechSynthesis.speak(utterance);
        } catch (fallbackErr) {
          setError("Audio is temporarily unavailable.");
          setErrorSeverity("low");
        }
      } else {
        setError("Audio is not supported in your browser.");
        setErrorSeverity("low");
      }
    } catch (err) {
      setError("Audio playback failed.");
      setErrorSeverity("low");
    }
  }, [sessionToken, captchaText]);

  // Auto-clear low severity errors
  useEffect(() => {
    if (error && errorSeverity === "low") {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, errorSeverity]);

  return (
    <CaptchaContext.Provider
      value={{
        captchaText,
        userInput,
        isValid,
        error,
        refresh,
        setUserInput,
        validate,
        currentAttempts: attempts,
        maxAttempts,
        i18n,
        isLoading,
        sessionToken,
        playAudio,
      }}
    >
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = () => {
  const context = useContext(CaptchaContext);
  if (!context) {
    throw new Error("useCaptcha must be used within a CaptchaProvider");
  }
  return context;
};
