import { ChartConfig } from 'react-native-chart-kit/dist/HelperTypes';
import { CHART_COLORS, COLORS } from './constants';

/**
 * Get common chart configuration
 */
export function getChartConfig(): Omit<ChartConfig, 'color' | 'labelColor'> & {
    color: (opacity?: number) => string;
    labelColor: (opacity?: number) => string;
} {
    return {
        backgroundColor: COLORS.white,
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: COLORS.neutral.border,
            strokeWidth: 1,
        },
        propsForLabels: {
            fontSize: 11,
            fontWeight: '600',
        },
    };
}

/**
 * Get color for pie chart segment
 */
export function getPieChartColor(index: number): string {
    return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Format pie chart data
 */
export function formatPieChartData(
    options: Array<{ text: string; votes: number }>
) {
    return options.map((opt, index) => ({
        name: opt.text,
        population: opt.votes || 0,
        color: getPieChartColor(index),
        legendFontColor: COLORS.neutral.dark,
        legendFontSize: 12,
    }));
}
