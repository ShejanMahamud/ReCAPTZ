import { CaptchaType, ValidationRules } from "../types";

export const generateCaptcha = (
  type: CaptchaType,
  length: number,
  customCharacters?: string
): string => {
  // For slider captcha, return a placeholder as the validation is handled differently
  if (type === "slider") {
    return "SLIDER_CAPTCHA";
  }

  const numbers = "0123456789";
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";

  let characters = customCharacters;
  if (!characters) {
    switch (type) {
      case "numbers":
        characters = numbers;
        break;
      case "letters":
        characters = letters;
        break;
      case "mixed":
        characters = numbers + letters;
        break;
    }
  }

  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const validateCaptcha = (
  input: string,
  captcha: string,
  rules?: ValidationRules,
  i18n: any = {}
): { isValid: boolean; error: string | null } => {
  // Handle slider captcha validation
  if (captcha === "SLIDER_CAPTCHA") {
    // For slider captcha, if we reach here with "validated" input, it means the slider was successful
    return {
      isValid: input === "validated",
      error: input === "validated" ? null : "Please complete the slider puzzle",
    };
  }

  // Early return if input is empty but required
  if (!input && rules?.required) {
    return {
      isValid: false,
      error: i18n.captchaRequired || "CAPTCHA response is required",
    };
  }
  if (rules?.minLength && input.length < rules.minLength) {
    return {
      isValid: false,
      error: i18n.minLength
        ? i18n.minLength(rules.minLength)
        : `Input must be at least ${rules.minLength} characters long`,
    };
  }
  if (rules?.maxLength && input.length > rules.maxLength) {
    return {
      isValid: false,
      error: i18n.maxLength
        ? i18n.maxLength(rules.maxLength)
        : `Input cannot be longer than ${rules.maxLength} characters`,
    };
  }
  if (rules?.allowedCharacters) {
    const invalidChars = input
      .split("")
      .filter((char) => !rules.allowedCharacters?.includes(char));
    if (invalidChars.length > 0) {
      return {
        isValid: false,
        error: i18n.invalidCharacters
          ? i18n.invalidCharacters(invalidChars.join(", "))
          : `Invalid characters found: ${invalidChars.join(", ")}`,
      };
    }
  }
  if (rules?.customValidator) {
    const customResult = rules.customValidator(input);
    if (typeof customResult === "string") {
      return { isValid: false, error: customResult };
    }
    if (!customResult) {
      return {
        isValid: false,
        error: i18n.customValidationFailed || "Custom validation failed",
      };
    }
  }
  const isValidMatch = rules?.caseSensitive
    ? input === captcha
    : input.toLowerCase() === captcha.toLowerCase();
  return {
    isValid: isValidMatch,
    error: isValidMatch
      ? null
      : i18n.captchaDoesNotMatch || "CAPTCHA does not match",
  };
};
