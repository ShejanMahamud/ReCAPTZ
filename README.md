# ReCAPTZ

A modern, customizable CAPTCHA component for React applications with TypeScript support. This package provides multiple CAPTCHA types, validation rules, and a beautiful UI out of the box.

## Features

- 🎨 **Beautiful Design**: Modern, clean UI with dark mode support and gradient effects
- 🔒 **Multiple CAPTCHA Types**: Numbers, letters, mixed, or custom characters
- 🎯 **Validation Rules**: Extensive validation options including custom validators
- ♿ **Accessibility**: Screen reader support and keyboard navigation
- 🌙 **Dark Mode**: Built-in dark mode support with automatic theme detection
- 🎵 **Audio Support**: Text-to-speech for visually impaired users
- 🔄 **Refreshable**: Easy CAPTCHA refresh with animation
- ✨ **Customizable**: Extensive styling and validation options
- 📱 **Responsive**: Works on all screen sizes
- 🎯 **Form Integration**: Works with React Hook Form, Formik, and other form libraries
- 🔍 **TypeScript**: Full TypeScript support with type definitions
- 📦 **Zero Dependencies**: Minimal bundle size with no external dependencies
- 🌐 **Browser Support**: Works in all modern browsers
- 🔧 **Easy Integration**: Simple API with comprehensive documentation
- 🪝 **Hooks-based API**: Granular control for edge cases and custom implementations

## Installation

```bash
npm install recaptz
```

## Drop-in Usage (30 seconds)

The fastest way to get started - copy and paste this complete example:

```tsx
import { Captcha } from "recaptz";
import { useState } from "react";

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Security Check</h2>
      <Captcha
        onValidate={(isValid) => setIsVerified(isValid)}
        onSuccess={() => alert("Verified! You can now proceed.")}
      />
      {isVerified && (
        <div style={{ color: "green", marginTop: "10px" }}>
          ✅ CAPTCHA verified successfully!
        </div>
      )}
    </div>
  );
}

export default App;
```

**That's it!** This gives you a fully functional CAPTCHA with:

- ✨ Beautiful default styling
- 🔄 Refresh functionality
- 🎵 Audio support
- ♿ Full accessibility
- 📱 Mobile responsive design

## React Compatibility

ReCAPTZ supports React 19.0.0+ and is fully compatible with the latest React features:

- ✅ **React 19.1.0**: Full compatibility with latest React internals
- ✅ **Next.js 15.4.4**: Works seamlessly with latest Next.js
- ✅ **Concurrent Features**: Compatible with React's concurrent rendering
- ✅ **Strict Mode**: Works correctly in React Strict Mode

**Minimum Requirements:**

- React ≥ 19.0.0
- React DOM ≥ 19.0.0

**Peer Dependencies:**

```json
{
  "react": ">=19.0.0",
  "react-dom": ">=19.0.0"
}
```

## Quick Start

```tsx
import { Captcha } from "recaptz";

function App() {
  const handleValidate = (isValid: boolean) => {
    if (isValid) {
      console.log("CAPTCHA validated successfully");
    }
  };

  return <Captcha type="mixed" length={6} onValidate={handleValidate} />;
}
```

## Localization (i18n)

You can localize all user-facing strings by passing the `i18n` prop to the `Captcha` component. Provide only the keys you want to override; all others will use English defaults.

### Example: Arabic (RTL)

```tsx
<Captcha
  rtl
  i18n={{
    securityCheck: "التحقق الأمني",
    listenToCaptcha: "استمع إلى كابتشا",
    refreshCaptcha: "تحديث كابتشا",
    inputPlaceholder: "أدخل الرمز أعلاه",
    pressSpaceToHearCode: "اضغط المسافة لسماع الرمز",
    enterToValidate: "إنتر: تحقق",
    escToClear: "إسك: مسح",
    verifyButton: "تحقق",
    verificationSuccessful: "تم التحقق!",
    attemptsRemaining: (n) => `المحاولات المتبقية: ${n}`,
    captchaRequired: "يرجى إدخال كابتشا",
    minLength: (min) => `الحد الأدنى ${min} أحرف`,
    maxLength: (max) => `الحد الأقصى ${max} أحرف`,
    invalidCharacters: (chars) => `أحرف غير صالحة: ${chars}`,
    customValidationFailed: "فشل التحقق المخصص",
    captchaDoesNotMatch: "كابتشا غير متطابقة",
  }}
/>
```

