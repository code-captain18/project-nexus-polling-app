import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ResultsBreakdownProps {
    option: {
        id: string;
        text: string;
        votes: number;
    };
    percentage: number;
    isSelected: boolean;
}

export default function ResultsBreakdown({ option, percentage, isSelected }: ResultsBreakdownProps) {
    return (
        <View className="mb-5 p-4 rounded-2xl" style={{
            backgroundColor: isSelected ? '#DBEAFE' : '#F8FAFC',
            borderWidth: 1,
            borderColor: isSelected ? '#93C5FD' : '#E2E8F0'
        }}>
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center flex-1">
                    <Text
                        className="text-base flex-1"
                        style={{
                            color: isSelected ? '#1E40AF' : '#1E293B',
                            fontWeight: isSelected ? '700' : '600',
                        }}
                    >
                        {option.text}
                    </Text>
                    {isSelected && (
                        <View className="w-7 h-7 rounded-full items-center justify-center ml-2" style={{ backgroundColor: '#10B981' }}>
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                    )}
                </View>
                <Text className="text-lg font-bold ml-3" style={{ color: isSelected ? '#2563EB' : '#64748B' }}>
                    {percentage}%
                </Text>
            </View>
            <View className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                <View
                    className="h-full rounded-full"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: isSelected ? '#10B981' : '#60A5FA'
                    }}
                />
            </View>
            <Text className="text-xs font-semibold mt-2" style={{ color: '#64748B' }}>
                {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
            </Text>
        </View>
    );
}
