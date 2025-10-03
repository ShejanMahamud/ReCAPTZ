import {
  Accessibility,
  ArrowRight,
  Github,
  Globe,
  Package,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Captcha } from "./components/Captcha";
import type { RootState } from "./store";

// Interactive Playground Component
function CaptchaPlayground() {
  const [config, setConfig] = useState({
    type: "mixed" as "numbers" | "letters" | "mixed" | "slider" | "math" | "pattern",
    length: 6,
    darkMode: false,
    caseSensitive: false,
    refreshable: true,
    enableAudio: true,
    showSuccessAnimation: true,
    showConfetti: false,
    autoFocus: false,
    maxAttempts: 3,
    refreshInterval: 0,
    customCharacters: "",
    language: "english",
    rtl: false,
    // Advanced features
    className: "",
    customStyles: "",
    inputButtonStyle: "",
    // Validation rules
    validationRequired: true,
    validationMinLength: 0,
    validationMaxLength: 0,
    validationAllowedChars: "",
    validationCustom: "",
    // Confetti options
    confettiParticles: 100,
    confettiColors: "#ff0000,#00ff00,#0000ff",
    confettiDuration: 3000,
    // Event tracking
    showEventLog: false,
    // Slider captcha options
    sliderWidth: 350,
    sliderHeight: 200,
    sliderPieceSize: 42,
    sliderTolerance: 5,
    sliderComplexity: 3,
    sliderEnableShadow: true,
    // Math captcha options
    mathDifficulty: "easy" as "easy" | "medium" | "hard",
    mathOperations: ["add", "subtract"] as ("add" | "subtract" | "multiply" | "divide")[],
    mathDisplayFormat: "horizontal" as "horizontal" | "vertical",
    // Pattern captcha options
    patternDifficulty: "easy" as "easy" | "medium" | "hard",
    patternGridSize: 4,
    patternTypes: ["shape", "color"] as ("shape" | "color" | "sequence" | "rotation")[],
  });

  const [appliedConfig, setAppliedConfig] = useState(config);
  const isValid = useSelector((state: RootState) => state.captcha.isValid);
  const [hasChanges, setHasChanges] = useState(false);
  const [eventLog, setEventLog] = useState<string[]>([]);

  const addToEventLog = (event: string) => {
    if (config.showEventLog) {
      setEventLog((prev) => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: ${event}`,
      ]);
    }
  };

  const presets = {
    login: {
      type: "numbers" as const,
      length: 4,
      darkMode: false,
      maxAttempts: 3,
      showSuccessAnimation: true,
      description: "Simple 4-digit verification for login forms",
    },
    registration: {
      type: "mixed" as const,
      length: 6,
      darkMode: false,
      maxAttempts: 5,
      showSuccessAnimation: true,
      description: "Mixed characters for user registration",
    },
    ecommerce: {
      type: "mixed" as const,
      length: 5,
      customCharacters: "ABCDEF123456",
      caseSensitive: true,
      maxAttempts: 3,
      description: "High-security for e-commerce transactions",
    },
    accessible: {
      type: "letters" as const,
      length: 4,
      enableAudio: true,
      autoFocus: true,
      showSuccessAnimation: true,
      description: "Accessibility-focused with audio support",
    },
    slider: {
      type: "slider" as const,
      showSuccessAnimation: true,
      showConfetti: true,
      sliderComplexity: 3,
      description: "Interactive slider puzzle captcha",
    },
    math: {
      type: "math" as const,
      showSuccessAnimation: true,
      mathDifficulty: "easy" as const,
      mathOperations: ["add", "subtract"] as ("add" | "subtract" | "multiply" | "divide")[],
      description: "Math problem captcha for better UX",
    },
    pattern: {
      type: "pattern" as const,
      showSuccessAnimation: true,
      patternDifficulty: "easy" as const,
      patternGridSize: 4,
    }
  };

  const languages = {
    english: {},
    german: {
      securityCheck: "Sicherheitsüberprüfung",
      listenToCaptcha: "CAPTCHA anhören",
      refreshCaptcha: "CAPTCHA neu laden",
      inputPlaceholder: "Code eingeben",
      verifyButton: "Prüfen",
      verificationSuccessful: "Erfolg!",
    },
    spanish: {
      securityCheck: "Verificación de seguridad",
      listenToCaptcha: "Escuchar CAPTCHA",
      refreshCaptcha: "Actualizar CAPTCHA",
      inputPlaceholder: "Ingrese el código",
      verifyButton: "Verificar",
      verificationSuccessful: "¡Éxito!",
    },
  };

  const updateConfig = (key: string, value: string | number | boolean | any[]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    // Remove setIsValid(false) - Redux manages validation state
  };

  const applyPreset = (presetKey: keyof typeof presets) => {
    const preset = presets[presetKey];
    const newConfig = { ...config, ...preset };
    setConfig(newConfig);
    setAppliedConfig(newConfig);
    setHasChanges(false);
    // Remove setIsValid(false) - Redux manages validation state
  };

  const applyChanges = () => {
    setAppliedConfig(config);
    setHasChanges(false);
  };

  const resetChanges = () => {
    setConfig(appliedConfig);
    setHasChanges(false);
  };

  const generateCodeSnippet = () => {
    const props = [];

    if (config.type !== "mixed") props.push(`type="${config.type}"`);
    if (config.length !== 6) props.push(`length={${config.length}}`);
    if (config.darkMode) props.push(`darkMode={true}`);
    if (config.caseSensitive) props.push(`caseSensitive={true}`);
    if (!config.refreshable) props.push(`refreshable={false}`);
    if (!config.enableAudio) props.push(`enableAudio={false}`);
    if (config.showSuccessAnimation) props.push(`showSuccessAnimation={true}`);
    if (config.showConfetti) props.push(`showConfetti={true}`);
    if (config.autoFocus) props.push(`autoFocus={true}`);
    if (config.maxAttempts !== 3)
      props.push(`maxAttempts={${config.maxAttempts}}`);
    if (config.refreshInterval > 0)
      props.push(`refreshInterval={${config.refreshInterval}}`);
    if (config.customCharacters)
      props.push(`customCharacters="${config.customCharacters}"`);
    if (config.rtl) props.push(`rtl={true}`);
    if (config.language !== "english")
      props.push(`i18n={${config.language}Labels}`);

    props.push(`onValidate={(isValid) => setVerified(isValid)}`);

    return `<Captcha\n  ${props.join("\n  ")}\n/>`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-4">
          🎮 Interactive Playground
        </h3>
        <p className="text-gray-600">
          Configure your CAPTCHA settings and click "Apply Changes" to see the
          results
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
            <h4 className="text-lg font-semibold mb-4">⚙️ Configuration</h4>

            {/* Apply/Reset Buttons */}
            {hasChanges && (
              <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  You have unsaved changes
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={applyChanges}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Apply Changes
                  </button>
                  <button
                    onClick={resetChanges}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key as keyof typeof presets)}
                    className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors capitalize"
                    title={preset.description}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={config.type}
                  onChange={(e) => updateConfig("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="numbers">Numbers</option>
                  <option value="letters">Letters</option>
                  <option value="mixed">Mixed</option>
                  <option value="slider">Slider Puzzle</option>
                  <option value="math">Math Problem</option>
                  <option value="pattern">Pattern Recognition</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length: {config.length}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={config.length}
                  onChange={(e) =>
                    updateConfig("length", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attempts: {config.maxAttempts}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={config.maxAttempts}
                  onChange={(e) =>
                    updateConfig("maxAttempts", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-refresh (seconds): {config.refreshInterval || "Off"}
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={config.refreshInterval}
                  onChange={(e) =>
                    updateConfig("refreshInterval", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Characters
                </label>
                <input
                  type="text"
                  value={config.customCharacters}
                  onChange={(e) =>
                    updateConfig("customCharacters", e.target.value)
                  }
                  placeholder="e.g., ABCDEF123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={config.language}
                  onChange={(e) => updateConfig("language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="english">English</option>
                  <option value="german">German</option>
                  <option value="spanish">Spanish</option>
                </select>
              </div>
            </div>

            {/* Slider-specific options */}
            {config.type === "slider" && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-900">
                  Slider Puzzle Settings
                </h5>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width: {config.sliderWidth}px
                    </label>
                    <input
                      type="range"
                      min="300"
                      max="500"
                      step="10"
                      value={config.sliderWidth}
                      onChange={(e) =>
                        updateConfig("sliderWidth", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height: {config.sliderHeight}px
                    </label>
                    <input
                      type="range"
                      min="150"
                      max="300"
                      step="10"
                      value={config.sliderHeight}
                      onChange={(e) =>
                        updateConfig("sliderHeight", parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Piece Size: {config.sliderPieceSize}px
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="60"
                    step="2"
                    value={config.sliderPieceSize}
                    onChange={(e) =>
                      updateConfig("sliderPieceSize", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tolerance: {config.sliderTolerance}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="15"
                    step="1"
                    value={config.sliderTolerance}
                    onChange={(e) =>
                      updateConfig("sliderTolerance", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complexity: {config.sliderComplexity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={config.sliderComplexity}
                    onChange={(e) =>
                      updateConfig("sliderComplexity", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.sliderEnableShadow}
                    onChange={(e) =>
                      updateConfig("sliderEnableShadow", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable Shadow Effects
                  </span>
                </label>
              </div>
            )}

            {config.type === "math" && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-900">
                  Math Captcha Settings
                </h5>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={config.mathDifficulty}
                    onChange={(e) => updateConfig("mathDifficulty", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy (1-10)</option>
                    <option value="medium">Medium (10-50)</option>
                    <option value="hard">Hard (50-100)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operations
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["add", "subtract", "multiply", "divide"].map((op) => (
                      <label key={op} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.mathOperations.includes(op as any)}
                          onChange={(e) => {
                            const operations = e.target.checked
                              ? [...config.mathOperations, op as any]
                              : config.mathOperations.filter((o) => o !== op);
                            updateConfig("mathOperations", operations);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {op}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Format
                  </label>
                  <select
                    value={config.mathDisplayFormat}
                    onChange={(e) => updateConfig("mathDisplayFormat", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="horizontal">Horizontal (a + b = ?)</option>
                    <option value="vertical">Vertical (stack format)</option>
                  </select>
                </div>
              </div>
            )}

            {config.type === "pattern" && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-900">
                  Pattern Captcha Settings
                </h5>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={config.patternDifficulty}
                    onChange={(e) => updateConfig("patternDifficulty", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy (4 items)</option>
                    <option value="medium">Medium (6 items)</option>
                    <option value="hard">Hard (9 items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grid Size: {config.patternGridSize} items
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="1"
                    value={config.patternGridSize}
                    onChange={(e) => updateConfig("patternGridSize", parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pattern Types
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["shape", "color", "sequence", "rotation"].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.patternTypes.includes(type as any)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...config.patternTypes, type as any]
                              : config.patternTypes.filter((t) => t !== type);
                            updateConfig("patternTypes", types);
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Boolean Options */}
            <div className="mt-6 space-y-3">
              {[
                { key: "darkMode", label: "Dark Mode" },
                { key: "caseSensitive", label: "Case Sensitive" },
                { key: "refreshable", label: "Refreshable" },
                { key: "enableAudio", label: "Enable Audio" },
                { key: "showSuccessAnimation", label: "Success Animation" },
                { key: "showConfetti", label: "Show Confetti" },
                { key: "autoFocus", label: "Auto Focus" },
                { key: "rtl", label: "Right-to-Left" },
                { key: "showEventLog", label: "Show Event Log" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config[key as keyof typeof config] as boolean}
                    onChange={(e) => updateConfig(key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            {/* Advanced Styling */}
            <div className="mt-6 space-y-4">
              <h5 className="font-medium text-gray-900">Advanced Styling</h5>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSS Class Name
                </label>
                <input
                  type="text"
                  value={config.className}
                  onChange={(e) => updateConfig("className", e.target.value)}
                  placeholder="e.g., my-custom-captcha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Styles (CSS)
                </label>
                <textarea
                  value={config.customStyles}
                  onChange={(e) => updateConfig("customStyles", e.target.value)}
                  placeholder="e.g., backgroundColor: '#f0f0f0', borderRadius: '8px'"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Input Button Style
                </label>
                <input
                  type="text"
                  value={config.inputButtonStyle}
                  onChange={(e) =>
                    updateConfig("inputButtonStyle", e.target.value)
                  }
                  placeholder="e.g., btn-primary custom-input"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Validation Rules */}
            <div className="mt-6 space-y-4">
              <h5 className="font-medium text-gray-900">Validation Rules</h5>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={config.validationMinLength}
                    onChange={(e) =>
                      updateConfig(
                        "validationMinLength",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={config.validationMaxLength}
                    onChange={(e) =>
                      updateConfig(
                        "validationMaxLength",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allowed Characters (Validation)
                </label>
                <input
                  type="text"
                  value={config.validationAllowedChars}
                  onChange={(e) =>
                    updateConfig("validationAllowedChars", e.target.value)
                  }
                  placeholder="e.g., ABCDEF123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Validator (JS Expression)
                </label>
                <textarea
                  value={config.validationCustom}
                  onChange={(e) =>
                    updateConfig("validationCustom", e.target.value)
                  }
                  placeholder="e.g., /^[A-Z]+$/.test(value) || 'Only uppercase letters'"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Confetti Options */}
            {config.showConfetti && (
              <div className="mt-6 space-y-4">
                <h5 className="font-medium text-gray-900">Confetti Options</h5>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Particle Count: {config.confettiParticles}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="25"
                    value={config.confettiParticles}
                    onChange={(e) =>
                      updateConfig(
                        "confettiParticles",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colors (comma-separated hex)
                  </label>
                  <input
                    type="text"
                    value={config.confettiColors}
                    onChange={(e) =>
                      updateConfig("confettiColors", e.target.value)
                    }
                    placeholder="#ff0000,#00ff00,#0000ff"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (ms): {config.confettiDuration}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={config.confettiDuration}
                    onChange={(e) =>
                      updateConfig("confettiDuration", parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Final Apply Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={applyChanges}
                disabled={!hasChanges}
                className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${hasChanges
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {hasChanges ? "Apply Changes" : "No Changes to Apply"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* CAPTCHA Preview */}
            <div
              className={`rounded-2xl shadow-xl p-8 ${appliedConfig.darkMode
                ? "bg-gray-900 border border-gray-800"
                : "bg-white border border-gray-100"
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h4
                  className={`text-lg font-semibold ${appliedConfig.darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  🎯 Live Preview
                </h4>
                <div
                  className={`text-sm ${appliedConfig.darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  Status:{" "}
                  {isValid ? (
                    <span className="text-green-500 font-medium">
                      ✅ Verified
                    </span>
                  ) : (
                    "Awaiting verification"
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <Captcha
                  type={appliedConfig.type}
                  length={appliedConfig.length}
                  darkMode={appliedConfig.darkMode}
                  caseSensitive={appliedConfig.caseSensitive}
                  refreshable={appliedConfig.refreshable}
                  enableAudio={appliedConfig.enableAudio}
                  showSuccessAnimation={appliedConfig.showSuccessAnimation}
                  showConfetti={appliedConfig.showConfetti}
                  autoFocus={appliedConfig.autoFocus}
                  maxAttempts={appliedConfig.maxAttempts}
                  refreshInterval={appliedConfig.refreshInterval}
                  customCharacters={appliedConfig.customCharacters || undefined}
                  rtl={appliedConfig.rtl}
                  className={appliedConfig.className}
                  inputButtonStyle={appliedConfig.inputButtonStyle}
                  customStyles={
                    appliedConfig.customStyles
                      ? eval(`({${appliedConfig.customStyles}})`)
                      : undefined
                  }
                  confettiOptions={{
                    particleCount: appliedConfig.confettiParticles,
                    colors: appliedConfig.confettiColors
                      .split(",")
                      .map((c) => c.trim()),
                    duration: appliedConfig.confettiDuration,
                  }}
                  validationRules={{
                    required: appliedConfig.validationRequired,
                    ...(appliedConfig.validationMinLength > 0 && {
                      minLength: appliedConfig.validationMinLength,
                    }),
                    ...(appliedConfig.validationMaxLength > 0 && {
                      maxLength: appliedConfig.validationMaxLength,
                    }),
                    ...(appliedConfig.validationAllowedChars && {
                      allowedCharacters: appliedConfig.validationAllowedChars,
                    }),
                    ...(appliedConfig.validationCustom && {
                      customValidator: (value: string) => {
                        try {
                          return eval(
                            appliedConfig.validationCustom.replace(
                              "value",
                              `"${value}"`
                            )
                          );
                        } catch {
                          return "Invalid custom validator";
                        }
                      },
                    }),
                  }}
                  i18n={
                    languages[appliedConfig.language as keyof typeof languages]
                  }
                  sliderConfig={{
                    width: appliedConfig.sliderWidth,
                    height: appliedConfig.sliderHeight,
                    pieceSize: appliedConfig.sliderPieceSize,
                    tolerance: appliedConfig.sliderTolerance,
                    complexity: appliedConfig.sliderComplexity,
                    enableShadow: appliedConfig.sliderEnableShadow,
                  }}
                  mathConfig={{
                    difficulty: appliedConfig.mathDifficulty,
                    operations: appliedConfig.mathOperations,
                    displayFormat: appliedConfig.mathDisplayFormat,
                    numberRange: appliedConfig.mathDifficulty === "easy" ? { min: 1, max: 10 } :
                      appliedConfig.mathDifficulty === "medium" ? { min: 10, max: 50 } :
                        { min: 50, max: 100 },
                  }}
                  patternConfig={{
                    difficulty: appliedConfig.patternDifficulty,
                    gridSize: appliedConfig.patternGridSize,
                    patternTypes: appliedConfig.patternTypes,
                  }}
                  onChange={(value) =>
                    addToEventLog(`Input changed: "${value}"`)
                  }
                  onValidate={(valid) => {
                    // Remove setIsValid(valid) - Redux manages validation state
                    addToEventLog(
                      `Validation: ${valid ? "Success" : "Failed"}`
                    );
                  }}
                  onRefresh={() => addToEventLog("CAPTCHA refreshed")}
                  onAudioPlay={() => addToEventLog("Audio played")}
                  onError={(error) => addToEventLog(`Error: ${error}`)}
                  onFail={() => addToEventLog("Validation failed")}
                />
              </div>
            </div>

            {/* Event Log */}
            {appliedConfig.showEventLog && eventLog.length > 0 && (
              <div
                className={`rounded-2xl shadow-xl p-6 ${appliedConfig.darkMode
                  ? "bg-gray-900 border border-gray-800"
                  : "bg-white border border-gray-100"
                  }`}
              >
                <h4
                  className={`text-lg font-semibold mb-4 ${appliedConfig.darkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                  📊 Event Log
                </h4>
                <div className="space-y-2">
                  {eventLog.map((event, index) => (
                    <div
                      key={index}
                      className={`text-sm font-mono p-2 rounded ${appliedConfig.darkMode
                        ? "bg-gray-800 text-gray-300"
                        : "bg-gray-50 text-gray-600"
                        }`}
                    >
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Code */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">📝 Generated Code</h4>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(generateCodeSnippet())
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{generateCodeSnippet()}</code>
              </pre>
            </div>

            {/* Feature Highlights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold mb-4">
                💡 Rate Limiting Prevention
              </h4>
              <div className="grid md:grid-cols-1 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <strong>🔧 How it works:</strong> Adjust settings on the
                    left, then click "Apply Changes" to update the CAPTCHA
                  </p>
                  <p>
                    <strong>⚡ Performance:</strong> This prevents rate limiting
                    by only generating new CAPTCHAs when you apply changes
                  </p>
                  <p>
                    <strong>🎯 Tip:</strong> Use presets for quick
                    configurations, or customize individual settings for your
                    needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
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
            Interactive Playground
          </h2>
          <div className="w-full flex items-center justify-center">
            <a
              href="https://www.npmjs.com/package/recaptz?activeTab=readme"
              className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md transition-colors bg-blue-100 text-blue-600 font-medium"
            >
              View Documentation <ArrowRight size={20} />
            </a>
          </div>

          <CaptchaPlayground />
        </div>

        <div
          id="documentation"
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
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
