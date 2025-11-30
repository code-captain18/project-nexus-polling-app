import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { authService, SignInData, SignUpData } from '../../services/authService';

// Sign In Thunk
export const signInAsync = createAsyncThunk(
    'auth/signIn',
    async (data: SignInData, { rejectWithValue }) => {
        try {
            const response = await authService.signIn(data);

            if (!response.success) {
                return rejectWithValue(response.error || 'Sign in failed');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Sign Up Thunk
export const signUpAsync = createAsyncThunk(
    'auth/signUp',
    async (data: SignUpData, { rejectWithValue }) => {
        try {
            const response = await authService.signUp(data);

            if (!response.success) {
                return rejectWithValue(response.error || 'Sign up failed');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Logout Thunk
export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Get Current User Thunk
export const getMeAsync = createAsyncThunk(
    'auth/getMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getMe();

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to get user');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Set token from storage (for app initialization)
export const setTokenFromStorage = (token: string | null) => {
    if (token) {
        api.setToken(token);
    }
};
