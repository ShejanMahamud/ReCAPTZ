import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCaptcha } from '../context/CaptchaContext';

interface CaptchaInputProps {
  onChange?: (value: string) => void;
  darkMode?: boolean;
}

export const CaptchaInput: React.FC<CaptchaInputProps> = ({ 
  onChange,
  darkMode = false
}) => {
  const { setUserInput, validate, error, isValid, captchaText } = useCaptcha();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        speakCaptcha();
      }
      if (e.code === 'Escape') {
        setUserInput('');
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [captchaText]);

  const speakCaptcha = () => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance();
      utterance.text = Array.from(captchaText).join(' ');
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || voice.name.includes('English')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validate();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className={`w-full px-3 py-2 text-sm rounded-md transition-all duration-200
            ${error 
              ? `${darkMode ? 'border-red-500/50 bg-red-500/5' : 'border-red-300 bg-red-50'} focus:ring-red-200` 
              : isValid
                ? `${darkMode ? 'border-green-500/50 bg-green-500/5' : 'border-green-300 bg-green-50'} focus:ring-green-200`
                : darkMode
                  ? 'border-gray-700 bg-gray-800/50 focus:border-blue-500/50'
                  : 'border-gray-200 bg-white focus:border-blue-400'
            }
            ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
            focus:outline-none focus:ring-2 focus:ring-offset-0 border`}
          placeholder="Enter the code above"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'captcha-error' : undefined}
        />
        {error && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <AlertCircle className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
        )}
        {isValid && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
          </div>
        )}
      </div>

      <button
        onClick={validate}
        className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0
          ${darkMode
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/30 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-200'
          }`}
      >
        <ShieldCheck className="w-4 h-4" />
        Verify
      </button>

      {error && (
        <div className="flex items-start gap-1.5 -mt-1" id="captcha-error" role="alert">
          <AlertCircle className={`w-3.5 h-3.5 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          <p className={`text-xs ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
        </div>
      )}
      {isValid && (
        <div className="flex items-start gap-1.5 -mt-1" role="status">
          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
          <p className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Verification successful</p>
        </div>
      )}
    </div>
  );
};