import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface DateTimePickerButtonProps {
    label: string;
    value?: Date;
    onPress: () => void;
    onClear?: () => void;
    placeholder: string;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    borderColor: string;
}

export default function DateTimePickerButton({
    label,
    value,
    onPress,
    onClear,
    placeholder,
    iconName,
    color,
    bgColor,
    borderColor
}: DateTimePickerButtonProps) {
    return (
        <View className="mb-4">
            <Text className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{label}</Text>
            <TouchableOpacity
                onPress={onPress}
                className="rounded-2xl p-4 flex-row items-center justify-between"
                style={{
                    backgroundColor: '#FFFFFF',
                    borderWidth: 2,
                    borderColor: value ? borderColor : '#E2E8F0',
                }}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: value ? bgColor : '#EFF6FF' }}>
                        <Ionicons name={iconName} size={22} color={value ? color : '#2563EB'} />
                    </View>
                    <Text className="ml-3 text-base font-semibold" style={{ color: value ? '#1E293B' : '#64748B' }}>
                        {value
                            ? value.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                            })
                            : placeholder}
                    </Text>
                </View>
                {value && onClear && (
                    <TouchableOpacity
                        onPress={onClear}
                        className="w-8 h-8 rounded-lg items-center justify-center"
                        style={{ backgroundColor: '#FEE2E2' }}
                    >
                        <Ionicons name="close" size={18} color="#EF4444" />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
}
