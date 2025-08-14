// Components
export { Captcha } from "./components/Captcha";
export { CaptchaAttempts } from "./components/CaptchaAttempts";
export { CaptchaCanvas } from "./components/CaptchaCanvas";
export { CaptchaInput } from "./components/CaptchaInput";
export { CaptchaSuccess } from "./components/CaptchaSuccess";
export { CaptchaTimer } from "./components/CaptchaTimer";
export { SliderCaptcha } from "./components/SliderCaptcha";

// Context
export { CaptchaProvider, useCaptcha } from "./context/CaptchaContext";

// Hooks
export {
  useCaptchaAttempts,
  useCaptchaAudio,
  useCaptchaGenerator,
  useCaptchaState,
  useCaptchaValidator,
  useCaptchaWithAutoRefresh,
  useCaptchaWithInterval,
} from "./hooks";

// Configuration API
export { modeManager as configureReCAPTZ } from "./utils/captchaMode";

// Types (only user-facing types)
export type {
  CaptchaAttempts as CaptchaAttemptsHook,
  CaptchaAudio,
  CaptchaConfig,
  CaptchaGenerator,
  CaptchaI18n,
  CaptchaProps,
  CaptchaState,
  CaptchaTheme,
  CaptchaType,
  CaptchaValidator,
  ConfettiOptions,
  SliderCaptchaConfig,
  ValidationRules,
} from "./types";

import "./index.css";
