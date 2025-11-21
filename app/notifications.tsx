import { ScrollView, Text, View } from "react-native";
import "../global.css";
import { useAppSelector } from "../store/hooks";

export default function Notifications() {
    const { isAuthenticated } = useAppSelector((state) => state.auth);

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
                ) : (
                    <View className="items-center justify-center py-12">
                        <Text className="text-neutral text-center mb-2">
                            No notifications yet
                        </Text>
                        <Text className="text-neutral-light text-sm text-center">
                            You'll be notified when someone votes on your polls
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
