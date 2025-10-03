import { CaptchaType, MathCaptchaConfig, ValidationRules } from "../types";

interface MathProblem {
  equation: string;
  answer: number;
  operation: string;
  operand1: number;
  operand2: number;
}

// Generate math problems based on configuration
export const generateMathProblem = (config: MathCaptchaConfig = {}): MathProblem => {
  const {
    difficulty = "easy",
    operations = ["add", "subtract", "multiply"],
    numberRange,
    allowNegative = false,
    allowDecimals = false,
    displayFormat = "horizontal"
  } = config;

  // Set default number ranges based on difficulty
  let range = numberRange;
  if (!range) {
    switch (difficulty) {
      case "easy":
        range = { min: 1, max: 10 };
        break;
      case "medium":
        range = { min: 1, max: 50 };
        break;
      case "hard":
        range = { min: 1, max: 100 };
        break;
    }
  }

  // Generate random numbers within range
  const generateNumber = (): number => {
    const num = Math.floor(Math.random() * (range!.max - range!.min + 1)) + range!.min;
    return allowNegative && Math.random() < 0.3 ? -num : num;
  };

  let operand1 = generateNumber();
  let operand2 = generateNumber();

  // Select random operation
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let answer: number;
  let equation: string;

  switch (operation) {
    case "add":
      answer = operand1 + operand2;
      equation = displayFormat === "vertical"
        ? `  ${operand1}\n+ ${operand2}\n----\n  ?`
        : `${operand1} + ${operand2} = ?`;
      break;

    case "subtract":
      // Ensure positive result for easy difficulty
      if (difficulty === "easy" && operand1 < operand2) {
        [operand1, operand2] = [operand2, operand1];
      }
      answer = operand1 - operand2;
      equation = displayFormat === "vertical"
        ? `  ${operand1}\n- ${operand2}\n----\n  ?`
        : `${operand1} - ${operand2} = ?`;
      break;

    case "multiply":
      // Keep numbers smaller for multiplication
      operand1 = Math.min(operand1, difficulty === "easy" ? 5 : 12);
      operand2 = Math.min(operand2, difficulty === "easy" ? 5 : 12);
      answer = operand1 * operand2;
      equation = displayFormat === "vertical"
        ? `  ${operand1}\n× ${operand2}\n----\n  ?`
        : `${operand1} × ${operand2} = ?`;
      break;

    case "divide":
      // Ensure clean division
      operand2 = Math.max(1, Math.min(operand2, 10));
      answer = Math.floor(operand1 / operand2);
      operand1 = answer * operand2; // Ensure exact division

      if (!allowDecimals && operand1 % operand2 !== 0) {
        operand1 = answer * operand2;
      }

      equation = displayFormat === "vertical"
        ? `${operand1} ÷ ${operand2} = ?`
        : `${operand1} ÷ ${operand2} = ?`;
      break;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return {
    equation,
    answer,
    operation,
    operand1,
    operand2
  };
};

export const generateCaptcha = (
  type: CaptchaType,
  length: number,
  customCharacters?: string,
  mathConfig?: MathCaptchaConfig
): string => {
  // For slider captcha, return a placeholder as the validation is handled differently
  if (type === "slider") {
    return "SLIDER_CAPTCHA";
  }

  // For math captcha, generate a math problem
  if (type === "math") {
    const problem = generateMathProblem(mathConfig);
    return problem.equation;
  }

  // For pattern captcha, return a placeholder as the validation is handled differently
  if (type === "pattern") {
    return "PATTERN_CAPTCHA";
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

  if (!characters) {
    throw new Error("No characters available for CAPTCHA generation");
  }

  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Helper function to calculate the answer from a displayed math equation
const calculateMathAnswer = (equation: string): number => {
  // Handle vertical format (contains newlines)
  if (equation.includes('\n')) {
    const lines = equation.split('\n').filter(line => line.trim() !== '' && !line.includes('----') && !line.includes('?'));

    if (lines.length >= 2) {
      const firstLine = lines[0].trim();
      const secondLine = lines[1].trim();

      // Extract numbers and operator
      const firstNum = parseFloat(firstLine);
      const operator = secondLine.charAt(0);
      const secondNum = parseFloat(secondLine.substring(1).trim());

      return calculateOperation(firstNum, operator, secondNum);
    }
  }

  // Handle horizontal format
  const parts = equation.replace(/\s/g, '').replace('=?', '');

  // Find the operator
  let operator = '';
  let operatorIndex = -1;

  for (let i = 1; i < parts.length; i++) { // Start at 1 to allow negative numbers
    const char = parts[i];
    if (['+', '-', '×', '÷'].includes(char)) {
      operator = char;
      operatorIndex = i;
      break;
    }
  }

  if (operatorIndex === -1) {
    throw new Error('No operator found in equation');
  }

  const firstNum = parseFloat(parts.substring(0, operatorIndex));
  const secondNum = parseFloat(parts.substring(operatorIndex + 1));

  return calculateOperation(firstNum, operator, secondNum);
};

// Helper function to perform the actual calculation
const calculateOperation = (num1: number, operator: string, num2: number): number => {
  switch (operator) {
    case '+':
      return num1 + num2;
    case '-':
      return num1 - num2;
    case '×':
      return num1 * num2;
    case '÷':
      return Math.round((num1 / num2) * 100) / 100; // Round to 2 decimal places
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
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

  // Handle math captcha validation
  if (captcha.includes("=") || captcha.includes("?")) {
    const userAnswer = parseFloat(input.trim());

    if (isNaN(userAnswer)) {
      return {
        isValid: false,
        error: i18n.invalidMathAnswer || "Please enter a valid number",
      };
    }

    // Parse the displayed equation to get the correct answer
    const correctAnswer = calculateMathAnswer(captcha);

    return {
      isValid: userAnswer === correctAnswer,
      error: userAnswer === correctAnswer ? null : (i18n.incorrectMathAnswer || "Incorrect answer. Please try again."),
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