> **Note:** The `rtl` prop is only needed for right-to-left languages. The package includes built-in CSS for RTL support.

### Example: German (LTR)

```tsx
<Captcha
  i18n={{
    securityCheck: "Sicherheitsüberprüfung",
    listenToCaptcha: "CAPTCHA anhören",
    refreshCaptcha: "CAPTCHA neu laden",
    inputPlaceholder: "Code eingeben",
    pressSpaceToHearCode: "Leertaste: Code anhören",
    enterToValidate: "Enter: Prüfen",
    escToClear: "Esc: Löschen",
    verifyButton: "Prüfen",
    verificationSuccessful: "Erfolg!",
    attemptsRemaining: (n) => `${n} Versuche übrig`,
    captchaRequired: "Bitte CAPTCHA eingeben",
    minLength: (min) => `Mindestens ${min} Zeichen`,
    maxLength: (max) => `Maximal ${max} Zeichen`,
    invalidCharacters: (chars) => `Ungültige Zeichen: ${chars}`,
    customValidationFailed: "Benutzerdefinierte Validierung fehlgeschlagen",
    captchaDoesNotMatch: "CAPTCHA stimmt nicht überein",
  }}
/>
```

### i18n Keys

| Key                      | Type                      | Default (English)                              | Description               |
| ------------------------ | ------------------------- | ---------------------------------------------- | ------------------------- |
| `securityCheck`          | string                    | "Security Check"                               | Section label             |
| `listenToCaptcha`        | string                    | "Listen to CAPTCHA"                            | Audio button aria-label   |
| `refreshCaptcha`         | string                    | "Refresh CAPTCHA"                              | Refresh button aria-label |
| `inputPlaceholder`       | string                    | "Enter the code above"                         | Input placeholder         |
| `pressSpaceToHearCode`   | string                    | "Press Space to hear the code"                 | Keyboard shortcut hint    |
| `enterToValidate`        | string                    | "Enter to validate"                            | Keyboard shortcut hint    |
| `escToClear`             | string                    | "Esc to clear"                                 | Keyboard shortcut hint    |
| `verifyButton`           | string                    | "Verify"                                       | Button text               |
| `verificationSuccessful` | string                    | "Verification successful"                      | Success message           |
| `attemptsRemaining`      | (n: number) => string     | "{n} attempts remaining"                       | Attempts left message     |
| `captchaRequired`        | string                    | "CAPTCHA response is required"                 | Required error            |
| `minLength`              | (min: number) => string   | "Input must be at least {min} characters long" | Min length error          |
| `maxLength`              | (max: number) => string   | "Input cannot be longer than {max} characters" | Max length error          |
| `invalidCharacters`      | (chars: string) => string | "Invalid characters found: {chars}"            | Invalid chars error       |
| `customValidationFailed` | string                    | "Custom validation failed"                     | Custom validation error   |
| `captchaDoesNotMatch`    | string                    | "CAPTCHA does not match"                       | Mismatch error            |

## Examples

### Basic Types

#### Numbers Only

```tsx
<Captcha
  type="numbers"
  length={4}
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
    allowedCharacters: "0123456789",
    minLength: 4,
    maxLength: 4,
  }}
/>
```

#### Letters Only

```tsx
<Captcha
  type="letters"
  length={6}
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
    customValidator: (value) =>
      /^[a-zA-Z]+$/.test(value) || "Only letters are allowed",
  }}
/>
```

#### Mixed Characters

```tsx
<Captcha
  type="mixed"
  length={8}
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
    minLength: 8,
    maxLength: 8,
  }}
/>
```

### Advanced Features

#### Timed CAPTCHA

```tsx
<Captcha
  type="mixed"
  length={5}
  refreshInterval={30} // Refreshes every 30 seconds
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
    minLength: 5,
  }}
/>
```

