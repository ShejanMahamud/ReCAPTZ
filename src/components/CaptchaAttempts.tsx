import React from "react";

interface CaptchaAttemptsProps {
  current: number;
  max: number;
  darkMode?: boolean;
  i18n?: {
    attemptsRemaining?: (n: number) => string;
  };
}

export const CaptchaAttempts: React.FC<CaptchaAttemptsProps> = ({
  current,
  max,
  darkMode = false,
  i18n = {},
}) => {
  const remaining = Math.max(0, max - current);
  const percentage = (remaining / max) * 100;

  const getStatusColor = () => {
    if (percentage > 66) {
      return darkMode ? "text-green-400" : "text-green-600";
    } else if (percentage > 33) {
      return darkMode ? "text-yellow-400" : "text-yellow-600";
    } else {
      return darkMode ? "text-red-400" : "text-red-600";
    }
  };

  const getProgressBarColor = () => {
    if (percentage > 66) {
      return darkMode ? "bg-green-500/20" : "bg-green-100";
    } else if (percentage > 33) {
      return darkMode ? "bg-yellow-500/20" : "bg-yellow-100";
    } else {
      return darkMode ? "bg-red-500/20" : "bg-red-100";
    }
  };

  const getProgressFillColor = () => {
    if (percentage > 66) {
      return darkMode ? "bg-green-500" : "bg-green-500";
    } else if (percentage > 33) {
      return darkMode ? "bg-yellow-500" : "bg-yellow-500";
    } else {
      return darkMode ? "bg-red-500" : "bg-red-500";
    }
  };

  const defaultMessage = (n: number) =>
    `${n} attempt${n !== 1 ? "s" : ""} remaining`;

  const message = i18n.attemptsRemaining
    ? i18n.attemptsRemaining(remaining)
    : defaultMessage(remaining);

  if (remaining <= 0) {
    return (
      <div className="mt-2">
        <div
          className={`text-xs ${getStatusColor()} flex items-center justify-between`}
        >
          <span>No attempts remaining</span>
          <span className="text-xs font-mono">
            {current}/{max}
          </span>
        </div>
        <div
          className={`mt-1 w-full h-1.5 rounded-full ${getProgressBarColor()}`}
        >
          <div
            className={`h-full rounded-full transition-all duration-300 ${getProgressFillColor()}`}
            style={{ width: "0%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div
        className={`text-xs ${getStatusColor()} flex items-center justify-between`}
      >
        <span>{message}</span>
        <span className="text-xs font-mono">
          {current}/{max}
        </span>
      </div>
      <div
        className={`mt-1 w-full h-1.5 rounded-full ${getProgressBarColor()}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${getProgressFillColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
