// API Configuration - Always use deployed Vercel backend
export const API_CONFIG = {
    BASE_URL: 'https://project-nexus-backend.vercel.app',
    TIMEOUT: 60000, // 60 seconds for network requests
};

console.log('[API Config] Using deployed backend:', API_CONFIG.BASE_URL);// API Endpoints
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
