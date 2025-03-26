import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import React from "react";

interface CaptchaSuccessProps {
  darkMode?: boolean;
}

export const CaptchaSuccess: React.FC<CaptchaSuccessProps> = ({ darkMode }) => {
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

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
        Verification Successful!
      </motion.p>
    </motion.div>
  );
};
