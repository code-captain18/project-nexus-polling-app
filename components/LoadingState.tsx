import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface LoadingStateProps {
    message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
    return (
        <View className="items-center justify-center py-20">
            <View className="w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                <Ionicons name="hourglass-outline" size={24} color="#2563EB" style={{ marginTop: 10, marginLeft: 10 }} />
            </View>
            <Text className="text-neutral-dark font-medium">{message}</Text>
        </View>
    );
}
