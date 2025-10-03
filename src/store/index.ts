import { configureStore } from '@reduxjs/toolkit';
import attemptsReducer from './slices/attemptsSlice';
import audioReducer from './slices/audioSlice';
import captchaReducer from './slices/captchaSlice';

export const store = configureStore({
    reducer: {
        captcha: captchaReducer,
        attempts: attemptsReducer,
        audio: audioReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['audio/setSpeechUtterance'],
                // Ignore these field paths in all actions
                ignoredActionsPaths: ['payload.utterance'],
                // Ignore these paths in the state
                ignoredPaths: ['audio.currentUtterance'],
            },
        }),
    devTools: typeof window !== 'undefined',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
