import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotificationsAsync, markNotificationReadAsync } from "../store/thunks/notificationThunks";

export default function Notifications() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { notifications, loading, error } = useAppSelector((state) => state.notifications);
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

        // Navigate to poll if pollId exists in data
        if (notification.data?.pollId) {
            router.push(`/poll/${notification.data.pollId}` as any);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="bg-secondary-dark pb-6 px-6">
                <Text className="text-3xl font-bold text-background mb-2">
                    Notifications
                </Text>
                <Text className="text-primary-light text-sm">
                    Stay updated with your polls
                </Text>
            </View>

            {/* Notifications List */}
            <ScrollView className="flex-1 px-6 pt-4">
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
        </SafeAreaView>
    );
}
