import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../config/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to ensure we only send Authorization header when we have a valid token
axiosInstance.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

let authToken: string | null = null;

export const setToken = (token: string | null) => {
    authToken = token;
};

export const getToken = (): string | null => {
    return authToken;
};

const request = async <T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
    try {
        console.log(`[API] Request: ${config.method || 'GET'} ${API_CONFIG.BASE_URL}${endpoint}`);

        const response = await axiosInstance.request<any>({
            url: endpoint,
            ...config,
        });

        console.log(`[API] Success: ${endpoint}`, response.status);

        return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message,
        };
    } catch (error: any) {
        console.error(`[API] Error: ${endpoint}`, error.message, error.code);
        console.error(`[API] Error details:`, JSON.stringify({
            message: error.message,
            code: error.code,
            hasResponse: !!error.response,
            hasRequest: !!error.request,
            config: {
                url: error.config?.url,
                baseURL: error.config?.baseURL,
                timeout: error.config?.timeout,
            }
        }));

        if (error.code === 'ECONNABORTED') {
            return {
                success: false,
                error: 'Request timeout. The server might be sleeping (cold start). Please try again.',
            };
        }

        if (error.response) {
            // Server responded with error
            console.error('[API] Server error:', error.response.status, error.response.data);
            return {
                success: false,
                error: error.response.data?.message || error.response.data?.error || 'An error occurred',
            };
        } else if (error.request) {
            // Request made but no response
            console.error('[API] No response from server. BASE_URL:', API_CONFIG.BASE_URL);
            console.error('[API] Request config:', error.config);
            return {
                success: false,
                error: `Network error - Cannot reach server. Please check your internet connection and try again.`,
            };
        } else {
            // Error setting up request
            return {
                success: false,
                error: error.message || 'Network error',
            };
        }
    }
};

export const get = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'GET',
    });
};

export const post = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'POST',
        data,
    });
};

export const put = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'PUT',
        data,
    });
};

export const patch = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'PATCH',
        data,
    });
};

export const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'DELETE',
    });
};
