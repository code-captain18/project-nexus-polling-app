import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    title: string;
    loadingTitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    loadingIcon?: keyof typeof Ionicons.glyphMap;
}

export default function PrimaryButton({
    onPress,
    disabled = false,
    loading = false,
    title,
    loadingTitle = "Loading...",
    icon = "checkmark-circle",
    loadingIcon = "hourglass-outline"
}: PrimaryButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            className="rounded-2xl py-4 items-center flex-row justify-center"
            style={{
                backgroundColor: !isDisabled ? '#2563EB' : '#E2E8F0',
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: !isDisabled ? 0.3 : 0,
                shadowRadius: 8,
                elevation: !isDisabled ? 5 : 0,
            }}
        >
            {loading ? (
                <>
                    <Ionicons name={loadingIcon} size={24} color="#FFFFFF" />
                    <Text className="text-lg font-bold ml-2" style={{ color: '#FFFFFF' }}>
                        {loadingTitle}
                    </Text>
                </>
            ) : (
                <>
                    <Ionicons name={icon} size={24} color={!isDisabled ? '#FFFFFF' : '#94A3B8'} />
                    <Text className="text-lg font-bold ml-2" style={{ color: !isDisabled ? '#FFFFFF' : '#94A3B8' }}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
