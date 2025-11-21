import { API_CONFIG } from '../config/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

let authToken: string | null = null;

export const setToken = (token: string | null) => {
    authToken = token;
};

export const getToken = (): string | null => {
    return authToken;
};

const request = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
            ...config,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || data.error || 'An error occurred',
            };
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message,
        };
    } catch (error: any) {
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'Request timeout',
            };
        }

        return {
            success: false,
            error: error.message || 'Network error',
        };
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
        body: data ? JSON.stringify(data) : undefined,
    });
};

export const put = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
};

export const patch = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
    });
};

export const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return request<T>(endpoint, {
        method: 'DELETE',
    });
};
