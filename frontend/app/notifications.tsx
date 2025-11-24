import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../global.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchNotificationsAsync, markNotificationReadAsync } from "../store/thunks/notificationThunks";

export default function Notifications() {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const { notifications, loading } = useAppSelector((state) => state.notifications);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchNotificationsAsync());
        }
    }, [dispatch, isAuthenticated]);

    const handleMarkAsRead = (id: string) => {
        dispatch(markNotificationReadAsync(id));
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="bg-secondary-dark pt-12 pb-6 px-6">
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
                            onPress={() => !notification.read && handleMarkAsRead(notification.id)}
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
