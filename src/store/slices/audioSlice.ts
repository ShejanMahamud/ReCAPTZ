import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AudioState {
    isSupported: boolean;
    isPlaying: boolean;
    isLoading: boolean;
    currentUtterance: SpeechSynthesisUtterance | null;
    error: string | null;

    // Audio settings
    settings: {
        rate: number;
        pitch: number;
        volume: number;
        language: string;
        voice?: SpeechSynthesisVoice;
    };

    // Available voices
    availableVoices: SpeechSynthesisVoice[];

    // Audio history for debugging
    playHistory: {
        timestamp: number;
        text: string;
        success: boolean;
        error?: string;
    }[];
}

const initialState: AudioState = {
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    isPlaying: false,
    isLoading: false,
    currentUtterance: null,
    error: null,
    settings: {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
        language: 'en-US',
    },
    availableVoices: [],
    playHistory: [],
};

const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        // Audio support detection
        setAudioSupport: (state, action: PayloadAction<boolean>) => {
            state.isSupported = action.payload;
        },

        // Playback state management
        setPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
            if (!action.payload) {
                state.currentUtterance = null;
            }
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setSpeechUtterance: (state, action: PayloadAction<SpeechSynthesisUtterance | null>) => {
            state.currentUtterance = action.payload;
        },

        // Error handling
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            if (action.payload) {
                state.isPlaying = false;
                state.isLoading = false;
                state.currentUtterance = null;
            }
        },

        clearError: (state) => {
            state.error = null;
        },

        // Settings management
        updateSettings: (state, action: PayloadAction<Partial<AudioState['settings']>>) => {
            state.settings = { ...state.settings, ...action.payload };
        },

        setRate: (state, action: PayloadAction<number>) => {
            state.settings.rate = Math.max(0.1, Math.min(10, action.payload));
        },

        setPitch: (state, action: PayloadAction<number>) => {
            state.settings.pitch = Math.max(0, Math.min(2, action.payload));
        },

        setVolume: (state, action: PayloadAction<number>) => {
            state.settings.volume = Math.max(0, Math.min(1, action.payload));
        },

        setLanguage: (state, action: PayloadAction<string>) => {
            state.settings.language = action.payload;
        },

        setVoice: (state, action: PayloadAction<SpeechSynthesisVoice | undefined>) => {
            state.settings.voice = action.payload;
        },

        // Available voices
        setAvailableVoices: (state, action: PayloadAction<SpeechSynthesisVoice[]>) => {
            state.availableVoices = action.payload;
        },

        // History management
        addToHistory: (state, action: PayloadAction<{
            text: string;
            success: boolean;
            error?: string;
        }>) => {
            state.playHistory.push({
                timestamp: Date.now(),
                text: action.payload.text,
                success: action.payload.success,
                error: action.payload.error,
            });

            // Keep only last 20 entries
            if (state.playHistory.length > 20) {
                state.playHistory = state.playHistory.slice(-20);
            }
        },

        clearHistory: (state) => {
            state.playHistory = [];
        },

        // Stop and reset
        stopAudio: (state) => {
            state.isPlaying = false;
            state.isLoading = false;
            state.currentUtterance = null;
            state.error = null;
        },

        reset: (state) => {
            state.isPlaying = false;
            state.isLoading = false;
            state.currentUtterance = null;
            state.error = null;
            state.playHistory = [];
        },
    },
});

// Thunk actions for async audio operations
export const initializeAudioAsync = () => {
    return (dispatch: any) => {
        // Check audio support
        const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
        dispatch(setAudioSupport(isSupported));

        if (isSupported) {
            // Load available voices
            const loadVoices = () => {
                const voices = speechSynthesis.getVoices();
                dispatch(setAvailableVoices(voices));

                // Set default voice for the current language
                const defaultVoice = voices.find(voice =>
                    voice.lang.startsWith('en') && voice.default
                ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

                if (defaultVoice) {
                    dispatch(setVoice(defaultVoice));
                }
            };

            // Load voices immediately
            loadVoices();

            // Also listen for voices changed event (some browsers load voices asynchronously)
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    };
};

export const speakTextAsync = (text: string) => {
    return (dispatch: any, getState: any) => {
        const state = getState().audio;

        if (!state.isSupported) {
            const error = 'Text-to-speech is not supported in this browser';
            dispatch(setError(error));
            dispatch(addToHistory({ text, success: false, error }));
            return;
        }

        if (!text.trim()) {
            const error = 'No text provided to speak';
            dispatch(setError(error));
            dispatch(addToHistory({ text, success: false, error }));
            return;
        }

        dispatch(setLoading(true));
        dispatch(clearError());

        try {
            // Cancel any current speech
            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance();

            // Handle special case for slider CAPTCHA
            if (text === "SLIDER_CAPTCHA") {
                utterance.text = "Complete the slider puzzle by dragging the piece to the correct position";
            } else {
                // Spell out the captcha with spaces for better clarity
                utterance.text = text.split("").join(" ");
            }

            // Apply settings
            utterance.rate = state.settings.rate;
            utterance.pitch = state.settings.pitch;
            utterance.volume = state.settings.volume;
            utterance.lang = state.settings.language;

            if (state.settings.voice) {
                utterance.voice = state.settings.voice;
            }

            // Set up event handlers
            utterance.onstart = () => {
                dispatch(setPlaying(true));
                dispatch(setLoading(false));
            };

            utterance.onend = () => {
                dispatch(setPlaying(false));
                dispatch(setSpeechUtterance(null));
                dispatch(addToHistory({ text, success: true }));
            };

            utterance.onerror = (event) => {
                const error = `Speech synthesis error: ${event.error}`;
                dispatch(setError(error));
                dispatch(setPlaying(false));
                dispatch(setSpeechUtterance(null));
                dispatch(addToHistory({ text, success: false, error }));
            };

            utterance.onpause = () => {
                dispatch(setPlaying(false));
            };

            utterance.onresume = () => {
                dispatch(setPlaying(true));
            };

            // Store the utterance and start speaking
            dispatch(setSpeechUtterance(utterance));
            speechSynthesis.speak(utterance);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown speech error';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            dispatch(addToHistory({ text, success: false, error: errorMessage }));
        }
    };
};

export const stopSpeechAsync = () => {
    return (dispatch: any) => {
        try {
            speechSynthesis.cancel();
            dispatch(stopAudio());
        } catch (error) {
            // Silently handle stop errors
            dispatch(stopAudio());
        }
    };
};

export const pauseSpeechAsync = () => {
    return (dispatch: any) => {
        try {
            speechSynthesis.pause();
            dispatch(setPlaying(false));
        } catch (error) {
            dispatch(setError('Failed to pause speech'));
        }
    };
};

export const resumeSpeechAsync = () => {
    return (dispatch: any) => {
        try {
            speechSynthesis.resume();
            dispatch(setPlaying(true));
        } catch (error) {
            dispatch(setError('Failed to resume speech'));
        }
    };
};

export const {
    setAudioSupport,
    setPlaying,
    setLoading,
    setSpeechUtterance,
    setError,
    clearError,
    updateSettings,
    setRate,
    setPitch,
    setVolume,
    setLanguage,
    setVoice,
    setAvailableVoices,
    addToHistory,
    clearHistory,
    stopAudio,
    reset,
} = audioSlice.actions;

export default audioSlice.reducer;
