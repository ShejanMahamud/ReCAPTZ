# 🛡️ ReCAPTZ

**The Modern CAPTCHA Solution for React Applications**

A beautiful, customizable, and secure CAPTCHA component with multiple verification types, perfect for protecting your forms and user interactions.

[![npm version](https://badge.fury.io/js/recaptz.svg)](https://badge.fury.io/js/recaptz)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Why Choose ReCAPTZ?

🛡️ **Secure by Design** - Built with security best practices and customizable validation rules  
♿ **Accessibility First** - Screen reader support, keyboard navigation, and audio feedback  
⚡ **Developer Friendly** - TypeScript support, comprehensive documentation, and easy integration  
🎨 **Beautiful Design** - Modern UI that works perfectly on mobile and desktop  
🌍 **Internationalization** - Built-in support for multiple languages and RTL layouts

## 📦 Installation

```bash
npm install recaptz
```

## 🚀 New! Automatic Server-Side Security

**🎉 ReCAPTZ now includes built-in server-side validation with zero configuration required!**

### ✨ What's New:

- **🔒 Server-Side Validation** - Enhanced security with backend validation
- **🌐 IP Detection & Rate Limiting** - Automatic protection against abuse
- **💾 Session-Based CAPTCHAs** - Secure session management
- **🔄 Automatic Fallback** - Seamlessly falls back to client-side if server is unavailable
- **⚡ Zero Configuration** - Works out of the box, no setup required

### 🛡️ How It Works:

ReCAPTZ automatically connects to our secure server infrastructure to provide enhanced protection. If the server is temporarily unavailable, it automatically falls back to client-side validation ensuring your application never breaks.

**No configuration needed - just install and use!**

## 🚀 Quick Start

```tsx
import { Captcha } from "recaptz";

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

## 🎯 CAPTCHA Types & Basic Usage

### Standard CAPTCHA Types

```tsx
// Numbers only (great for quick verification)
<Captcha type="numbers" length={4} />

// Letters only (alphabetic challenge)
<Captcha type="letters" length={6} />

// Mixed characters (letters + numbers)
<Captcha type="mixed" length={8} />

// Custom character set
<Captcha
  customCharacters="ABCDEF123456"
  length={5}
  caseSensitive={true}
/>
```

### Enhanced Features

```tsx
// Timed CAPTCHA with auto-refresh
<Captcha
  type="mixed"
  length={5}
  refreshInterval={30}
  maxAttempts={3}
/>

// Dark mode with success animation
<Captcha
  type="letters"
  darkMode={true}
  showSuccessAnimation={true}
  showConfetti={true}
/>

// Accessible CAPTCHA with audio support
<Captcha
  type="numbers"
  enableAudio={true}
  autoFocus={true}
/>
```

## 🌍 Real-World Integration Examples

### 1. Login Form Protection

```tsx
<Captcha
  type="numbers"
  length={4}
  showSuccessAnimation
  maxAttempts={3}
  validationRules={{
    required: true,
    allowedCharacters: "0123456789",
  }}
/>
```

### 2. Contact Form Spam Prevention

```tsx
<Captcha
  type="letters"
  length={5}
  refreshable
  enableAudio
  validationRules={{
    required: true,
    customValidator: (value) =>
      /^[a-zA-Z]+$/.test(value) || "Only letters are allowed",
  }}
/>
```

### 3. User Registration Security

```tsx
<Captcha
  type="mixed"
  length={6}
  caseSensitive={false}
  showSuccessAnimation
  maxAttempts={5}
  validationRules={{
    required: true,
    minLength: 6,
    maxLength: 6,
  }}
/>
```

### 4. E-commerce Checkout Protection

```tsx
<Captcha
  customCharacters="ABCDEF123456"
  length={5}
  caseSensitive={true}
  validationRules={{
    required: true,
    allowedCharacters: "ABCDEF123456",
    customValidator: (value) => {
      const hasLetter = /[A-F]/.test(value);
      const hasNumber = /[1-6]/.test(value);
      return (
        (hasLetter && hasNumber) ||
        "Must contain at least one letter and one number"
      );
    },
  }}
/>
```

### 5. Password Reset Protection

```tsx
<Captcha
  type="numbers"
  length={6}
  refreshInterval={60}
  maxAttempts={3}
  validationRules={{
    required: true,
    allowedCharacters: "0123456789",
  }}
/>
```

## 🎣 Custom Hook Usage

Build your own CAPTCHA UI using the `useCaptchaState` hook:

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
      {/* Display CAPTCHA */}
      <div className="captcha-display">{captchaText}</div>

      {/* Input field */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter the code"
        className="captcha-input"
      />

      {/* Action buttons */}
      <div className="captcha-actions">
        <button onClick={validate} className="verify-btn">
          Verify
        </button>
        <button onClick={refresh} className="refresh-btn">
          Refresh
        </button>
      </div>

      {/* Status display */}
      {isValid && <div className="success">✅ Verified!</div>}
      {error && <div className="error">❌ {error}</div>}
    </div>
  );
}

// Wrap with provider
function App() {
  return (
    <CaptchaProvider type="mixed" length={6}>
      <CustomCaptcha />
    </CaptchaProvider>
  );
}
```

### Hook Return Values

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

## 🔧 Advanced Validation & Rules

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

## 🎨 Styling & Theming

### Basic Styling Options

```tsx
// Light theme with custom styles
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

.my-custom-captcha button:hover {
  background: #45a049;
  transform: translateY(-1px);
}
```

## 🎉 Success Animations & Confetti

### Confetti Configuration

```tsx
interface ConfettiOptions {
  particleCount?: number;  // Number of particles (default: 100)
  spread?: number;         // Spread angle in degrees (default: 45)
  origin?: { x?: number; y?: number }; // Origin point (default: center)
  colors?: string[];       // Custom colors array
  gravity?: number;        // Gravity effect (default: 1)
  scalar?: number;         // Particle size multiplier (default: 1)
  duration?: number;       // Animation duration in ms (default: 3000)
}

// Elaborate celebration
<Captcha
  showConfetti={true}
  confettiOptions={{
    particleCount: 200,
    spread: 70,
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    duration: 5000,
    gravity: 0.8,
    scalar: 1.2
  }}
/>

// Minimal confetti
<Captcha
  showConfetti={true}
  confettiOptions={{
    particleCount: 50,
    spread: 30,
    colors: ['#gold', '#silver'],
    duration: 2000
  }}
/>
```

## 🔧 Custom Components & Theming

Replace default components with your own implementations:

```tsx
// Custom loading spinner
<Captcha
  loadingComponent={
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span>Generating CAPTCHA...</span>
        </div>
  }
/>

// Custom success message
<Captcha
  successComponent={
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle className="w-5 h-5" />
      <span className="font-semibold">Verification Successful!</span>
        </div>
  }
/>

// Custom error display
<Captcha
  errorComponent={({ error, severity }) => (
    <div className={`p-3 rounded-lg ${
      severity === 'high' ? 'bg-red-100 text-red-800' :
      severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'
    }`}>
      <AlertTriangle className="w-4 h-4 inline mr-2" />
      {error}
    </div>
  )}
/>
```

## 📊 Event Handling & Analytics

Comprehensive event tracking for analytics and debugging:

```tsx
const [events, setEvents] = useState([]);

const handleCaptchaEvents = {
  onChange: (value) => {
    console.log("Input changed:", value);
    setEvents((prev) => [
      ...prev,
      { type: "input", value, timestamp: Date.now() },
    ]);
  },

  onValidate: (isValid) => {
    console.log("Validation result:", isValid);
    setEvents((prev) => [
      ...prev,
      {
        type: "validation",
        success: isValid,
        timestamp: Date.now(),
      },
    ]);
  },

  onRefresh: () => {
    console.log("CAPTCHA refreshed");
    setEvents((prev) => [...prev, { type: "refresh", timestamp: Date.now() }]);
  },

  onAudioPlay: () => {
    console.log("Audio played");
    setEvents((prev) => [...prev, { type: "audio", timestamp: Date.now() }]);
  },

  onError: (error) => {
    console.error("CAPTCHA error:", error);
    setEvents((prev) => [
      ...prev,
      {
        type: "error",
        message: error,
        timestamp: Date.now(),
      },
    ]);
  },

  onFail: () => {
    console.log("Validation failed");
    setEvents((prev) => [...prev, { type: "fail", timestamp: Date.now() }]);
  },

  onSuccess: () => {
    console.log("Validation succeeded");
    setEvents((prev) => [...prev, { type: "success", timestamp: Date.now() }]);
  },
};

<Captcha
  {...handleCaptchaEvents}
  maxAttempts={3}
  showSuccessAnimation={true}
  showConfetti={true}
/>;
```

## 🌍 Internationalization & Accessibility

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

// Spanish
<Captcha
  i18n={{
    securityCheck: "Verificación de seguridad",
    listenToCaptcha: "Escuchar CAPTCHA",
    refreshCaptcha: "Actualizar CAPTCHA",
    inputPlaceholder: "Ingrese el código",
    verifyButton: "Verificar",
    verificationSuccessful: "¡Éxito!",
    captchaRequired: "Por favor ingrese el CAPTCHA",
    captchaDoesNotMatch: "El CAPTCHA no coincide",
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

### Accessibility Features

ReCAPTZ is built with accessibility as a priority:

- **🔊 Audio Support** - Text-to-speech for visually impaired users
- **⌨️ Keyboard Navigation** - Full keyboard support with proper focus management
- **🏷️ ARIA Labels** - Comprehensive screen reader support
- **🎨 High Contrast** - Works with high contrast and dark modes
- **📱 Mobile Friendly** - Touch-optimized for mobile devices

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

// Disable space key for audio while keeping audio button available
<Captcha
  enableAudio={true}
  disableSpaceToHear={true}
  i18n={{
    enterToValidate: "Press Enter to validate",
    escToClear: "Press Escape to clear",
  }}
/>
```

### Keyboard Shortcuts

| Key      | Action                |
| -------- | --------------------- |
| `Space`  | Hear the CAPTCHA code |
| `Enter`  | Validate the input    |
| `Escape` | Clear the input       |

## 📋 Complete API Reference

| Prop                   | Type                                | Default   | Description                        |
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

## 🛠️ Implementation Best Practices

### 1. **Context-Appropriate Configuration**

Adjust difficulty and type based on the sensitivity of the action:

- **Login forms**: Simple numbers (4 digits)
- **Registration**: Mixed characters (6 length)
- **High-value transactions**: Custom validation with complex rules

### 2. **Accessibility Considerations**

Always enable audio support and provide clear instructions:

```tsx
<Captcha enableAudio={true} autoFocus={true} />
```

### 3. **Security & UX Balance**

Use appropriate attempt limits and timeouts:

```tsx
<Captcha maxAttempts={3} refreshInterval={30} />
```

## 📦 TypeScript Support

Full TypeScript support with comprehensive type definitions:

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

## 🌐 Browser Support

Works seamlessly across all modern browsers:

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Opera (Latest)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/ShejanMahamud/recaptz.git`
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Make your changes and test thoroughly
6. Submit a pull request

## 📄 License

MIT © [Shejan Mahamud](https://github.com/ShejanMahamud)
