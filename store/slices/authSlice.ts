import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getMeAsync, logoutAsync, signInAsync, signUpAsync } from '../thunks/authThunks';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        signUp: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        signOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Sign In
        builder
            .addCase(signInAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(signInAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Sign Up
        builder
            .addCase(signUpAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(signUpAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutAsync.rejected, (state) => {
                state.loading = false;
            });

        // Get Me
        builder
            .addCase(getMeAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMeAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(getMeAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
            });
    },
});

export const { signIn, signUp, signOut, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
