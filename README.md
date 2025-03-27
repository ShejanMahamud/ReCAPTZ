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

## Quick Start

```tsx
import { Captcha } from 'recaptz';

function App() {
  const handleValidate = (isValid: boolean) => {
    if (isValid) {
      console.log('CAPTCHA validated successfully');
    }
  };

  return (
    <Captcha
      type="mixed"
      length={6}
      onValidate={handleValidate}
    />
  );
}
```

## Examples

### Basic Types

#### Numbers Only
```tsx
<Captcha
  type="numbers"
  length={4}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    allowedCharacters: '0123456789',
    minLength: 4,
    maxLength: 4
  }}
/>
```

#### Letters Only
```tsx
<Captcha
  type="letters"
  length={6}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    customValidator: (value) => /^[a-zA-Z]+$/.test(value) || 'Only letters are allowed'
  }}
/>
```

#### Mixed Characters
```tsx
<Captcha
  type="mixed"
  length={8}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    minLength: 8,
    maxLength: 8
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
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    minLength: 5
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
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true
  }}
/>
```

#### Dark Mode
```tsx
<Captcha
  type="mixed"
  length={6}
  darkMode
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true
  }}
/>
```

#### Audio Mode
```tsx
<Captcha
  type="mixed"
  length={6}
  enableAudio
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true
  }}
/>
```

#### Max Attempts
```tsx
<Captcha
  type="mixed"
  length={6}
  maxAttempts={3} 
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true
  }}
/>
```

#### Complex Validation
```tsx
<Captcha
  customCharacters="ABCDEF123456"
  length={6}
  caseSensitive={true}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    allowedCharacters: "ABCDEF123456",
    customValidator: (value) => {
      const hasLetter = /[A-F]/.test(value);
      const hasNumber = /[1-6]/.test(value);
      const hasMinLength = value.length >= 6;
      if (!hasLetter) return 'Must contain at least one letter';
      if (!hasNumber) return 'Must contain at least one number';
      if (!hasMinLength) return 'Must be 6 characters long';
      return true;
    }
  }}
/>
```

### Styling

#### Custom Classes and Styles
```tsx
<Captcha
  className="my-custom-class"
  customStyles={{
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px'
  }}
  darkMode={true}
/>
```

### Form Integration

#### React Hook Form
```tsx
import { useForm } from 'react-hook-form';
import { Captcha } from 'recaptz';

function LoginForm() {
  const { handleSubmit, setError, clearErrors } = useForm();
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const onSubmit = (data) => {
    if (!isCaptchaValid) {
      setError('captcha', {
        type: 'manual',
        message: 'Please complete the CAPTCHA'
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
          if (isValid) clearErrors('captcha');
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Formik
```tsx
import { Formik, Form } from 'formik';
import { Captcha } from 'recaptz';

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
              setFieldValue('captchaValid', isValid);
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

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'numbers' \| 'letters' \| 'mixed'` | `'mixed'` | Type of CAPTCHA to generate |
| `length` | `number` | `6` | Length of CAPTCHA text |
| `onChange` | `(value: string) => void` | - | Callback when input changes |
| `onValidate` | `(isValid: boolean) => void` | - | Callback when validation occurs |
| `className` | `string` | `''` | Additional CSS classes |
| `refreshable` | `boolean` | `true` | Whether CAPTCHA can be refreshed |
| `caseSensitive` | `boolean` | `false` | Case-sensitive validation |
| `customCharacters` | `string` | - | Custom character set |
| `customStyles` | `React.CSSProperties` | - | Custom inline styles |
| `validationRules` | `ValidationRules` | - | Custom validation rules |
| `darkMode` | `boolean` | `false` | Enable dark mode |
| `autoFocus` | `boolean` | `false` | Auto-focus the input field |
| `showSuccessAnimation` | `boolean` | `false` | Show success animation |
| `refreshInterval` | `number` | - | Auto-refresh interval in seconds |
| `maxAttempts` | `number` | - | Maximum validation attempts |
| `inputButtonStyle` | `string` | - | Custom class for input button styles |
| `enableAudio` | `boolean` | - | Enable or disable audio support |

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