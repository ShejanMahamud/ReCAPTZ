export { Captcha } from "./components/Captcha";
export { useCaptcha } from "./context/CaptchaContext";

// Hooks-based API for edge cases
export {
  useCaptchaAttempts,
  useCaptchaAudio,
  useCaptchaGenerator,
  useCaptchaState,
  useCaptchaValidator,
  useCaptchaWithAutoRefresh,
  useCaptchaWithInterval,
} from "./hooks";

export type {
  CaptchaAttempts,
  CaptchaAudio,
  CaptchaConfig,
  CaptchaGenerator,
  CaptchaI18n,
  CaptchaProps,
  CaptchaState,
  CaptchaType,
  CaptchaValidator,
  ConfettiOptions,
  ValidationRules,
} from "./types/index";

import "./index.css";
