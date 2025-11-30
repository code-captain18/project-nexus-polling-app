// Poll-related helper functions

export interface PollStatus {
    status: 'pending' | 'active' | 'ended';
    label: string;
    color: string;
    bg: string;
}

/**
 * Determine poll status based on start and end dates
 */
export function getPollStatus(
    startDate?: string | Date | null,
    endDate?: string | Date | null
): PollStatus {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && now < start) {
        return {
            status: 'pending',
            label: 'Upcoming',
            color: '#F59E0B',
            bg: '#FEF3C7',
        };
    }

    if (end && now > end) {
        return {
            status: 'ended',
            label: 'Closed',
            color: '#64748B',
            bg: '#F1F5F9',
        };
    }

    return {
        status: 'active',
        label: 'Live',
        color: '#10B981',
        bg: '#D1FAE5',
    };
}

/**
 * Calculate percentage of votes for an option
 */
export function calculatePercentage(votes: number, totalVotes: number): number {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
}

/**
 * Check if poll is currently active
 */
export function isPollActive(
    startDate?: string | Date | null,
    endDate?: string | Date | null
): boolean {
    const status = getPollStatus(startDate, endDate);
    return status.status === 'active';
}

/**
 * Format date for display
 */
export function formatPollDate(
    date: string | Date,
    includeTime = true
): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        ...(includeTime && {
            hour: 'numeric',
            minute: '2-digit',
        }),
    };
    return d.toLocaleDateString('en-US', options);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
}

/**
 * Validate poll creation data
 */
export interface PollValidationResult {
    isValid: boolean;
    error?: string;
}

export function validatePollData(
    question: string,
    options: string[],
    startDate?: Date,
    endDate?: Date
): PollValidationResult {
    if (!question.trim()) {
        return { isValid: false, error: 'Please enter a question' };
    }

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
        return { isValid: false, error: 'Please add at least 2 options' };
    }

    if (startDate && endDate && startDate >= endDate) {
        return { isValid: false, error: 'End date must be after start date' };
    }

    return { isValid: true };
}

/**
 * Format share message for a poll
 */
export function formatShareMessage(question: string, options: string[]): string {
    const optionsList = options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
    return `📊 ${question}\n\n${optionsList}\n\nVote now on Vunes Poll!`;
}
