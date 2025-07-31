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

## Installation

```bash
npm install recaptz
```

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
| `showConfetti`         | `boolean`                           | `true`    | Enable or disable confetti animation on success |
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

You can customize the confetti animation that plays on successful validation:

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

#### Disable Confetti

```tsx
<Captcha showConfetti={false} />
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
