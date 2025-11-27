import Constants from 'expo-constants';

// Get the correct API URL based on environment
const getApiUrl = () => {
    // Check if running in Expo Go (development)
    const isExpoGo = Constants.appOwnership === 'expo';

    // Development: Running in Expo Go or local dev
    if (isExpoGo || __DEV__) {
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
    }

    // Production: Standalone app (built APK/IPA)
    console.log('[API Config] Using production URL');
    return 'https://project-nexus-polling-app.onrender.com';
};

// API Configuration
export const API_CONFIG = {
    BASE_URL: getApiUrl(),
    TIMEOUT: 10000, // 10 seconds
};

console.log('[API Config] Environment:', Constants.appOwnership || 'standalone');
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
