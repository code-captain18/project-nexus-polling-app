import { Text, TouchableOpacity, View } from "react-native";

interface VotingOptionProps {
    text: string;
    isSelected: boolean;
    onSelect: () => void;
}

export default function VotingOption({ text, isSelected, onSelect }: VotingOptionProps) {
    return (
        <TouchableOpacity
            onPress={onSelect}
            className="mb-3 p-5 rounded-2xl"
            style={{
                backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                borderWidth: 2,
                borderColor: isSelected ? '#2563EB' : '#E2E8F0',
                shadowColor: isSelected ? '#2563EB' : '#1E293B',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.15 : 0.05,
                shadowRadius: 8,
                elevation: isSelected ? 3 : 1,
            }}
        >
            <View className="flex-row items-center">
                <View
                    className="w-6 h-6 rounded-full items-center justify-center mr-4"
                    style={{
                        backgroundColor: isSelected ? '#2563EB' : '#FFFFFF',
                        borderWidth: 2,
                        borderColor: isSelected ? '#2563EB' : '#CBD5E1',
                    }}
                >
                    {isSelected && (
                        <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }} />
                    )}
                </View>
                <Text
                    className="text-base flex-1"
                    style={{
                        color: isSelected ? '#1E293B' : '#64748B',
                        fontWeight: isSelected ? '700' : '500',
                    }}
                >
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
