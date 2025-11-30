import { API_ENDPOINTS } from '../config/api';
import type { ApiResponse } from './api';
import * as api from './api';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'vote' | 'comment' | 'poll_created' | 'other';
    read: boolean;
    createdAt: string;
    data?: any;
}

export const notificationService = {
    async getAllNotifications(): Promise<ApiResponse<Notification[]>> {
        return api.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
    },

    async markAsRead(id: string): Promise<ApiResponse> {
        return api.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    },

    async markAllAsRead(): Promise<ApiResponse> {
        return api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    },
};
