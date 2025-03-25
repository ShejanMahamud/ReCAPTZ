import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface CaptchaTimerProps {
  duration: number;
  onExpire: () => void;
  darkMode?: boolean;
}

export const CaptchaTimer: React.FC<CaptchaTimerProps> = ({
  duration,
  onExpire,
  darkMode
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  return (
    <div className={`flex items-center gap-2 text-sm ${
      darkMode ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <Timer className="w-4 h-4" />
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: `${(timeLeft / duration) * 100}%` }}
        className={`h-1 rounded-full ${
          darkMode ? 'bg-blue-500/50' : 'bg-blue-200'
        }`}
      />
      <span>{timeLeft}s</span>
    </div>
  );
};