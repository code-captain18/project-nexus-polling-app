import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface ChartTypeToggleProps {
    chartType: 'bar' | 'pie';
    onToggle: (type: 'bar' | 'pie') => void;
}

export default function ChartTypeToggle({ chartType, onToggle }: ChartTypeToggleProps) {
    return (
        <View className="flex-row rounded-xl p-1" style={{ backgroundColor: '#F1F5F9' }}>
            <TouchableOpacity
                onPress={() => onToggle('bar')}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: chartType === 'bar' ? '#2563EB' : 'transparent' }}
            >
                <Ionicons
                    name="bar-chart-outline"
                    size={20}
                    color={chartType === 'bar' ? '#FFFFFF' : '#64748B'}
                />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onToggle('pie')}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: chartType === 'pie' ? '#2563EB' : 'transparent' }}
            >
                <Ionicons
                    name="pie-chart-outline"
                    size={20}
                    color={chartType === 'pie' ? '#FFFFFF' : '#64748B'}
                />
            </TouchableOpacity>
        </View>
    );
}