#### Accessible CAPTCHA

```tsx
<Captcha
  type="letters"
  length={4}
  autoFocus
  showSuccessAnimation
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
  }}
/>
```

#### Dark Mode

```tsx
<Captcha
  type="mixed"
  length={6}
  darkMode
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
  }}
/>
```

#### Audio Mode

```tsx
<Captcha
  type="mixed"
  length={6}
  enableAudio
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
  }}
/>
```

#### Max Attempts

```tsx
<Captcha
  type="mixed"
  length={6}
  maxAttempts={3}
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
  }}
/>
```

#### Confetti Control

```tsx
{
  /* Custom confetti animation */
}
<Captcha
  type="mixed"
  length={6}
  showConfetti={true}
  confettiOptions={{
    particleCount: 150,
    spread: 80,
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"],
    origin: { y: 0.7 },
  }}
  onValidate={(isValid) => console.log("Valid:", isValid)}
/>;

{
  /* Disable confetti */
}
<Captcha
  type="mixed"
  length={6}
  showConfetti={false}
  onValidate={(isValid) => console.log("Valid:", isValid)}
/>;
```

## Analytics / Telemetry Hooks

You can track user interactions and events for analytics or logging by using the following props:

- `onFail`: Called whenever the user fails validation.
- `onRefresh`: Called whenever the CAPTCHA is refreshed.
- `onAudioPlay`: Called whenever the audio is played.

### Example

```tsx
<Captcha
  onFail={() => console.log("CAPTCHA failed")}
  onRefresh={() => console.log("CAPTCHA refreshed")}
  onAudioPlay={() => console.log("CAPTCHA audio played")}
/>
```

### Prop Signatures

| Prop          | Type         | Description                           |
| ------------- | ------------ | ------------------------------------- |
| `onFail`      | `() => void` | Called when the user fails validation |
| `onRefresh`   | `() => void` | Called when the CAPTCHA is refreshed  |
| `onAudioPlay` | `() => void` | Called when the audio is played       |

#### Complex Validation

```tsx
<Captcha
  customCharacters="ABCDEF123456"
  length={6}
  caseSensitive={true}
  onValidate={(isValid) => console.log("Valid:", isValid)}
  validationRules={{
    required: true,
    allowedCharacters: "ABCDEF123456",
    customValidator: (value) => {
      const hasLetter = /[A-F]/.test(value);
      const hasNumber = /[1-6]/.test(value);
      const hasMinLength = value.length >= 6;
      if (!hasLetter) return "Must contain at least one letter";
      if (!hasNumber) return "Must contain at least one number";
      if (!hasMinLength) return "Must be 6 characters long";
      return true;
    },
  }}
/>
```

### Styling

#### Custom Classes and Styles

```tsx
<Captcha
  className="my-custom-class"
  customStyles={{
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
  }}
  darkMode={true}
/>
```

### Form Integration

#### React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { Captcha } from "recaptz";

