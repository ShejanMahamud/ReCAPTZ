import React, { useState } from 'react';
import { RefreshCw, KeyRound, Volume2 } from 'lucide-react';
import { useFocusRing } from '@react-aria/focus';
import useSound from 'use-sound';
import { CaptchaProps } from '../types';
import { CaptchaProvider, useCaptcha } from '../context/CaptchaContext';
import { CaptchaInput } from './CaptchaInput';
import { CaptchaCanvas } from './CaptchaCanvas';

const CaptchaContent: React.FC<CaptchaProps> = ({
  onChange,
  className = '',
  refreshable = true,
  darkMode = false
}) => {
  const { isFocusVisible, focusProps } = useFocusRing();
  const { captchaText, refresh } = useCaptcha();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [playSuccess] = useSound('/success.mp3', { volume: 0.5 });
  const [playError] = useSound('/error.mp3', { volume: 0.5 });

  const handleRefresh = () => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance();
      utterance.text = Array.from(captchaText).join(' ');
      utterance.rate = 0.7;
      utterance.pitch = 1;
      utterance.volume = 1;

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

  return (
    <div 
      className={`w-full max-w-md transition-all duration-200
        ${darkMode ? 'text-white' : 'text-gray-900'}
        ${className}`}
      {...focusProps}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Security Check</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={speakCaptcha}
            className={`p-1.5 rounded-md transition-colors
              ${darkMode 
                ? 'hover:bg-gray-800 active:bg-gray-700' 
                : 'hover:bg-gray-100 active:bg-gray-200'}`}
            aria-label="Listen to CAPTCHA"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {refreshable && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-1.5 rounded-md transition-colors
                ${darkMode 
                  ? 'hover:bg-gray-800 active:bg-gray-700' 
                  : 'hover:bg-gray-100 active:bg-gray-200'}
                ${isRefreshing ? 'animate-spin' : ''}`}
              aria-label="Refresh CAPTCHA"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className={`rounded-lg border shadow-sm ${
        darkMode 
          ? 'border-gray-700 bg-gray-900 shadow-gray-900/50' 
          : 'border-gray-200 bg-white'
      }`}>
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'}`}>
            <CaptchaCanvas darkMode={darkMode} height={60} />
          </div>
        </div>
        <div className="p-3">
          <CaptchaInput onChange={onChange} darkMode={darkMode} />
        </div>
      </div>

      <div className={`mt-1.5 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Press Space to hear the code • Enter to validate • Esc to clear
      </div>
    </div>
  );
};

export const Captcha: React.FC<CaptchaProps> = (props) => {
  return (
    <CaptchaProvider
      type={props.type}
      length={props.length}
      caseSensitive={props.caseSensitive}
      customCharacters={props.customCharacters}
      validationRules={props.validationRules}
      onValidate={props.onValidate}
    >
      <CaptchaContent {...props} />
    </CaptchaProvider>
  );
};