import React, { useState } from "react";
import { Captcha } from "../src/index";

const ErrorHandlingExample: React.FC = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<
    {
      id: string;
      message: string;
      severity: "low" | "medium" | "high";
      timestamp: Date;
    }[]
  >([]);

  const addNotification = (
    message: string,
    severity: "low" | "medium" | "high"
  ) => {
    const notification = {
      id: Date.now().toString(),
      message,
      severity,
      timestamp: new Date(),
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove low severity notifications
    if (severity === "low") {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 5000);
    }
  };

  const handleCaptchaError = (error: string) => {
    setErrors((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${error}`,
    ]);

    // Categorize error severity
    let severity: "low" | "medium" | "high" = "medium";

    if (
      error.includes("attempt") ||
      error.includes("Audio") ||
      error.includes("Enter")
    ) {
      severity = "low";
    } else if (
      error.includes("blocked") ||
      error.includes("unavailable") ||
      error.includes("server")
    ) {
      severity = "high";
    }

    addNotification(error, severity);
  };

  const handleCaptchaSuccess = () => {
    addNotification("CAPTCHA verified successfully!", "low");
    setErrors([]); // Clear errors on success
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">ReCAPTZ Auto-Mode Example</h1>
        <p className="text-gray-600 mb-6">
          This example demonstrates automatic server/client mode detection with
          gradual error handling:
        </p>
        <ul className="text-sm text-gray-600 mb-6 space-y-1">
          <li>
            <span className="text-blue-600 font-medium">
              ✨ Auto-Detection:
            </span>{" "}
            Automatically detects if ReCAPTZ server is available
          </li>
          <li>
            <span className="text-green-600 font-medium">
              🔄 Seamless Fallback:
            </span>{" "}
            Falls back to client mode if server is unavailable
          </li>
          <li>
            <span className="text-purple-600 font-medium">
              🎯 No Configuration:
            </span>{" "}
            Works out of the box without any API setup
          </li>
        </ul>

        {/* CAPTCHA Component - Notice no server configuration needed! */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <Captcha
            type="mixed"
            length={6}
            maxAttempts={3}
            enableAudio={true}
            showSuccessAnimation={true}
            onError={handleCaptchaError}
            onSuccess={handleCaptchaSuccess}
            onValidate={(isValid) => {
              if (isValid) {
                addNotification("CAPTCHA validation successful", "low");
              }
            }}
            i18n={{
              securityCheck: "Security Verification",
              inputPlaceholder: "Enter the code shown above",
              verifyButton: "Verify Code",
            }}
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🚀 How it works:
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • Checks for server at common endpoints (localhost:3000, etc.)
            </li>
            <li>
              • Uses environment variables if available
              (REACT_APP_RECAPTZ_API_URL)
            </li>
            <li>• Falls back to client-side generation if no server found</li>
            <li>• Automatically handles server failures during runtime</li>
          </ul>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Live Notifications</h2>
            <button
              onClick={clearNotifications}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-md text-sm ${
                  notification.severity === "low"
                    ? "bg-blue-50 border border-blue-200 text-blue-700"
                    : notification.severity === "high"
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span>{notification.message}</span>
                  <span className="text-xs opacity-60">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Log */}
      {errors.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Error Log</h2>
            <button
              onClick={clearErrors}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Clear Log
            </button>
          </div>
          <div className="bg-gray-50 rounded-md p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {errors.join("\n")}
            </pre>
          </div>
        </div>
      )}

      {/* Testing Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Test Error Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCaptchaError("Please enter the CAPTCHA code.")}
            className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-sm"
          >
            Simulate Low Severity Error
          </button>
          <button
            onClick={() =>
              handleCaptchaError(
                "Session expired or not found. A new CAPTCHA will be generated."
              )
            }
            className="p-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-md text-sm"
          >
            Simulate Medium Severity Error
          </button>
          <button
            onClick={() =>
              handleCaptchaError(
                "Access denied. Your IP may be temporarily blocked."
              )
            }
            className="p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-sm"
          >
            Simulate High Severity Error
          </button>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Simple Integration</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-md text-sm">
          <pre>{`// That's it! No server configuration needed
import { Captcha } from 'recaptz';

function MyForm() {
  return (
    <Captcha
      type="mixed"
      length={6}
      onSuccess={() => console.log('Verified!')}
      onError={(error) => console.log('Error:', error)}
    />
  );
}`}</pre>
        </div>

        <div className="mt-4 prose prose-sm">
          <h3>Environment Variables (Optional)</h3>
          <p>
            Set these environment variables to use your custom ReCAPTZ server:
          </p>
          <ul className="text-sm bg-gray-50 p-3 rounded">
            <li>
              <code>REACT_APP_RECAPTZ_API_URL</code> (React)
            </li>
            <li>
              <code>NEXT_PUBLIC_RECAPTZ_API_URL</code> (Next.js)
            </li>
            <li>
              <code>VITE_RECAPTZ_API_URL</code> (Vite)
            </li>
          </ul>

          <h3>No Configuration Benefits</h3>
          <ul>
            <li>Works immediately without any setup</li>
            <li>Automatically discovers server endpoints</li>
            <li>Graceful fallback to client mode</li>
            <li>Zero-config development experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandlingExample;
