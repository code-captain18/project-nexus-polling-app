import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Notification } from '../../services/notificationService';
import {
    fetchNotificationsAsync,
    markAllNotificationsReadAsync,
    markNotificationReadAsync
} from '../thunks/notificationThunks';

interface NotificationsState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
}

const initialState: NotificationsState = {
    notifications: [],
    loading: false,
    error: null,
};

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
    extraReducers: (builder) => {
        // Fetch Notifications
        builder
            .addCase(fetchNotificationsAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload || [];
            })
            .addCase(fetchNotificationsAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Mark Notification as Read
        builder
            .addCase(markNotificationReadAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markNotificationReadAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.notifications.findIndex(n => n.id === action.payload.id);
                    if (index >= 0) {
                        state.notifications[index] = action.payload;
                    }
                }
            })
            .addCase(markNotificationReadAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Mark All Notifications as Read
        builder
            .addCase(markAllNotificationsReadAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAllNotificationsReadAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload || [];
            })
            .addCase(markAllNotificationsReadAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
