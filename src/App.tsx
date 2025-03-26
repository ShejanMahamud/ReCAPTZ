import {
  Accessibility,
  AlertTriangle,
  Settings as AlphabetLatin,
  ArrowRight,
  Book,
  CheckCircle2,
  Code,
  FileCode2,
  Github,
  Globe,
  Hash,
  Keyboard,
  Moon,
  Package,
  Palette,
  Settings,
  ShieldCheck,
  Shuffle,
  Terminal,
  Timer,
  Volume2,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { Captcha } from "./components/Captcha";

function App() {
  const [numberValid, setNumberValid] = useState(false);
  const [letterValid, setLetterValid] = useState(false);
  const [mixedValid, setMixedValid] = useState(false);
  const [customValid, setCustomValid] = useState(false);
  const [timedValid, setTimedValid] = useState(false);
  const [darkModeValid, setDarkModeValid] = useState(false);
  const [accessibleValid, setAccessibleValid] = useState(false);
  const [complexValid, setComplexValid] = useState(false);

  const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
      <code>{children}</code>
    </pre>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <header className="w-full border-b bg-white/50 backdrop-blur-xs sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">ReCAPTZ</h1>
              <p className="text-sm text-gray-500">
                Modern, Secure, Customizable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ShejanMahamud/recaptz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/recaptz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>npm</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">ReCAPTZ</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 max-w-2xl mx-auto leading-tight">
            The Modern CAPTCHA Solution for React Applications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A beautiful, customizable, and secure CAPTCHA component with
            multiple verification types, perfect for protecting your forms and
            user interactions.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="#demos"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Demos
            </a>
            <a
              href="https://github.com/ShejanMahamud/recaptz#readme"
              className="px-6 py-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all font-medium"
            >
              Documentation
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure by Design</h3>
            <p className="text-gray-600">
              Built with security best practices and customizable validation
              rules
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Accessibility className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Accessibility First</h3>
            <p className="text-gray-600">
              Screen reader support, keyboard navigation, and audio feedback
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Terminal className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Developer Friendly</h3>
            <p className="text-gray-600">
              TypeScript support, comprehensive documentation, and easy
              integration
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Zero Dependencies</h3>
            <p className="text-gray-600">
              Minimal bundle size with no external dependencies
            </p>
          </div>
        </div>

        <div id="demos" className="space-y-16 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Interactive Demos
          </h2>
          <div className="w-full flex items-center justify-center">
            <a
              href="https://www.npmjs.com/package/recaptz?activeTab=readme"
              className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md transition-colors bg-blue-100 text-blue-600 font-medium"
            >
              Example Code Here <ArrowRight size={20} />
            </a>
          </div>
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Basic Types</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Hash className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Numbers Only
                      </h2>
                      <p className="text-sm text-gray-500">
                        Perfect for numeric verification
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    {/* <button
    onClick={() => navigator.clipboard.writeText(`
  <Captcha
    type="numbers"
    length={4}
    onValidate={setNumberValid}
    validationRules={{
      required: true,
      allowedCharacters: "0123456789",
    }}
  />
    `)}
    className='p-1.5 rounded-md transition-colors
         hover:bg-gray-100 active:bg-gray-200'
    aria-label="Listen to CAPTCHA"
  >
    <Clipboard size={20}/>
  </button> */}
                  </div>
                </div>
                <Captcha
                  type="numbers"
                  length={4}
                  onValidate={setNumberValid}
                  validationRules={{
                    required: true,
                    allowedCharacters: "0123456789",
                  }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  Status:{" "}
                  {numberValid ? (
                    <span className="text-green-600 font-medium">
                      Verified ✓
                    </span>
                  ) : (
                    "Awaiting verification"
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <AlphabetLatin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Letters Only
                    </h2>
                    <p className="text-sm text-gray-500">
                      Alphabetic verification challenge
                    </p>
                  </div>
                </div>
                <Captcha
                  type="letters"
                  length={6}
                  onValidate={setLetterValid}
                  validationRules={{
                    required: true,
                    customValidator: (value) =>
                      /^[a-zA-Z]+$/.test(value) || "Only letters are allowed",
                  }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  Status:{" "}
                  {letterValid ? (
                    <span className="text-green-600 font-medium">
                      Verified ✓
                    </span>
                  ) : (
                    "Awaiting verification"
                  )}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-orange-100/50 border border-orange-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Custom Characters
                    </h2>
                    <p className="text-sm text-gray-500">
                      Fully customizable character set
                    </p>
                  </div>
                </div>
                <Captcha
                  customCharacters="ABCDEF123456"
                  length={5}
                  onValidate={setCustomValid}
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
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">
                    Status:{" "}
                    {customValid ? (
                      <span className="text-green-600 font-medium">
                        Verified ✓
                      </span>
                    ) : (
                      "Awaiting verification"
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <code className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      ABCDEF123456
                    </code>
                    <span className="text-xs">(case sensitive)</span>
                  </p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl shadow-green-100/50 border border-green-100 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Shuffle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Mixed Characters
                    </h2>
                    <p className="text-sm text-gray-500">
                      Combined letters and numbers
                    </p>
                  </div>
                </div>
                <Captcha
                  type="mixed"
                  length={8}
                  onValidate={setMixedValid}
                  validationRules={{
                    required: true,
                    minLength: 8,
                    maxLength: 8,
                  }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  Status:{" "}
                  {mixedValid ? (
                    <span className="text-green-600 font-medium">
                      Verified ✓
                    </span>
                  ) : (
                    "Awaiting verification"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Advanced Features</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl shadow-xl shadow-orange-100/50 border border-orange-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Timer className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Timed CAPTCHA
                    </h2>
                    <p className="text-sm text-gray-500">
                      Complete within time limit
                    </p>
                  </div>
                </div>
                <Captcha
                  type="mixed"
                  length={5}
                  onValidate={setTimedValid}
                  refreshInterval={30}
                  validationRules={{
                    required: true,
                    minLength: 5,
                  }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  Status:{" "}
                  {timedValid ? (
                    <span className="text-green-600 font-medium">
                      Verified ✓
                    </span>
                  ) : (
                    "Complete within 30 seconds"
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl shadow-xl shadow-indigo-100/50 border border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <Volume2 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Accessible CAPTCHA
                    </h2>
                    <p className="text-sm text-gray-500">
                      With audio support and keyboard navigation
                    </p>
                  </div>
                </div>
                <Captcha
                  type="letters"
                  length={4}
                  onValidate={setAccessibleValid}
                  autoFocus
                  showSuccessAnimation
                  validationRules={{
                    required: true,
                  }}
                />
                <div className="mt-4 text-sm text-gray-500">
                  <p>Press Space to hear the code</p>
                  <p>
                    Status:{" "}
                    {accessibleValid ? (
                      <span className="text-green-600 font-medium">
                        Verified ✓
                      </span>
                    ) : (
                      "Awaiting verification"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">
              Customization Examples
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-900/50 border border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-800 rounded-xl">
                    <Moon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Dark Mode
                    </h2>
                    <p className="text-sm text-gray-400">
                      Elegant dark theme design
                    </p>
                  </div>
                </div>
                <Captcha
                  type="mixed"
                  length={6}
                  darkMode
                  onValidate={setDarkModeValid}
                  validationRules={{
                    required: true,
                  }}
                />
                <div className="mt-4 text-sm text-gray-400">
                  Status:{" "}
                  {darkModeValid ? (
                    <span className="text-green-400 font-medium">
                      Verified ✓
                    </span>
                  ) : (
                    "Awaiting verification"
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl shadow-xl shadow-green-100/50 border border-green-100 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Settings className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Complex Validation
                    </h2>
                    <p className="text-sm text-gray-500">
                      Custom validation rules
                    </p>
                  </div>
                </div>
                <Captcha
                  customCharacters="ABCDEF123456"
                  length={6}
                  caseSensitive={true}
                  onValidate={setComplexValid}
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
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">
                    Status:{" "}
                    {complexValid ? (
                      <span className="text-green-600 font-medium">
                        Verified ✓
                      </span>
                    ) : (
                      "Awaiting verification"
                    )}
                  </div>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Must contain A-F and 1-6</li>
                    <li>• Case sensitive</li>
                    <li>• Length: 6 characters</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="documentation"
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <div className="space-y-12">
            <section id="getting-started" className="space-y-6">
              <div className="flex items-center gap-3">
                <Book className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold">Getting Started</h3>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Installation</h4>
                <CodeBlock>npm install recaptz</CodeBlock>

                <h4 className="text-lg font-semibold mt-6">Basic Usage</h4>
                <CodeBlock>{`import { Captcha } from 'recaptz';

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
}`}</CodeBlock>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Code className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl font-bold">Props</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-4 font-semibold">Prop</th>
                      <th className="py-4 px-4 font-semibold">Type</th>
                      <th className="py-4 px-4 font-semibold">Default</th>
                      <th className="py-4 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>type</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>'numbers' | 'letters' | 'mixed'</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>'mixed'</code>
                      </td>
                      <td className="py-4 px-4">Type of CAPTCHA to generate</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>length</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>number</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>6</code>
                      </td>
                      <td className="py-4 px-4">Length of CAPTCHA text</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>onChange</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>{"(value: string) => void"}</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Callback when input changes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>onValidate</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>{"(isValid: boolean) => void"}</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">
                        Callback when validation occurs
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>className</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>string</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>''</code>
                      </td>
                      <td className="py-4 px-4">Additional CSS classes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>refreshable</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>boolean</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>true</code>
                      </td>
                      <td className="py-4 px-4">
                        Whether CAPTCHA can be refreshed
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>caseSensitive</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>boolean</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>false</code>
                      </td>
                      <td className="py-4 px-4">Case-sensitive validation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>customCharacters</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>string</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Custom character set</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>customStyles</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>React.CSSProperties</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Custom inline styles</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>validationRules</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>ValidationRules</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Custom validation rules</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>darkMode</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>boolean</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>false</code>
                      </td>
                      <td className="py-4 px-4">Enable dark mode theme</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>autoFocus</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>boolean</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>false</code>
                      </td>
                      <td className="py-4 px-4">Auto-focus the input field</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>showSuccessAnimation</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>boolean</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>false</code>
                      </td>
                      <td className="py-4 px-4">Show success animation</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>refreshInterval</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>number</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">
                        Auto-refresh interval in seconds
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>maxAttempts</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>number</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Maximum validation attempts</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4">
                        <code>inputButtonStyle</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>string</code>
                      </td>
                      <td className="py-4 px-4">
                        <code>-</code>
                      </td>
                      <td className="py-4 px-4">Input button styles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-2xl font-bold">Validation Rules</h3>
              </div>
              <div className="space-y-4">
                <p>
                  The <code>validationRules</code> prop accepts an object with
                  the following properties:
                </p>
                <CodeBlock>{`interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  allowedCharacters?: string;
  required?: boolean;
  caseSensitive?: boolean;
  customValidator?: (value: string) => boolean | string;
}`}</CodeBlock>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-orange-600" />
                <h3 className="text-2xl font-bold">Styling</h3>
              </div>
              <div className="space-y-4">
                <p>
                  Customize the appearance using the <code>className</code> and{" "}
                  <code>customStyles</code> props:
                </p>
                <CodeBlock>{`<Captcha
  className="my-custom-class"
  customStyles={{
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px'
  }}
  darkMode={true}
/>`}</CodeBlock>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Keyboard className="w-6 h-6 text-indigo-600" />
                <h3 className="text-2xl font-bold">Keyboard Shortcuts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <kbd className="px-2 py-1 bg-white rounded-sm border shadow-xs">
                    Space
                  </kbd>
                  <p className="mt-2 text-sm text-gray-600">
                    Hear the CAPTCHA code
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <kbd className="px-2 py-1 bg-white rounded-sm border shadow-xs">
                    Enter
                  </kbd>
                  <p className="mt-2 text-sm text-gray-600">
                    Validate the input
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <kbd className="px-2 py-1 bg-white rounded-sm border shadow-xs">
                    Escape
                  </kbd>
                  <p className="mt-2 text-sm text-gray-600">Clear the input</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FileCode2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold">TypeScript Support</h3>
              </div>
              <div className="space-y-4">
                <p>Import types directly from the package:</p>
                <CodeBlock>{`import type { CaptchaProps, ValidationRules } from 'recaptz';`}</CodeBlock>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-bold">Error Handling</h3>
              </div>
              <div className="space-y-4">
                <p>
                  The component handles various error cases and provides
                  feedback:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Invalid input length</li>
                  <li>Character mismatch</li>
                  <li>Required field validation</li>
                  <li>Custom validation rules</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-bold">Browser Support</h3>
            <p className="text-gray-600">
              Works seamlessly across all modern browsers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {["Chrome", "Firefox", "Safari", "Edge", "Opera"].map((browser) => (
              <div key={browser} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                  <Globe className="w-8 h-8 text-gray-600" />
                </div>
                <p className="font-medium">{browser}</p>
                <p className="text-sm text-gray-500">Latest</p>
              </div>
            ))}
          </div>
        </div>

        <footer className="text-center text-sm text-gray-500 space-y-2">
          <p>Press Enter to validate or click the validate button</p>
          <p>All CAPTCHA types support customization and validation rules</p>
          <p className="mt-4">MIT © Shejan Mahamud</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
