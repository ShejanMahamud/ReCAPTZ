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

## CAPTCHA Types

### Numbers Only
```tsx
<Captcha
  type="numbers"
  length={4}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    allowedCharacters: '0123456789'
  }}
/>
```

### Letters Only
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

### Mixed Characters
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

### Custom Characters
```tsx
<Captcha
  customCharacters="ABCDEF123456"
  length={5}
  caseSensitive={true}
  onValidate={(isValid) => console.log('Valid:', isValid)}
  validationRules={{
    required: true,
    allowedCharacters: "ABCDEF123456",
    customValidator: (value) => {
      const hasLetter = /[A-F]/.test(value);
      const hasNumber = /[1-6]/.test(value);
      return (hasLetter && hasNumber) || 'Must contain at least one letter and one number';
    }
  }}
/>
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

## Form Integration

### React Hook Form
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
      <Captcha
        type="mixed"
        length={6}
        onValidate={(isValid) => {
          setIsCaptchaValid(isValid);
          if (isValid) clearErrors('captcha');
        }}
      />
    </form>
  );
}
```

### Formik
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
          <Captcha
            type="mixed"
            length={6}
            onValidate={(isValid) => {
              setFieldValue('captchaValid', isValid);
            }}
          />
        </Form>
      )}
    </Formik>
  );
}
```

## Styling

The component uses Tailwind CSS classes by default but can be customized:

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