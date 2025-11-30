import { Text, View } from "react-native";

interface PollStatusBadgeProps {
    status: 'pending' | 'active' | 'ended';
    label: string;
    color: string;
    bg: string;
}

export default function PollStatusBadge({ status, label, color, bg }: PollStatusBadgeProps) {
    return (
        <View
            className="px-3 py-1.5 rounded-full flex-row items-center"
            style={{ backgroundColor: bg }}
        >
            <View
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: color }}
            />
            <Text
                className="text-xs font-semibold"
                style={{ color }}
            >
                {label}
            </Text>
        </View>
    );
}
