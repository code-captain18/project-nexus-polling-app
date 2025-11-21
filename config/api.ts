import Constants from 'expo-constants';

// API Configuration
export const API_CONFIG = {
    // Use your backend URL here
    // For local development: http://localhost:3000 or http://192.168.x.x:3000
    // For production: https://your-api.com
    BASE_URL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000',
    TIMEOUT: 30000, // 30 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        SIGNIN: '/auth/signin',
        SIGNUP: '/auth/signup',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        ME: '/auth/me',
    },

    // Poll endpoints
    POLLS: {
        GET_ALL: '/polls',
        GET_BY_ID: (id: string) => `/polls/${id}`,
        CREATE: '/polls',
        UPDATE: (id: string) => `/polls/${id}`,
        DELETE: (id: string) => `/polls/${id}`,
        VOTE: (id: string) => `/polls/${id}/vote`,
    },

    // User endpoints
    USERS: {
        GET_PROFILE: '/users/profile',
        UPDATE_PROFILE: '/users/profile',
        GET_MY_POLLS: '/users/polls',
        GET_MY_VOTES: '/users/votes',
    },

    // Notification endpoints
    NOTIFICATIONS: {
        GET_ALL: '/notifications',
        MARK_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
    },
};
