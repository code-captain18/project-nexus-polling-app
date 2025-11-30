import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatusBannerProps {
    type: 'pending' | 'ended' | 'voted' | 'info';
    title: string;
    subtitle?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export default function StatusBanner({ type, title, subtitle, icon }: StatusBannerProps) {
    const getStyles = () => {
        switch (type) {
            case 'pending':
                return {
                    bg: '#FEF3C7',
                    border: '#FDE68A',
                    iconBg: '#F59E0B20',
                    iconColor: '#F59E0B',
                    titleColor: '#92400E',
                    subtitleColor: '#78350F',
                    defaultIcon: 'time-outline' as keyof typeof Ionicons.glyphMap
                };
            case 'ended':
                return {
                    bg: '#F1F5F9',
                    border: '#E2E8F0',
                    iconBg: '#64748B20',
                    iconColor: '#64748B',
                    titleColor: '#475569',
                    subtitleColor: '#64748B',
                    defaultIcon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap
                };
            case 'voted':
                return {
                    bg: '#D1FAE5',
                    border: '#6EE7B7',
                    iconBg: '#10B981',
                    iconColor: '#FFFFFF',
                    titleColor: '#065F46',
                    subtitleColor: '#047857',
                    defaultIcon: 'checkmark' as keyof typeof Ionicons.glyphMap
                };
            case 'info':
                return {
                    bg: '#DBEAFE',
                    border: '#93C5FD',
                    iconBg: '#2563EB',
                    iconColor: '#FFFFFF',
                    titleColor: '#1E40AF',
                    subtitleColor: '#1E293B',
                    defaultIcon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap
                };
        }
    };

    const styles = getStyles();

    return (
        <View className="mb-5 p-4 rounded-2xl" style={{
            backgroundColor: styles.bg,
            borderWidth: 1,
            borderColor: styles.border
        }}>
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: styles.iconBg }}>
                    <Ionicons
                        name={icon || styles.defaultIcon}
                        size={22}
                        color={styles.iconColor}
                    />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="font-bold text-base" style={{ color: styles.titleColor }}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-sm mt-0.5" style={{ color: styles.subtitleColor }}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
}
