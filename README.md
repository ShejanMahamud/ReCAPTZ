<div align="center">

# ReCAPTZ

### Modern, Lightweight CAPTCHA for React

[![npm version](https://img.shields.io/npm/v/recaptz.svg?style=flat-square)](https://www.npmjs.com/package/recaptz)
[![npm downloads](https://img.shields.io/npm/dm/recaptz.svg?style=flat-square)](https://www.npmjs.com/package/recaptz)
[![bundle size](https://img.shields.io/bundlephobia/minzip/recaptz?style=flat-square)](https://bundlephobia.com/package/recaptz)
[![license](https://img.shields.io/npm/l/recaptz.svg?style=flat-square)](https://github.com/ShejanMahamud/recaptz/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ShejanMahamud/recaptz/blob/main/CONTRIBUTING.md)

A powerful, zero-dependency CAPTCHA library with 6 interactive types, full accessibility support, and beautiful animations - all running entirely client-side.

[🚀 Getting Started](#-installation) • [📖 Documentation](#-documentation) • [🎮 Demo](https://recaptz.vercel.app) • [💬 Community](https://github.com/ShejanMahamud/recaptz/discussions)

</div>

---

## ✨ Features

<table>
<tr>
<td>

**🎯 Six CAPTCHA Types**

- Text (Numbers, Letters, Mixed)
- Slider Puzzle
- Math Challenge
- Pattern Recognition
- Custom Characters

</td>
<td>

**♿ Accessibility First**

- WCAG 2.1 AA Compliant
- Screen Reader Support
- Keyboard Navigation
- Audio Feedback (TTS)

</td>
</tr>
<tr>
<td>

**⚡ Performance**

- Zero Dependencies
- < 50KB Minified
- Client-Side Only
- SSR Compatible

</td>
<td>

**🎨 Customization**

- Dark Mode Support
- Custom Themes
- 18n & RTL Support
- Custom Validators

</td>
</tr>
</table>

### Why ReCAPTZ?

✅ **No External APIs** - Works completely offline, no Google/third-party services  
✅ **Zero Configuration** - Drop-in component, works out of the box  
✅ **Developer Friendly** - TypeScript, React Hooks, comprehensive docs  
✅ **Production Ready** - Battle-tested, used in production apps

## 📦 Installation

```bash
# npm
npm install recaptz

# yarn
yarn add recaptz

# pnpm
pnpm add recaptz

# bun
bun add recaptz
```

## 🚀 Quick Start

```tsx
import { Captcha } from "recaptz";
import { useState } from "react";

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div>
      <Captcha
        type="mixed"
        length={6}
        onValidate={setIsVerified}
        showSuccessAnimation
      />
      <button disabled={!isVerified}>Submit</button>
    </div>
  );
}
```

**That's it!** 🎉 No API keys, no server setup, no configuration needed.

## 🎮 CAPTCHA Types

ReCAPTZ offers **6 distinct CAPTCHA types** to suit different security needs and user experiences.

### 📝 Text-Based CAPTCHAs

Perfect for traditional form protection with customizable character sets.

<details>
<summary><b>Numbers Only</b></summary>

```tsx
<Captcha
  type="numbers"
  length={4}
  onValidate={(isValid) => console.log("Verified:", isValid)}
/>
```

**Use Case:** Login forms, simple verifications  
**Difficulty:** Easy  
**Accessibility:** Audio support included

</details>

<details>
<summary><b>Letters Only</b></summary>

```tsx
<Captcha type="letters" length={6} caseSensitive={false} />
```

**Use Case:** Registration forms  
**Difficulty:** Medium  
**Accessibility:** Audio support included

</details>

<details>
<summary><b>Mixed (Letters + Numbers)</b></summary>

```tsx
<Captcha type="mixed" length={6} caseSensitive={true} showSuccessAnimation />
```

**Use Case:** High-security forms, payment pages  
**Difficulty:** Hard  
**Accessibility:** Audio support included

</details>

<details>
<summary><b>Custom Characters</b></summary>

```tsx
<Captcha
  customCharacters="ABCDEF123456"
  length={5}
  caseSensitive={true}
  validationRules={{
    customValidator: (value) => /^[A-F0-9]+$/.test(value),
  }}
/>
```

**Use Case:** Specialized forms, API key verification  
**Difficulty:** Customizable  
**Accessibility:** Audio support included

</details>

---

### 🧩 Slider Puzzle CAPTCHA

Interactive drag-and-drop puzzle solving - engaging and bot-resistant.

```tsx
<Captcha
  type="slider"
  sliderConfig={{
    width: 320,
    height: 180,
    pieceSize: 42,
    tolerance: 12,
    enableShadow: true,
  }}
  showSuccessAnimation
  showConfetti
  onValidate={(isValid) => console.log("Puzzle solved:", isValid)}
/>
```

**Features:**

- 🎨 Auto-generated beautiful background images (via Pexels API)
- 🎯 Precise validation with configurable tolerance
- 📱 Touch-friendly for mobile devices
- 🌓 Dark mode support

<details>
<summary><b>Custom Background Images</b></summary>

Override automatic images with your own:

```tsx
<Captcha
  type="slider"
  sliderConfig={{
    // Single custom image
    backgroundImage: "https://your-domain.com/puzzle.jpg",

    // Or multiple images for variety
    backgroundImages: [
      "https://your-domain.com/puzzle1.jpg",
      "https://your-domain.com/puzzle2.jpg",
      "https://your-domain.com/puzzle3.jpg",
    ],
  }}
/>
```

</details>

**Use Case:** Modern web apps, mobile-first sites  
**Difficulty:** Medium  
**Bot Resistance:** High

---

### 🧮 Math Challenge CAPTCHA

Solve simple arithmetic problems - human-friendly, bot-resistant.

```tsx
<Captcha
  type="math"
  mathConfig={{
    difficulty: "medium",
    operations: ["addition", "subtraction", "multiplication"],
    range: { min: 1, max: 20 },
  }}
  onValidate={(isValid) => console.log("Math solved:", isValid)}
/>
```

**Difficulty Levels:**

| Level      | Operations | Range | Example      |
| ---------- | ---------- | ----- | ------------ |
| **Easy**   | +, −       | 1-10  | `3 + 5 = ?`  |
| **Medium** | +, −, ×    | 1-20  | `7 × 3 = ?`  |
| **Hard**   | +, −, ×, ÷ | 1-50  | `48 ÷ 6 = ?` |

**Advanced Configuration:**

```tsx
<Captcha
  type="math"
  mathConfig={{
    difficulty: "hard",
    operations: ["addition", "subtraction", "multiplication", "division"],
    range: { min: 1, max: 50 },
    allowDecimals: false,
    showHint: true,
  }}
  enableAudio
  darkMode
/>
```

**Use Case:** Educational sites, family-friendly apps, quick verifications  
**Difficulty:** Easy to Hard (configurable)  
**Accessibility:** Excellent - natural language friendly

---

### 🎨 Pattern Recognition CAPTCHA

Identify patterns in shapes, colors, rotations, and sizes - visual and engaging.

```tsx
<Captcha
  type="pattern"
  patternConfig={{
    difficulty: "medium",
    gridSize: 6,
    patternTypes: ["shape", "color", "rotation", "size"],
  }}
  onValidate={(isValid) => console.log("Pattern found:", isValid)}
/>
```

**Pattern Types:**

<table>
<tr>
<td>

**Shape**  
Find the different shape  
`(circles, squares, triangles, stars, diamonds, hexagons, hearts)`

</td>
<td>

**Color**  
Find the different color  
`(9 vibrant colors)`

</td>
</tr>
<tr>
<td>

**Rotation**  
Find the differently rotated shape  
`(0°, 45°, 90°, 135°, 180°)`

</td>
<td>

**Size**  
Find the larger/smaller shape  
`(relative sizing)`

</td>
</tr>
<tr>
<td colspan="2">

**Mixed**  
Combination of multiple pattern types  
`(ultimate challenge)`

</td>
</tr>
</table>

**Grid Sizes:**

- `4 items` - Easy (2×2 grid)
- `6 items` - Medium (2×3 grid)
- `9 items` - Hard (3×3 grid)

**Advanced Configuration:**

```tsx
<Captcha
  type="pattern"
  patternConfig={{
    difficulty: "hard",
    gridSize: 9,
    patternTypes: ["shape", "color", "rotation", "size", "mixed"],
    shapes: ["circle", "square", "triangle", "star", "diamond"],
    colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
  }}
  darkMode
  showSuccessAnimation
  i18n={{
    instruction: "Find the pattern!",
    selectDifferent: "Select the different one",
    showHint: "Need help?",
  }}
/>
```

**Use Case:** Gaming sites, creative apps, visual learners  
**Difficulty:** Easy to Hard (configurable)  
**Accessibility:** Visual-first (audio description support planned)  
**Bot Resistance:** Very High

---

### ⚙️ Advanced Configuration

Combine features for enhanced security and UX:

```tsx
<Captcha
  type="mixed"
  length={6}
  // Security
  maxAttempts={3}
  refreshInterval={60}
  caseSensitive
  // UX Enhancement
  autoFocus
  enableAudio
  showSuccessAnimation
  showConfetti
  // Callbacks
  onValidate={(isValid) => console.log("Valid:", isValid)}
  onFail={() => alert("Too many attempts!")}
  onSuccess={() => console.log("Success!")}
  // Theming
  darkMode
  className="my-custom-captcha"
/>
```

## 🎣 Custom Hook Usage

Build fully custom CAPTCHA UIs using the `useCaptchaState` hook.

### Basic Hook Example

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

      {isValid && <div className="success">✓ Verified!</div>}
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

### Hook API Reference

```tsx
interface CaptchaState {
  captchaText: string; // Current CAPTCHA text
  userInput: string; // User's input value
  setUserInput: (input: string) => void; // Update user input
  validate: () => Promise<boolean>; // Validate the input
  refresh: () => Promise<void>; // Generate new CAPTCHA
  isValid: boolean; // Current validation state
  error: string | null; // Current error message
  attempts: number; // Failed attempt count
  isLoading: boolean; // Loading state
}
```

### Advanced Hook Example

```tsx
function AdvancedCustomCaptcha() {
  const { captchaText, validate, refresh, isValid, attempts } =
    useCaptchaState();

  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await validate();

    if (result) {
      console.log("Success!");
    } else if (attempts >= 3) {
      console.log("Too many attempts");
      await refresh();
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your custom UI */}</form>;
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

---

## ♿ Accessibility

ReCAPTZ is built with accessibility as a **core feature**, not an afterthought.

### WCAG 2.1 AA Compliance

✅ **Perceivable** - Multiple ways to understand content (visual, audio, text)  
✅ **Operable** - Full keyboard navigation, no time limits  
✅ **Understandable** - Clear instructions, error messages, feedback  
✅ **Robust** - Semantic HTML, ARIA labels, screen reader tested

### Features

| Feature                    | Description                                | Support               |
| -------------------------- | ------------------------------------------ | --------------------- |
| 🔊 **Audio Feedback**      | Text-to-speech for visually impaired users | All text CAPTCHAs     |
| ⌨️ **Keyboard Navigation** | Complete keyboard control                  | All types             |
| 📱 **Screen Readers**      | ARIA labels, semantic HTML                 | NVDA, JAWS, VoiceOver |
| 🎨 **High Contrast**       | Works with contrast themes                 | All themes            |
| 📐 **Zoom Support**        | Maintains usability at 200% zoom           | Responsive            |
| 👆 **Touch Optimized**     | Large touch targets (44x44px min)          | Mobile-first          |

### Keyboard Shortcuts

| Key               | Action             | Availability |
| ----------------- | ------------------ | ------------ |
| <kbd>Space</kbd>  | Play audio CAPTCHA | Text types   |
| <kbd>Enter</kbd>  | Validate input     | All types    |
| <kbd>Escape</kbd> | Clear input        | All types    |
| <kbd>Tab</kbd>    | Navigate elements  | All types    |

### Implementation

```tsx
<Captcha
  // Enable all accessibility features
  enableAudio
  autoFocus
  // Provide clear labels
  i18n={{
    securityCheck: "Security Verification",
    inputPlaceholder: "Enter the code you see or hear",
    pressSpaceToHearCode: "Press Space to hear the code",
    enterToValidate: "Press Enter to validate",
    escToClear: "Press Escape to clear",
    listenToCaptcha: "Listen to CAPTCHA (audio)",
    refreshCaptcha: "Generate new CAPTCHA",
  }}
  // High contrast theme
  darkMode
  customStyles={{
    border: "2px solid currentColor",
    fontSize: "1.125rem",
  }}
/>
```

### Screen Reader Example

```tsx
<Captcha
  type="numbers"
  length={4}
  enableAudio
  i18n={{
    securityCheck: "Please verify you are human",
    inputPlaceholder: "Enter 4-digit code",
    listenToCaptcha: "Click to hear the code",
  }}
  aria-label="Security verification CAPTCHA"
  aria-describedby="captcha-instructions"
/>

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
```

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

---

## 🌍 Browser Support

| Browser       | Version         | Status             |
| ------------- | --------------- | ------------------ |
| Chrome        | Last 2 versions | ✅ Fully Supported |
| Firefox       | Last 2 versions | ✅ Fully Supported |
| Safari        | Last 2 versions | ✅ Fully Supported |
| Edge          | Last 2 versions | ✅ Fully Supported |
| Opera         | Last 2 versions | ✅ Fully Supported |
| Mobile Safari | iOS 12+         | ✅ Fully Supported |
| Chrome Mobile | Android 8+      | ✅ Fully Supported |

**Note:** ReCAPTZ uses modern web APIs. For older browser support, consider using polyfills.

---

## 📚 Documentation

### Complete API Reference

Visit our [full documentation](https://recaptz.vercel.app/docs) for detailed guides on:

- 📖 [Getting Started Guide](https://recaptz.vercel.app/)
- 🎨 [Theming & Customization](https://recaptz.vercel.app)
- 🌐 [Internationalization (i18n)](https://recaptz.vercel.app)

---

## 🛡️ Security Best Practices

### Recommended Configuration by Use Case

| Use Case           | Type               | Length | Config               |
| ------------------ | ------------------ | ------ | -------------------- |
| **Login Forms**    | `numbers`          | 4      | Quick, user-friendly |
| **Registration**   | `mixed`            | 6      | Balanced security    |
| **Password Reset** | `letters`          | 5      | Medium security      |
| **Payment Forms**  | `slider` or `math` | -      | High bot resistance  |
| **Comments**       | `numbers`          | 4      | Low friction         |
| **Admin Panel**    | `mixed`            | 8      | Maximum security     |
| **Public API**     | `pattern`          | -      | Bot prevention       |

### Security Recommendations

```tsx
// ✅ GOOD - Login form
<Captcha
  type="numbers"
  length={4}
  maxAttempts={5}
  refreshInterval={60}
/>

// ✅ BETTER - High-security form
<Captcha
  type="mixed"
  length={8}
  caseSensitive
  maxAttempts={3}
  validationRules={{
    customValidator: (value) => {
      // Add custom security checks
      return /^(?=.*[A-Z])(?=.*[0-9])/.test(value)
        || "Must contain uppercase and number";
    }
  }}
/>

// ✅ BEST - Critical operations
<Captcha
  type="slider"
  maxAttempts={3}
  onFail={() => {
    // Lock account, send alert, etc.
    lockAccountTemporarily();
  }}
/>
```

### Performance Tips

1. **Use appropriate CAPTCHA type** - Don't use `mixed` with `length={12}` for simple forms
2. **Implement rate limiting** - Use `maxAttempts` to prevent brute force
3. **Auto-refresh** - Use `refreshInterval` to prevent stale CAPTCHAs
4. **Lazy load** - Load CAPTCHA component only when needed
5. **Monitor metrics** - Track success rates and adjust difficulty

---

## 🤝 Contributing

We love contributions! ReCAPTZ is built by developers, for developers.

### Ways to Contribute

- 🐛 [Report bugs](https://github.com/ShejanMahamud/recaptz/issues/new?template=bug_report.md)
- 💡 [Request features](https://github.com/ShejanMahamud/recaptz/issues/new?template=feature_request.md)

### Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/ShejanMahamud/recaptz.git
cd recaptz

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev

# 4. Run tests
pnpm test

# 5. Build library
pnpm build
```

### Contribution Guidelines

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).

### Development Commands

| Command          | Description               |
| ---------------- | ------------------------- |
| `pnpm dev`       | Start development server  |
| `pnpm build`     | Build for production      |
| `pnpm test`      | Run test suite            |
| `pnpm lint`      | Lint code                 |
| `pnpm format`    | Format code with Prettier |
| `pnpm typecheck` | Check TypeScript types    |

---

## 💖 Support the Project

If ReCAPTZ helps your project, consider:

- ⭐ [Star on GitHub](https://github.com/ShejanMahamud/recaptz)
- 🐦 [Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20ReCAPTZ%20-%20Modern%20CAPTCHA%20for%20React!&url=https://github.com/ShejanMahamud/recaptz)
- 📝 [Write a blog post](https://github.com/ShejanMahamud/recaptz/discussions)
- ☕ [Buy me a coffee](https://buy.polar.sh/polar_cl_wqXRfQ7X6aRtStneJOyjO2Hp48FfrXqxStf6f3NFxVm)

---

## 📄 License

MIT © [Shejan Mahamud](https://github.com/ShejanMahamud)

**Free to use** in personal and commercial projects.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Icons by [Lucide](https://lucide.dev/)
- Images from [Pexels](https://www.pexels.com/) (Slider CAPTCHA)

---

## 📞 Community & Support

- 💬 [GitHub Discussions](https://github.com/ShejanMahamud/recaptz/discussions) - Ask questions, share ideas
- 🐛 [Issue Tracker](https://github.com/ShejanMahamud/recaptz/issues) - Report bugs, request features
- 📧 [Email](mailto:dev.shejanmahamud@gmail.com) - Direct support
- 🐦 [Twitter](https://twitter.com/shejanmahamud) - Follow for updates

---

<div align="center">

**Made with ❤️ by [Shejan Mahamud](https://github.com/ShejanMahamud)**

[⬆ Back to Top](#-recaptz)

</div>