function LoginForm() {
  const { handleSubmit, setError, clearErrors } = useForm();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const onSubmit = (data) => {
    if (!isCaptchaValid) {
      setError("captcha", {
        type: "manual",
        message: "Please complete the CAPTCHA",
      });
      return;
    }
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Captcha
        type="mixed"
        length={6}
        onValidate={(isValid) => {
          setIsCaptchaValid(isValid);
          if (isValid) clearErrors("captcha");
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Formik

```tsx
import { Formik, Form } from "formik";
import { Captcha } from "recaptz";

function LoginForm() {
  return (
    <Formik
      initialValues={{ captchaValid: false }}
      onSubmit={(values) => {
        if (values.captchaValid) {
          // Handle form submission
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          {/* Form fields */}
          <Captcha
            type="mixed"
            length={6}
            onValidate={(isValid) => {
              setFieldValue("captchaValid", isValid);
            }}
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}
```

## Hooks-based API for Edge Cases

For advanced use cases where you need granular control over CAPTCHA functionality, ReCAPTZ provides a comprehensive hooks-based API. These hooks allow you to build completely custom CAPTCHA implementations while leveraging the core logic.

### Available Hooks

#### `useCaptchaGenerator`

Hook for generating CAPTCHA text with customizable configuration. Useful when you need just CAPTCHA generation without UI components.

```tsx
import { useCaptchaGenerator } from "recaptz";

function CustomCaptcha() {
  const { captchaText, refresh, generateNew } = useCaptchaGenerator({
    type: "mixed",
    length: 6,
    customCharacters: "ABCDEF123456",
  });

  return (
    <div>
      <div>Generated CAPTCHA: {captchaText}</div>
      <button onClick={refresh}>Refresh</button>
      <button onClick={() => generateNew({ length: 8 })}>
        Generate 8-character CAPTCHA
      </button>
    </div>
  );
}
```

#### `useCaptchaValidator`

Hook for validating CAPTCHA input with custom rules. Useful for custom validation logic or when building custom UI.

```tsx
import { useCaptchaValidator } from "recaptz";

function CustomValidator() {
  const { validate, validateWithRules, error, isValid } = useCaptchaValidator({
    caseSensitive: true,
    validationRules: {
      minLength: 4,
      customValidator: (value) =>
        value.includes("A") || "Must contain letter A",
    },
  });

  const handleValidation = (input: string, captcha: string) => {
    const result = validateWithRules(input, captcha);
    console.log("Validation result:", result);
  };

  return (
    <div>
      <div>Is Valid: {isValid.toString()}</div>
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

#### `useCaptchaAttempts`

Hook for managing CAPTCHA attempts and limits. Useful for implementing custom attempt limiting logic.

```tsx
import { useCaptchaAttempts } from "recaptz";

function AttemptsManager() {
  const {
    attempts,
    remainingAttempts,
    isMaxReached,
    incrementAttempts,
    resetAttempts,
  } = useCaptchaAttempts(3);

  return (
    <div>
      <div>Attempts: {attempts}/3</div>
      <div>Remaining: {remainingAttempts}</div>
      <div>Max Reached: {isMaxReached.toString()}</div>
      <button onClick={incrementAttempts} disabled={isMaxReached}>
        Try Again
      </button>
      <button onClick={resetAttempts}>Reset</button>
    </div>
  );
}
```

#### `useCaptchaAudio`

Hook for text-to-speech functionality. Useful for accessibility features in custom implementations.

```tsx
import { useCaptchaAudio } from "recaptz";

function AudioCaptcha() {
  const { speak, isSupported, isPlaying, stop } = useCaptchaAudio();

  return (
    <div>
      <div>Audio Supported: {isSupported.toString()}</div>
      <div>Playing: {isPlaying.toString()}</div>
      <button onClick={() => speak("A B C 1 2 3")} disabled={!isSupported}>
        Speak CAPTCHA
      </button>
      <button onClick={stop} disabled={!isPlaying}>
        Stop
      </button>
    </div>
  );
}
```

#### `useCaptchaState`

Comprehensive hook that combines all CAPTCHA functionality. Useful for building completely custom CAPTCHA implementations.

```tsx
import { useCaptchaState } from "recaptz";

function FullCustomCaptcha() {
  const {
    // Generator state
    captchaText,
    refresh,

    // Input state
    userInput,
    setUserInput,

    // Validation state
    isValid,
    error,
    validate,

    // Attempts state
    attempts,
    remainingAttempts,
    isMaxReached,

    // Audio functionality
    speakCaptcha,
    isAudioSupported,

    // Configuration
    config,
    updateConfig,
  } = useCaptchaState({
    type: "mixed",
    length: 6,
    maxAttempts: 3,
  });

  return (
    <div>
      <div style={{ fontFamily: "monospace", fontSize: "20px" }}>
        {captchaText}
      </div>
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter CAPTCHA"
      />
      <button onClick={validate}>Validate</button>
      <button onClick={refresh}>Refresh</button>
      {isAudioSupported && <button onClick={speakCaptcha}>🔊 Listen</button>}

      <div>
        <div>Valid: {isValid.toString()}</div>
        <div>Attempts: {attempts}</div>
        <div>Remaining: {remainingAttempts}</div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}
```

#### `useCaptchaWithInterval`

Hook for creating a CAPTCHA with automatic refresh intervals. Useful for time-sensitive CAPTCHA implementations.

```tsx
import { useCaptchaWithInterval } from "recaptz";

function TimedCaptcha() {
  const captchaState = useCaptchaWithInterval({
    type: "numbers",
    length: 4,
    refreshInterval: 30, // Refresh every 30 seconds
  });

  return (
    <div>
      <div>Auto-refreshing CAPTCHA: {captchaState.captchaText}</div>
      <div>This CAPTCHA refreshes every 30 seconds</div>
      {/* Use captchaState like useCaptchaState */}
    </div>
  );
}
```

#### `useCaptchaWithAutoRefresh`

Hook for creating a CAPTCHA that automatically refreshes on failure. Useful for implementing progressive difficulty or security measures.

```tsx
import { useCaptchaWithAutoRefresh } from "recaptz";

function ProgressiveCaptcha() {
  const { difficulty, ...captchaState } = useCaptchaWithAutoRefresh({
    type: "mixed",
    length: 4,
    refreshOnFail: true,
    progressiveDifficulty: true, // Increases difficulty on failure
  });

  return (
    <div>
      <div>Difficulty Level: {difficulty}</div>
      <div>CAPTCHA: {captchaState.captchaText}</div>
      <input
        value={captchaState.userInput}
        onChange={(e) => captchaState.setUserInput(e.target.value)}
      />
      <button onClick={captchaState.validate}>Validate</button>
      <div>Length: {captchaState.captchaText.length}</div>
    </div>
  );
}
```

### Hook Types and Interfaces

The hooks-based API provides TypeScript interfaces for all return types:

```typescript
interface CaptchaConfig {
  type?: "numbers" | "letters" | "mixed";
  length?: number;
  caseSensitive?: boolean;
  customCharacters?: string;
  validationRules?: ValidationRules;
  maxAttempts?: number;
  i18n?: CaptchaI18n;
}

interface CaptchaGenerator {
  captchaText: string;
  refresh: () => void;
  generateNew: (config?: Partial<CaptchaConfig>) => string;
}

interface CaptchaValidator {
  validate: (input: string, captcha: string) => boolean;
  validateWithRules: (
    input: string,
    captcha: string,
    rules?: ValidationRules
  ) => {
    isValid: boolean;
    error: string | null;
  };
  error: string | null;
  isValid: boolean;
}

interface CaptchaAttempts {
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;
  incrementAttempts: () => void;
  resetAttempts: () => void;
}

interface CaptchaAudio {
  speak: (text: string) => void;
  isSupported: boolean;
  isPlaying: boolean;
  stop: () => void;
}

interface CaptchaState {
  // Generator state
  captchaText: string;
  refresh: () => void;

  // Input state
  userInput: string;
  setUserInput: (input: string) => void;

  // Validation state
  isValid: boolean;
  error: string | null;
  validate: () => boolean;

  // Attempts state
  attempts: number;
  maxAttempts: number;
  remainingAttempts: number;
  isMaxReached: boolean;

  // Audio functionality
  speakCaptcha: () => void;
  isAudioSupported: boolean;
  isAudioPlaying: boolean;

  // Configuration
  config: CaptchaConfig;
  updateConfig: (newConfig: Partial<CaptchaConfig>) => void;
}
```

### Use Cases for Hooks-based API

1. **Custom UI Design**: When you need complete control over the visual appearance
2. **Integration with Existing Form Libraries**: Custom integration beyond standard form libraries
3. **Multi-step Forms**: Where CAPTCHA is part of a complex workflow
4. **A/B Testing**: Testing different CAPTCHA implementations
5. **Progressive Security**: Implementing escalating security measures
6. **Analytics Integration**: Custom tracking and analytics
7. **Accessibility Enhancements**: Custom accessibility features beyond the default
8. **Mobile-specific Implementations**: Custom mobile-optimized interfaces
9. **Gaming Applications**: CAPTCHA as part of game mechanics
10. **Enterprise Systems**: Custom validation workflows and security policies

## Props

| Prop                   | Type                                | Default   | Description                                     |
| ---------------------- | ----------------------------------- | --------- | ----------------------------------------------- |
| `type`                 | `'numbers' \| 'letters' \| 'mixed'` | `'mixed'` | Type of CAPTCHA to generate                     |
| `length`               | `number`                            | `6`       | Length of CAPTCHA text                          |
| `onChange`             | `(value: string) => void`           | -         | Callback when input changes                     |
| `onValidate`           | `(isValid: boolean) => void`        | -         | Callback when validation occurs                 |
| `className`            | `string`                            | `''`      | Additional CSS classes                          |
| `refreshable`          | `boolean`                           | `true`    | Whether CAPTCHA can be refreshed                |
| `caseSensitive`        | `boolean`                           | `false`   | Case-sensitive validation                       |
| `customCharacters`     | `string`                            | -         | Custom character set                            |
| `customStyles`         | `React.CSSProperties`               | -         | Custom inline styles                            |
| `validationRules`      | `ValidationRules`                   | -         | Custom validation rules                         |
| `darkMode`             | `boolean`                           | `false`   | Enable dark mode                                |
| `autoFocus`            | `boolean`                           | `false`   | Auto-focus the input field                      |
| `showSuccessAnimation` | `boolean`                           | `false`   | Show success animation                          |
| `refreshInterval`      | `number`                            | -         | Auto-refresh interval in seconds                |
| `maxAttempts`          | `number`                            | -         | Maximum validation attempts                     |
| `inputButtonStyle`     | `string`                            | -         | Custom class for input button styles            |
| `enableAudio`          | `boolean`                           | -         | Enable or disable audio support                 |
| `rtl`                  | `boolean`                           | `false`   | Enable right-to-left layout for RTL languages   |
| `showConfetti`         | `boolean`                           | `false`   | Enable or disable confetti animation on success |
| `confettiOptions`      | `ConfettiOptions`                   | -         | Custom confetti animation options               |

## Validation Rules

```typescript
interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: string;
  required?: boolean;
  caseSensitive?: boolean;
  customValidator?: (value: string) => boolean | string;
}
```

## Confetti Options

You can enable and customize the confetti animation that plays on successful validation. **Note: Confetti is disabled by default** and needs to be explicitly enabled.

```typescript
interface ConfettiOptions {
  particleCount?: number; // Number of confetti particles (default: 100)
  spread?: number; // Spread angle in degrees (default: 70)
  origin?: {
    // Origin point for confetti (default: { y: 0.6 })
    x?: number; // X position (0-1, default: 0.5)
    y?: number; // Y position (0-1, default: 0.6)
  };
  colors?: string[]; // Array of colors (default: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'])
  gravity?: number; // Gravity effect (default: 1)
  scalar?: number; // Particle size multiplier (default: 1)
  duration?: number; // Animation duration in ms (default: 3000)
}
```

### Examples

#### Enable Confetti (Default disabled)

```tsx
<Captcha showConfetti={true} />
```

#### Disable Confetti (Default behavior)

```tsx
<Captcha showConfetti={false} />;
{
  /* or simply omit the prop since it defaults to false */
}
<Captcha />;
```

#### Custom Confetti

```tsx
<Captcha
  showConfetti={true}
  confettiOptions={{
    particleCount: 200,
    spread: 90,
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    origin: { y: 0.8 },
  }}
/>
```

#### Subtle Confetti

```tsx
<Captcha
  confettiOptions={{
    particleCount: 50,
    spread: 45,
    scalar: 0.8,
    gravity: 0.5,
  }}
/>
```

## Keyboard Shortcuts

- `Space`: Hear the CAPTCHA code
- `Enter`: Validate the input
- `Escape`: Clear the input

## Accessibility Features

- Screen reader support with ARIA labels
- Keyboard navigation
- High contrast mode support
- Audio feedback
- Focus management
- Clear error messages
- Responsive design

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT © Shejan Mahamud
