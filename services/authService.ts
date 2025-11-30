import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse } from './api';
import * as api from './api';

export interface SignInData {
    email: string;
    password: string;
}

export interface SignUpData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

export const authService = {
    async signIn(data: SignInData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>(
            API_ENDPOINTS.AUTH.SIGNIN,
            data
        );

        if (response.success && response.data?.token) {
            api.setToken(response.data.token);
        }

        return response;
    },

    async signUp(data: SignUpData): Promise<ApiResponse<AuthResponse>> {
        const response = await api.post<AuthResponse>(
            API_ENDPOINTS.AUTH.SIGNUP,
            data
        );

        if (response.success && response.data?.token) {
            api.setToken(response.data.token);
        }

        return response;
    },

    async logout(): Promise<ApiResponse> {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        api.setToken(null);
        return response;
    },

    async getMe(): Promise<ApiResponse<AuthResponse['user']>> {
        return api.get(API_ENDPOINTS.AUTH.ME);
    },

    async refreshToken(): Promise<ApiResponse<{ token: string }>> {
        const response = await api.post<{ token: string }>(
            API_ENDPOINTS.AUTH.REFRESH_TOKEN
        );

        if (response.success && response.data?.token) {
            api.setToken(response.data.token);
        }

        return response;
    },
};
