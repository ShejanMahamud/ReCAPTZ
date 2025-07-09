import { AlertTriangle } from "lucide-react";
import React from "react";

interface CaptchaAttemptsProps {
  current: number;
  max: number;
  darkMode?: boolean;
  i18n?: any;
}

export const CaptchaAttempts: React.FC<CaptchaAttemptsProps> = ({
  current,
  max,
  darkMode,
  i18n = {},
}) => {
  const remaining = max - current;
  const isWarning = remaining <= Math.ceil(max / 3);
  const attemptsMsg = i18n.attemptsRemaining
    ? i18n.attemptsRemaining(remaining)
    : `${remaining} attempt${remaining !== 1 ? "s" : ""} remaining`;
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        isWarning
          ? darkMode
            ? "text-red-400"
            : "text-red-500"
          : darkMode
          ? "text-gray-400"
          : "text-gray-500"
      }`}
    >
      {isWarning && <AlertTriangle className="w-4 h-4" />}
      <span>{attemptsMsg}</span>
    </div>
  );
};
