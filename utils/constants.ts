// App-wide constants

// Colors
export const COLORS = {
    primary: {
        main: '#2563EB',
        light: '#3B82F6',
        dark: '#1E40AF',
        bg: '#EFF6FF',
        border: '#DBEAFE',
    },
    success: {
        main: '#10B981',
        light: '#34D399',
        bg: '#D1FAE5',
        border: '#6EE7B7',
    },
    warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        bg: '#FEF3C7',
        border: '#FDE68A',
    },
    danger: {
        main: '#EF4444',
        light: '#F87171',
        bg: '#FEE2E2',
        border: '#FECACA',
    },
    neutral: {
        main: '#64748B',
        dark: '#1E293B',
        light: '#94A3B8',
        bg: '#F1F5F9',
        border: '#E2E8F0',
    },
    white: '#FFFFFF',
    background: '#F8FAFC',
} as const;

// Poll Chart Colors
export const CHART_COLORS = [
    '#2563EB', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
] as const;

// Timing
export const TIMING = {
    autoRefreshInterval: 0, // Disabled - use focus-based refresh only
    navigationDelay: 1, // 1ms for safe navigation
} as const;

// Limits
export const LIMITS = {
    pollQuestion: {
        max: 200,
        warning: 180,
    },
    pollOption: {
        max: 100,
    },
    pollOptions: {
        min: 2,
        max: 6,
    },
    unreadBadge: {
        max: 99,
    },
} as const;

// Chart Dimensions
export const CHART_CONFIG = {
    barHeight: 220,
    pieHeight: 220,
    paddingLeft: 15,
} as const;

// Tab Bar
export const TAB_BAR = {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    activeTintColor: '#0B6ECA',
    inactiveTintColor: '#49657B',
    borderTopColor: '#49657B',
} as const;

// Create Poll FAB
export const CREATE_FAB = {
    width: 60,
    height: 60,
    borderRadius: 30,
    topOffset: -10,
    iconSize: 32,
} as const;
