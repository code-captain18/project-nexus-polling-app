import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
    return (
        <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full mb-6 items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                <Ionicons name={icon} size={40} color="#2563EB" />
            </View>
            <Text className="text-neutral-dark text-lg font-semibold mb-2">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-neutral text-sm text-center px-8">
                    {subtitle}
                </Text>
            )}
        </View>
    );
}
