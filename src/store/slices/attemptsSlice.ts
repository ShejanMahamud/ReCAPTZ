import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AttemptsState {
    currentAttempts: number;
    maxAttempts: number;
    isMaxReached: boolean;
    attemptHistory: {
        timestamp: number;
        success: boolean;
        timeTaken?: number;
    }[];
    blockedUntil?: number;
    blockDuration: number; // in milliseconds
}

const initialState: AttemptsState = {
    currentAttempts: 0,
    maxAttempts: 3,
    isMaxReached: false,
    attemptHistory: [],
    blockDuration: 30000, // 30 seconds default
};

const attemptsSlice = createSlice({
    name: 'attempts',
    initialState,
    reducers: {
        setMaxAttempts: (state, action: PayloadAction<number>) => {
            state.maxAttempts = action.payload;
            state.isMaxReached = state.currentAttempts >= action.payload;
        },

        incrementAttempts: (state, action: PayloadAction<{
            success: boolean;
            timeTaken?: number;
        }>) => {
            state.currentAttempts += 1;
            state.isMaxReached = state.currentAttempts >= state.maxAttempts;

            // Add to history
            state.attemptHistory.push({
                timestamp: Date.now(),
                success: action.payload.success,
                timeTaken: action.payload.timeTaken,
            });

            // If max attempts reached and this attempt failed, set block
            if (state.isMaxReached && !action.payload.success) {
                state.blockedUntil = Date.now() + state.blockDuration;
            }

            // Keep only last 10 attempts in history
            if (state.attemptHistory.length > 10) {
                state.attemptHistory = state.attemptHistory.slice(-10);
            }
        },

        resetAttempts: (state) => {
            state.currentAttempts = 0;
            state.isMaxReached = false;
            state.blockedUntil = undefined;
            // Keep history but mark the reset point
            state.attemptHistory.push({
                timestamp: Date.now(),
                success: true, // Reset is considered a "success" event
                timeTaken: 0,
            });
        },

        clearHistory: (state) => {
            state.attemptHistory = [];
        },

        setBlockDuration: (state, action: PayloadAction<number>) => {
            state.blockDuration = action.payload;
        },

        clearBlock: (state) => {
            state.blockedUntil = undefined;
        },

        checkBlockStatus: (state) => {
            if (state.blockedUntil && Date.now() >= state.blockedUntil) {
                state.blockedUntil = undefined;
            }
        },
    },
});

// Selectors
export const selectRemainingAttempts = (state: { attempts: AttemptsState }) =>
    Math.max(0, state.attempts.maxAttempts - state.attempts.currentAttempts);

export const selectIsBlocked = (state: { attempts: AttemptsState }) =>
    state.attempts.blockedUntil ? Date.now() < state.attempts.blockedUntil : false;

export const selectBlockTimeRemaining = (state: { attempts: AttemptsState }) => {
    if (!state.attempts.blockedUntil) return 0;
    return Math.max(0, state.attempts.blockedUntil - Date.now());
};

export const selectSuccessRate = (state: { attempts: AttemptsState }) => {
    const history = state.attempts.attemptHistory;
    if (history.length === 0) return 0;
    const successCount = history.filter(attempt => attempt.success).length;
    return (successCount / history.length) * 100;
};

export const selectAverageTime = (state: { attempts: AttemptsState }) => {
    const history = state.attempts.attemptHistory.filter(attempt =>
        attempt.success && attempt.timeTaken
    );
    if (history.length === 0) return 0;
    const totalTime = history.reduce((sum, attempt) => sum + (attempt.timeTaken || 0), 0);
    return totalTime / history.length;
};

export const {
    setMaxAttempts,
    incrementAttempts,
    resetAttempts,
    clearHistory,
    setBlockDuration,
    clearBlock,
    checkBlockStatus,
} = attemptsSlice.actions;

export default attemptsSlice.reducer;
