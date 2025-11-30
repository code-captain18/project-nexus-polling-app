import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { PageHeader } from "../components";
import "../global.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotificationsAsync, markNotificationReadAsync } from "../store/thunks/notificationThunks";

export default function Notifications() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { notifications, loading, error } = useAppSelector((state) => state.notifications);
    const { polls } = useAppSelector((state) => state.polls);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated && retryCount < 3) {
            dispatch(fetchNotificationsAsync()).catch(() => {
                // Silently handle the error - already tracked in Redux
            });
        }
    }, [dispatch, isAuthenticated, retryCount]);

    const handleMarkAsRead = (id: string) => {
        dispatch(markNotificationReadAsync(id));
    };

    const handleNotificationPress = (notification: any) => {
        // Mark as read if unread
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        // Try to get pollId from notification data first
        if (notification.pollId) {
            router.push(`/poll/${notification.pollId}` as any);
            return;
        }

        // If no direct pollId, extract from message as fallback
        // Message format: "Someone voted on your poll: [POLL QUESTION]"
        const messagePrefix = "Someone voted on your poll: ";
        if (notification.message && notification.message.startsWith(messagePrefix)) {
            const pollQuestion = notification.message.substring(messagePrefix.length);

            // Find the poll by question
            const matchingPoll = polls.find(poll => poll.question === pollQuestion);
            if (matchingPoll) {
                router.push(`/poll/${matchingPoll.id}` as any);
            }
        }
    };

    return (
        <View className="flex-1 bg-secondary-dark">
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" translucent={false} />
            <PageHeader
                title="Notifications"
                subtitle="Stay updated with your polls"
                icon="notifications"
            />

            {/* Notifications List */}
            <ScrollView className="flex-1 bg-background px-6 pt-4">
                {!isAuthenticated ? (
                    <View className="items-center justify-center py-12">
                        <Text className="text-neutral text-center mb-2">
                            Sign in to view notifications
                        </Text>
                    </View>
                ) : error ? (
                    <View className="items-center justify-center py-12">
                        <Text className="text-neutral text-center mb-4">
                            Unable to load notifications
                        </Text>
                        <Text className="text-neutral-light text-sm text-center mb-4">
                            {error.includes('timeout')
                                ? 'Server is taking too long to respond'
                                : 'Please check your connection and try again'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                setRetryCount(prev => prev + 1);
                                dispatch(fetchNotificationsAsync());
                            }}
                            className="bg-primary rounded-xl px-6 py-3"
                        >
                            <Text className="text-white font-semibold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : loading ? (
                    <View className="items-center justify-center py-12">
                        <Text className="text-neutral">Loading notifications...</Text>
                    </View>
                ) : notifications.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Text className="text-neutral text-center mb-2">
                            No notifications yet
                        </Text>
                        <Text className="text-neutral-light text-sm text-center">
                            You'll be notified when someone votes on your polls
                        </Text>
                    </View>
                ) : (
                    notifications.map((notification) => (
                        <TouchableOpacity
                            key={notification.id}
                            onPress={() => handleNotificationPress(notification)}
                            className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border ${notification.read ? 'border-primary-light/20' : 'border-primary/40'
                                }`}
                        >
                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <Text className={`text-base ${notification.read ? 'text-neutral-dark' : 'text-secondary-dark font-semibold'}`}>
                                        {notification.message}
                                    </Text>
                                    <Text className="text-neutral-light text-xs mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                {!notification.read && (
                                    <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-2" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
