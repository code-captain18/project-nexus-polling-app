import Constants from 'expo-constants';

// Get the correct API URL based on environment
const getApiUrl = () => {
    // Try to get the debugger host from Constants
    const debuggerHost = Constants.manifest?.debuggerHost ||
        Constants.manifest2?.extra?.expoGo?.debuggerHost ||
        Constants.expoConfig?.hostUri;

    if (debuggerHost) {
        // Extract IP from debuggerHost (format: "192.168.0.178:8081")
        const host = debuggerHost.split(':')[0];
        console.log('[API Config] Detected host:', host);
        return `http://${host}:3000`;
    }

    // Fallback to localhost for web/development build
    console.log('[API Config] Using localhost fallback');
    return 'http://localhost:3000';
};

// API Configuration
export const API_CONFIG = {
    // Temporarily hardcoded for mobile testing - change to localhost for web
    BASE_URL: 'http://192.168.0.178:3000',
    TIMEOUT: 30000, // 30 seconds
};

console.log('[API Config] Final BASE_URL:', API_CONFIG.BASE_URL);// API Endpoints
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
