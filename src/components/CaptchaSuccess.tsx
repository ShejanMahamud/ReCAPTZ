import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import { CaptchaI18n, ConfettiOptions } from "../types";

interface CaptchaSuccessProps {
  darkMode?: boolean;
  i18n?: CaptchaI18n;
  showConfetti?: boolean;
  confettiOptions?: ConfettiOptions;
}

export const CaptchaSuccess: React.FC<CaptchaSuccessProps> = ({
  darkMode,
  i18n = {},
  showConfetti = false,
  confettiOptions = {},
}) => {
  React.useEffect(() => {
    if (showConfetti) {
      const defaultOptions = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
        gravity: 1,
        scalar: 1,
        duration: 3000,
      };

      const finalOptions = { ...defaultOptions, ...confettiOptions };

      confetti(finalOptions);
    }
  }, [showConfetti, confettiOptions]);

  const message = i18n.verificationSuccessful || "Verification Successful!";

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`flex items-center justify-center p-4 rounded-lg ${
        darkMode ? "bg-green-500/10" : "bg-green-50"
      }`}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle2
          className={`w-4 h-4 ${
            darkMode ? "text-green-400" : "text-green-500"
          }`}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`ml-1 font-medium text-xs ${
          darkMode ? "text-green-400" : "text-green-600"
        }`}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};
