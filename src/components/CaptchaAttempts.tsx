import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CaptchaAttemptsProps {
  current: number;
  max: number;
  darkMode?: boolean;
}

export const CaptchaAttempts: React.FC<CaptchaAttemptsProps> = ({
  current,
  max,
  darkMode
}) => {
  const remaining = max - current;
  const isWarning = remaining <= Math.ceil(max / 3);

  return (
    <div className={`flex items-center gap-2 text-sm ${
      isWarning
        ? darkMode ? 'text-red-400' : 'text-red-500'
        : darkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>
      {isWarning && <AlertTriangle className="w-4 h-4" />}
      <span>
        {remaining} attempt{remaining !== 1 ? 's' : ''} remaining
      </span>
    </div>
  );
};