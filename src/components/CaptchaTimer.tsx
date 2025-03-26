import React from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

interface CaptchaTimerProps {
  duration: number;
  onExpire: () => void;
  darkMode?: boolean;
}

export const CaptchaTimer: React.FC<CaptchaTimerProps> = ({
  duration,
  onExpire,
  darkMode,
}) => {
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [key, setKey] = React.useState(0); // Used to restart animation smoothly

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onExpire(); // Trigger expiration function
      setTimeLeft(duration); // Reset timer
      setKey((prev) => prev + 1); // Change key to reset animation smoothly
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire, duration]);

  return (
    <div
      className={`flex items-center gap-2 text-sm p-2 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      <Timer className="w-4 h-4" />
      <div className="relative w-full h-1 rounded-full overflow-hidden bg-gray-300">
        <motion.div
          key={key} // Triggers animation restart
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration, ease: "easeInOut" }}
          className={`absolute left-0 h-full ${
            darkMode ? "bg-blue-500" : "bg-blue-400"
          }`}
        />
      </div>
      <span>{timeLeft}s</span>
    </div>
  );
};
