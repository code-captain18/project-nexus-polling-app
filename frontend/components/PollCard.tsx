import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import PollStatusBadge from "./PollStatusBadge";

interface PollCardProps {
    poll: {
        id: string;
        question: string;
        options: any[];
        totalVotes: number;
        startDate?: string;
        endDate?: string;
    };
    getPollStatus: (poll: any) => {
        status: 'pending' | 'active' | 'ended';
        label: string;
        color: string;
        bg: string;
    };
}

export default function PollCard({ poll, getPollStatus }: PollCardProps) {
    const pollStatus = getPollStatus(poll);

    return (
        <Link href={`/poll/${poll.id}` as any} asChild>
            <TouchableOpacity
                className="bg-white rounded-2xl p-6 mb-4"
                style={{
                    shadowColor: '#1E293B',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: '#E2E8F0'
                }}
            >
                <View className="flex-row items-start justify-between mb-3">
                    <Text className="text-lg font-bold text-secondary-dark flex-1 pr-3" style={{ lineHeight: 24 }}>
                        {poll.question}
                    </Text>
                    <PollStatusBadge {...pollStatus} />
                </View>

                <View className="flex-row items-center justify-between mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: '#EFF6FF' }}>
                            <Ionicons name="list-outline" size={16} color="#2563EB" />
                        </View>
                        <Text className="text-neutral text-sm font-medium">
                            {poll.options.length} options
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: '#DBEAFE' }}>
                            <Ionicons name="people-outline" size={16} color="#2563EB" />
                        </View>
                        <Text className="text-neutral-dark text-sm font-semibold">
                            {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
                        </Text>
                    </View>
                </View>

                {/* Time Info */}
                {(poll.startDate || poll.endDate) && (
                    <View className="mt-3 pt-3 flex-row items-center" style={{ borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                        <Ionicons name="time-outline" size={16} color="#64748B" />
                        <Text className="text-neutral-light text-xs ml-2 font-medium">
                            {pollStatus.status === 'pending' && poll.startDate &&
                                `Starts ${new Date(poll.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                            }
                            {pollStatus.status === 'active' && poll.endDate &&
                                `Ends ${new Date(poll.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                            }
                            {pollStatus.status === 'ended' && poll.endDate &&
                                `Ended ${new Date(poll.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            }
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </Link>
    );
}
