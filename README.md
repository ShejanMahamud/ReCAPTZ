# ReCAPTZ

A modern, customizable CAPTCHA component for React applications with TypeScript support and accessibility features.

[![npm version](https://badge.fury.io/js/recaptz.svg)](https://badge.fury.io/js/recaptz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Security**: Built-in server-side validation with automatic fallback to client-side
- **Accessibility**: Screen reader support, keyboard navigation, and audio feedback
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Customizable**: Multiple CAPTCHA types, themes, and validation rules
- **Internationalization**: Multi-language support with RTL layout compatibility
- **Mobile-Friendly**: Responsive design optimized for all devices

## Installation

```bash
npm install recaptz
```

## Quick Start

```tsx
import { Captcha } from "recaptz";
import { useState } from "react";

function LoginForm() {
  const [verified, setVerified] = useState(false);

  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <Captcha
        type="numbers"
        length={4}
        onValidate={setVerified}
        validationRules={{
          required: true,
          allowedCharacters: "0123456789",
        }}
      />

      <button disabled={!verified}>Login</button>
    </form>
  );
}
```

## CAPTCHA Types

### Basic Types

```tsx
// Numbers only
<Captcha type="numbers" length={4} />

// Letters only
<Captcha type="letters" length={6} />

// Mixed characters (letters + numbers)
<Captcha type="mixed" length={8} />

// Custom character set
<Captcha
  customCharacters="ABCDEF123456"
  length={5}
  caseSensitive={true}
/>

// Slider Puzzle CAPTCHA
<Captcha
  type="slider"
  sliderConfig={{
    width: 320,
    height: 180,
    pieceSize: 42,
    tolerance: 12,
    enableShadow: true,
  }}
  showSuccessAnimation={true}
  showConfetti={true}
  onValidate={(isValid) => console.log("Slider validated:", isValid)}
/>
```

### Slider Puzzle CAPTCHA

The SliderCaptcha provides an interactive puzzle-solving experience where users drag a puzzle piece to complete an image. It's perfect for modern web applications that need a more engaging CAPTCHA experience.

#### Basic Usage

```tsx
<Captcha
  type="slider"
  onValidate={setVerified}
  showSuccessAnimation={true}
  showConfetti={true}
/>
```

#### Custom Background Images (Optional)

You can override the automatic Pexels images by providing your own:

```tsx
<Captcha
  type="slider"
  sliderConfig={{
    backgroundImage: "https://your-domain.com/custom-image.jpg",
    // OR use multiple images for variety
    backgroundImages: [
      "https://your-domain.com/image1.jpg",
      "https://your-domain.com/image2.jpg",
      "https://your-domain.com/image3.jpg",
    ],
  }}
/>
```

### Advanced Configuration

```tsx
// Timed CAPTCHA with attempt limits
<Captcha
  type="mixed"
  length={5}
  refreshInterval={30}
  maxAttempts={3}
/>

// Accessible CAPTCHA with audio support
<Captcha
  type="numbers"
  enableAudio={true}
  autoFocus={true}
/>
```

## Custom Hook Usage

Build custom CAPTCHA interfaces using the `useCaptchaState` hook:

```tsx
import { useCaptchaState, CaptchaProvider } from "recaptz";

function CustomCaptcha() {
  const {
    captchaText,
    userInput,
    setUserInput,
    validate,
    refresh,
    isValid,
    error,
  } = useCaptchaState();

  return (
    <div className="custom-captcha">
      <div className="captcha-display">{captchaText}</div>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter the code"
      />

      <div className="captcha-actions">
        <button onClick={validate}>Verify</button>
        <button onClick={refresh}>Refresh</button>
      </div>

      {isValid && <div className="success">Verified!</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

function App() {
  return (
    <CaptchaProvider type="mixed" length={6}>
      <CustomCaptcha />
    </CaptchaProvider>
  );
}
```

### Hook API

The `useCaptchaState` hook returns:

```tsx
interface CaptchaState {
  captchaText: string; // Current CAPTCHA text
  userInput: string; // User's input value
  setUserInput: (input: string) => void; // Update user input
  validate: () => Promise<boolean>; // Validate the input
  refresh: () => Promise<void>; // Generate new CAPTCHA
  isValid: boolean; // Current validation state
  error: string | null; // Current error message
}
```

## Validation Rules

Configure custom validation with the `ValidationRules` interface:

```tsx
interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: string;
  required?: boolean;
  caseSensitive?: boolean;
  customValidator?: (value: string) => boolean | string;
}

// Example with complex validation
<Captcha
  validationRules={{
    required: true,
    minLength: 4,
    maxLength: 8,
    allowedCharacters: "ABCDEF123456",
    customValidator: (value) => {
      const hasLetter = /[A-F]/.test(value);
      const hasNumber = /[1-6]/.test(value);
      if (!hasLetter) return "Must contain at least one letter";
      if (!hasNumber) return "Must contain at least one number";
      return true;
    },
  }}
/>;
```

## Styling and Theming

### Custom Styles

```tsx
<Captcha
  className="my-custom-captcha"
  customStyles={{
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  }}
/>

// Dark theme
<Captcha
  darkMode={true}
  customStyles={{
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
  }}
/>
```

### CSS Customization

```css
.my-custom-captcha {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.my-custom-captcha input {
  border-radius: 8px;
  border: 2px solid #e1e5e9;
  padding: 12px;
  font-size: 16px;
}

.my-custom-captcha button {
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.2s;
}
```

## Success Animations

Configure success animations and confetti effects:

```tsx
interface ConfettiOptions {
  particleCount?: number; // Number of particles (default: 100)
  spread?: number; // Spread angle in degrees (default: 45)
  origin?: { x?: number; y?: number }; // Origin point (default: center)
  colors?: string[]; // Custom colors array
  gravity?: number; // Gravity effect (default: 1)
  scalar?: number; // Particle size multiplier (default: 1)
  duration?: number; // Animation duration in ms (default: 3000)
}

<Captcha
  showConfetti={true}
  confettiOptions={{
    particleCount: 200,
    spread: 70,
    colors: ["#ff0000", "#00ff00", "#0000ff"],
    duration: 5000,
    gravity: 0.8,
    scalar: 1.2,
  }}
/>;
```

## Custom Components

Replace default components with custom implementations:

```tsx
<Captcha
  loadingComponent={
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Generating CAPTCHA...</span>
    </div>
  }
  successComponent={
    <div className="flex items-center gap-2 text-green-600">
      <span className="font-semibold">Verification Successful!</span>
    </div>
  }
  errorComponent={({ error, severity }) => (
    <div
      className={`p-3 rounded-lg ${
        severity === "high"
          ? "bg-red-100 text-red-800"
          : severity === "medium"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-blue-100 text-blue-800"
      }`}
    >
      {error}
    </div>
  )}
/>
```

## Event Handling

Handle CAPTCHA events for analytics and debugging:

```tsx
const handleCaptchaEvents = {
  onChange: (value) => console.log("Input changed:", value),
  onValidate: (isValid) => console.log("Validation result:", isValid),
  onRefresh: () => console.log("CAPTCHA refreshed"),
  onAudioPlay: () => console.log("Audio played"),
  onError: (error) => console.error("CAPTCHA error:", error),
  onFail: () => console.log("Validation failed"),
  onSuccess: () => console.log("Validation succeeded"),
};

<Captcha
  {...handleCaptchaEvents}
  maxAttempts={3}
  showSuccessAnimation={true}
/>;
```

## Internationalization

### Multi-Language Support

```tsx
// German
<Captcha
  i18n={{
    securityCheck: "Sicherheitsüberprüfung",
    listenToCaptcha: "CAPTCHA anhören",
    refreshCaptcha: "CAPTCHA neu laden",
    inputPlaceholder: "Code eingeben",
    verifyButton: "Prüfen",
    verificationSuccessful: "Erfolg!",
    captchaRequired: "Bitte CAPTCHA eingeben",
    captchaDoesNotMatch: "CAPTCHA stimmt nicht überein",
  }}
/>

// Arabic (RTL)
<Captcha
  rtl={true}
  i18n={{
    securityCheck: "فحص الأمان",
    inputPlaceholder: "أدخل الرمز",
    verifyButton: "تحقق",
    refreshCaptcha: "رمز جديد",
  }}
/>
```

## Accessibility

ReCAPTZ includes comprehensive accessibility features:

- **Audio Support**: Text-to-speech for visually impaired users
- **Keyboard Navigation**: Full keyboard support with proper focus management
- **Screen Reader Support**: ARIA labels and semantic markup
- **High Contrast**: Compatible with high contrast and dark modes
- **Mobile Optimization**: Touch-optimized interface

### Keyboard Shortcuts

| Key    | Action                |
| ------ | --------------------- |
| Space  | Hear the CAPTCHA code |
| Enter  | Validate the input    |
| Escape | Clear the input       |

```tsx
// Enable all accessibility features
<Captcha
  enableAudio={true}
  autoFocus={true}
  i18n={{
    pressSpaceToHearCode: "Press Space to hear the code",
    enterToValidate: "Press Enter to validate",
    escToClear: "Press Escape to clear",
  }}
/>
```

## API Reference

| Property               | Type                                | Default   | Description                        |
| ---------------------- | ----------------------------------- | --------- | ---------------------------------- |
| `type`                 | `'numbers' \| 'letters' \| 'mixed'` | `'mixed'` | Type of CAPTCHA to generate        |
| `length`               | `number`                            | `6`       | Length of CAPTCHA text             |
| `onChange`             | `(value: string) => void`           | -         | Callback when input changes        |
| `onValidate`           | `(isValid: boolean) => void`        | -         | Callback when validation occurs    |
| `onRefresh`            | `() => void`                        | -         | Callback when CAPTCHA is refreshed |
| `onAudioPlay`          | `() => void`                        | -         | Callback when audio is played      |
| `onError`              | `(error: string) => void`           | -         | Callback when error occurs         |
| `onFail`               | `() => void`                        | -         | Callback when validation fails     |
| `onSuccess`            | `() => void`                        | -         | Callback when validation succeeds  |
| `className`            | `string`                            | `''`      | Additional CSS classes             |
| `customStyles`         | `React.CSSProperties`               | -         | Custom inline styles               |
| `inputButtonStyle`     | `string`                            | `''`      | Input button styles                |
| `refreshable`          | `boolean`                           | `true`    | Whether CAPTCHA can be refreshed   |
| `caseSensitive`        | `boolean`                           | `false`   | Case-sensitive validation          |
| `customCharacters`     | `string`                            | -         | Custom character set               |
| `validationRules`      | `ValidationRules`                   | -         | Custom validation rules            |
| `darkMode`             | `boolean`                           | `false`   | Enable dark mode theme             |
| `autoFocus`            | `boolean`                           | `false`   | Auto-focus the input field         |
| `enableAudio`          | `boolean`                           | `true`    | Enable audio support               |
| `disableSpaceToHear`   | `boolean`                           | `false`   | Disable space key audio feature    |
| `showSuccessAnimation` | `boolean`                           | `false`   | Show success animation             |
| `showConfetti`         | `boolean`                           | `false`   | Show confetti on success           |
| `confettiOptions`      | `ConfettiOptions`                   | `{}`      | Confetti configuration             |
| `refreshInterval`      | `number`                            | -         | Auto-refresh interval in seconds   |
| `maxAttempts`          | `number`                            | -         | Maximum validation attempts        |
| `rtl`                  | `boolean`                           | `false`   | Right-to-left layout               |
| `i18n`                 | `I18nLabels`                        | -         | Internationalization labels        |
| `loadingComponent`     | `React.ReactNode`                   | -         | Custom loading component           |
| `successComponent`     | `React.ReactNode`                   | -         | Custom success component           |
| `errorComponent`       | `React.ReactNode`                   | -         | Custom error component             |
| `theme`                | `CaptchaTheme`                      | -         | Custom theme configuration         |

#### SliderCaptcha Configuration

| Property           | Type       | Default | Description                               |
| ------------------ | ---------- | ------- | ----------------------------------------- |
| `width`            | `number`   | `320`   | Width of the puzzle canvas in pixels      |
| `height`           | `number`   | `180`   | Height of the puzzle canvas in pixels     |
| `pieceSize`        | `number`   | `42`    | Size of the puzzle piece in pixels        |
| `tolerance`        | `number`   | `12`    | Pixel tolerance for successful validation |
| `enableShadow`     | `boolean`  | `true`  | Enable shadow effects on puzzle pieces    |
| `backgroundImage`  | `string`   | -       | Custom background image URL               |
| `backgroundImages` | `string[]` | -       | Array of custom background image URLs     |

#### Component Props

| Property               | Type                                           | Default | Description                           |
| ---------------------- | ---------------------------------------------- | ------- | ------------------------------------- |
| `type`                 | `"slider"`                                     | -       | Must be set to "slider"               |
| `sliderConfig`         | `SliderCaptchaConfig`                          | `{}`    | Configuration object for the slider   |
| `darkMode`             | `boolean`                                      | `false` | Enable dark mode theme                |
| `onValidate`           | `(isValid: boolean, position: number) => void` | -       | Callback when validation occurs       |
| `onPositionChange`     | `(position: number) => void`                   | -       | Callback when slider position changes |
| `disabled`             | `boolean`                                      | `false` | Disable the slider interaction        |
| `maxAttempts`          | `number`                                       | -       | Maximum validation attempts           |
| `onFail`               | `() => void`                                   | -       | Callback when max attempts reached    |
| `showSuccessAnimation` | `boolean`                                      | `false` | Show success animation on validation  |
| `showConfetti`         | `boolean`                                      | `false` | Show confetti effect on success       |
| `confettiOptions`      | `ConfettiOptions`                              | `{}`    | Configuration for confetti animation  |

## TypeScript Support

Full TypeScript definitions are included:

```tsx
import type { CaptchaProps, ValidationRules, I18nLabels } from "recaptz";

const customValidation: ValidationRules = {
  required: true,
  minLength: 4,
  customValidator: (value: string) => {
    return value.length >= 4 || "Minimum 4 characters required";
  },
};

const labels: I18nLabels = {
  securityCheck: "Security Verification",
  inputPlaceholder: "Enter code here",
  verifyButton: "Verify Code",
};
```

## Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Opera (Latest)

## Server-Side Integration

ReCAPTZ includes automatic server-side validation with zero configuration. Features include:

- Server-side validation for enhanced security
- IP detection and rate limiting
- Session-based CAPTCHA management
- Automatic fallback to client-side validation
- No setup required

## Best Practices

### Security Configuration

Choose appropriate settings based on the sensitivity of your forms:

- **Login forms**: `type="numbers"`, `length={4}`
- **Registration**: `type="mixed"`, `length={6}`
- **High-value transactions**: Custom validation with complex rules

### Performance Optimization

- Use `maxAttempts` to prevent abuse
- Configure `refreshInterval` for automatic refresh
- Enable `autoFocus` for better user experience

### Accessibility

- Always enable audio support: `enableAudio={true}`
- Provide clear instructions with `i18n` labels
- Use `autoFocus` for keyboard users

## Contributing

1. Fork the repository
2. Clone your fork: `git clone https://github.com/ShejanMahamud/recaptz.git`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Make changes and test thoroughly
6. Submit a pull request

## License

MIT © [Shejan Mahamud](https://github.com/ShejanMahamud)
