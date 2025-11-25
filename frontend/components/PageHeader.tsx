import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    backText?: string;
    rightElement?: React.ReactNode;
    onBack?: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

export default function PageHeader({
    title,
    subtitle,
    showBack = false,
    backText = "Back",
    rightElement,
    onBack,
    icon
}: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View className="pt-12 pb-6 px-6" style={{ backgroundColor: '#1E293B' }}>
            {showBack && (
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity onPress={handleBack} className="flex-row items-center">
                        <Ionicons name="arrow-back" size={24} color="#60A5FA" />
                        <Text className="text-base font-semibold ml-2" style={{ color: '#60A5FA' }}>{backText}</Text>
                    </TouchableOpacity>
                    {rightElement}
                </View>
            )}

            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-3xl font-bold text-white mb-1">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-base" style={{ color: '#CBD5E1' }}>
                            {subtitle}
                        </Text>
                    )}
                </View>
                {icon && (
                    <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#2563EB' }}>
                        <Ionicons name={icon} size={24} color="#FFFFFF" />
                    </View>
                )}
            </View>
        </View>
    );
}
