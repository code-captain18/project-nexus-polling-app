import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService';

// Fetch All Notifications
export const fetchNotificationsAsync = createAsyncThunk(
    'notifications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationService.getAllNotifications();

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to fetch notifications');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Mark Notification as Read
export const markNotificationReadAsync = createAsyncThunk(
    'notifications/markRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await notificationService.markAsRead(id);

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to mark as read');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);

// Mark All Notifications as Read
export const markAllNotificationsReadAsync = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationService.markAllAsRead();

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to mark all as read');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred');
        }
    }
);
