import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import "../../global.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPollByIdAsync, votePollAsync } from "../../store/thunks/pollThunks";

const screenWidth = Dimensions.get("window").width;

export default function PollDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

    const { polls, userVotes } = useAppSelector((state) => state.polls);
    const poll = polls.find(p => p.id === id);
    const userVote = userVotes.find(v => v.pollId === id);
    const hasVoted = !!userVote;

    // Check poll status
    const now = new Date();
    const startDate = poll?.startDate ? new Date(poll.startDate) : null;
    const endDate = poll?.endDate ? new Date(poll.endDate) : null;

    const isPending = startDate && now < startDate;
    const isEnded = endDate && now > endDate;
    const isActive = !isPending && !isEnded;

    useEffect(() => {
        if (id && typeof id === 'string') {
            dispatch(fetchPollByIdAsync(id));
        }
    }, [id, dispatch]);

    if (!poll) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-neutral text-lg">Poll not found</Text>
            </View>
        );
    }

    const handleVote = async () => {
        if (selectedOption !== null && poll && typeof id === 'string') {
            try {
                setLoading(true);
                const optionId = poll.options[selectedOption].id;
                await dispatch(votePollAsync({ pollId: id, optionId })).unwrap();
            } catch (error: any) {
                alert(error || "Failed to submit vote. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    const getPercentage = (votes: number) => {
        if (poll.totalVotes === 0) return 0;
        return Math.round((votes / poll.totalVotes) * 100);
    };

    const handleShare = async () => {
        try {
            const shareMessage = `📊 ${poll.question}\n\n${poll.options.map((opt, i) => `${i + 1}. ${opt.text}`).join('\n')}\n\nVote now on Vunes Poll!`;

            const result = await Share.share({
                message: shareMessage,
                title: poll.question,
            }, {
                dialogTitle: 'Share Poll',
                subject: poll.question, // For email on iOS
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Poll shared successfully');
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to share poll. Please try again.');
            console.error('Share error:', error);
        }
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="pt-12 pb-6 px-6" style={{ backgroundColor: '#1E293B' }}>
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
                        <Ionicons name="arrow-back" size={24} color="#60A5FA" />
                        <Text className="text-base font-semibold ml-2" style={{ color: '#60A5FA' }}>Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} className="flex-row items-center px-3 py-2 rounded-lg" style={{ backgroundColor: '#2563EB20' }}>
                        <Ionicons name="share-social-outline" size={20} color="#60A5FA" />
                        <Text className="text-sm font-semibold ml-1.5" style={{ color: '#60A5FA' }}>Share</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-2xl font-bold text-white leading-tight">
                    {poll.question}
                </Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                {/* Poll Status Banner */}
                {(isPending || isEnded) && (
                    <View className="mb-5 p-4 rounded-2xl" style={{
                        backgroundColor: isPending ? '#FEF3C7' : '#F1F5F9',
                        borderWidth: 1,
                        borderColor: isPending ? '#FDE68A' : '#E2E8F0'
                    }}>
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: isPending ? '#F59E0B20' : '#64748B20' }}>
                                <Ionicons
                                    name={isPending ? "time-outline" : "lock-closed-outline"}
                                    size={22}
                                    color={isPending ? "#F59E0B" : "#64748B"}
                                />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="font-bold text-base" style={{ color: isPending ? '#92400E' : '#475569' }}>
                                    {isPending ? 'Poll Not Started Yet' : 'Poll Has Ended'}
                                </Text>
                                <Text className="text-sm mt-0.5" style={{ color: isPending ? '#78350F' : '#64748B' }}>
                                    {isPending && startDate && `Starts ${startDate.toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}`}
                                    {isEnded && endDate && `Ended ${endDate.toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Active Poll Time Info */}
                {isActive && (startDate || endDate) && (
                    <View className="mb-5 p-4 rounded-2xl flex-row items-center justify-between" style={{
                        backgroundColor: '#DBEAFE',
                        borderWidth: 1,
                        borderColor: '#93C5FD'
                    }}>
                        {startDate && (
                            <View className="flex-1">
                                <Text className="text-xs font-semibold" style={{ color: '#1E40AF' }}>STARTED</Text>
                                <Text className="text-sm font-bold mt-0.5" style={{ color: '#1E293B' }}>
                                    {startDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </View>
                        )}
                        {endDate && (
                            <View className="flex-1 items-end">
                                <Text className="text-xs font-semibold" style={{ color: '#1E40AF' }}>ENDS</Text>
                                <Text className="text-sm font-bold mt-0.5" style={{ color: '#2563EB' }}>
                                    {endDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {!hasVoted && isActive ? (
                    // Voting View
                    <View>
                        <Text className="text-base font-bold mb-4" style={{ color: '#1E293B' }}>
                            Cast Your Vote
                        </Text>
                        {poll.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedOption(index)}
                                className="mb-3 p-5 rounded-2xl"
                                style={{
                                    backgroundColor: selectedOption === index ? '#EFF6FF' : '#FFFFFF',
                                    borderWidth: 2,
                                    borderColor: selectedOption === index ? '#2563EB' : '#E2E8F0',
                                    shadowColor: selectedOption === index ? '#2563EB' : '#1E293B',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: selectedOption === index ? 0.15 : 0.05,
                                    shadowRadius: 8,
                                    elevation: selectedOption === index ? 3 : 1,
                                }}
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center mr-4"
                                        style={{
                                            backgroundColor: selectedOption === index ? '#2563EB' : '#FFFFFF',
                                            borderWidth: 2,
                                            borderColor: selectedOption === index ? '#2563EB' : '#CBD5E1',
                                        }}
                                    >
                                        {selectedOption === index && (
                                            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFFFFF' }} />
                                        )}
                                    </View>
                                    <Text
                                        className="text-base flex-1"
                                        style={{
                                            color: selectedOption === index ? '#1E293B' : '#64748B',
                                            fontWeight: selectedOption === index ? '700' : '500',
                                        }}
                                    >
                                        {option.text}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {isActive && (
                            <TouchableOpacity
                                onPress={handleVote}
                                disabled={selectedOption === null || loading}
                                className="mt-8 rounded-2xl py-4 items-center flex-row justify-center"
                                style={{
                                    backgroundColor: selectedOption !== null && !loading ? '#2563EB' : '#E2E8F0',
                                    shadowColor: '#2563EB',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: selectedOption !== null && !loading ? 0.3 : 0,
                                    shadowRadius: 8,
                                    elevation: selectedOption !== null && !loading ? 5 : 0,
                                }}
                            >
                                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                                <Text className="text-lg font-bold ml-2" style={{ color: '#FFFFFF' }}>
                                    {loading ? "Submitting..." : "Submit Vote"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    // Results View (for voted users OR inactive polls)
                    <View>
                        {hasVoted && isActive && (
                            <View className="p-4 rounded-2xl mb-6 flex-row items-center" style={{ backgroundColor: '#D1FAE5', borderWidth: 1, borderColor: '#6EE7B7' }}>
                                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#10B981' }}>
                                    <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                                </View>
                                <Text className="text-sm font-bold ml-3" style={{ color: '#065F46' }}>
                                    Thank you for voting! 🎉
                                </Text>
                            </View>
                        )}
                        {(isPending || isEnded) && (
                            <View className="p-4 rounded-2xl mb-6" style={{ backgroundColor: '#F1F5F9' }}>
                                <Text className="text-sm font-semibold text-center" style={{ color: '#64748B' }}>
                                    {isPending && 'This poll has not started yet'}
                                    {isEnded && 'This poll has ended'}
                                </Text>
                            </View>
                        )}

                        {/* Chart Type Toggle */}
                        <View className="flex-row justify-between items-center mb-5">
                            <Text className="text-base font-bold" style={{ color: '#1E293B' }}>
                                Results ({poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'})
                            </Text>
                            <View className="flex-row rounded-xl p-1" style={{ backgroundColor: '#F1F5F9' }}>
                                <TouchableOpacity
                                    onPress={() => setChartType('bar')}
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
                                    onPress={() => setChartType('pie')}
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
                        </View>

                        {/* Chart Visualization */}
                        {poll.totalVotes > 0 && (
                            <View className="mb-6 rounded-2xl p-4" style={{
                                backgroundColor: '#FFFFFF',
                                shadowColor: '#1E293B',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.08,
                                shadowRadius: 12,
                                elevation: 3,
                                borderWidth: 1,
                                borderColor: '#E2E8F0'
                            }}>
                                {chartType === 'bar' ? (
                                    <BarChart
                                        data={{
                                            labels: poll.options.map((opt, i) =>
                                                opt.text.length > 10 ? `${opt.text.substring(0, 10)}...` : opt.text
                                            ),
                                            datasets: [{
                                                data: poll.options.map(opt => opt.votes || 0.1),
                                            }]
                                        }}
                                        width={screenWidth - 90}
                                        height={220}
                                        yAxisLabel=""
                                        yAxisSuffix=""
                                        chartConfig={{
                                            backgroundColor: '#ffffff',
                                            backgroundGradientFrom: '#ffffff',
                                            backgroundGradientTo: '#ffffff',
                                            decimalPlaces: 0,
                                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                                            labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                            propsForBackgroundLines: {
                                                strokeDasharray: '',
                                                stroke: '#E2E8F0',
                                                strokeWidth: 1,
                                            },
                                            propsForLabels: {
                                                fontSize: 11,
                                                fontWeight: '600',
                                            }
                                        }}
                                        style={{
                                            borderRadius: 16,
                                        }}
                                        showBarTops={false}
                                        fromZero
                                    />
                                ) : (
                                    <PieChart
                                        data={poll.options.map((opt, index) => ({
                                            name: opt.text,
                                            population: opt.votes || 0,
                                            color: [
                                                '#2563EB',
                                                '#10B981',
                                                '#F59E0B',
                                                '#8B5CF6',
                                                '#EC4899',
                                                '#06B6D4'
                                            ][index % 6],
                                            legendFontColor: '#1E293B',
                                            legendFontSize: 12,
                                        }))}
                                        width={screenWidth - 90}
                                        height={220}
                                        chartConfig={{
                                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                                        }}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute
                                    />
                                )}
                            </View>
                        )}

                        {/* Detailed Results List */}
                        <Text className="text-base font-bold mb-4" style={{ color: '#1E293B' }}>
                            Detailed Breakdown
                        </Text>

                        {poll.options.map((option, index) => {
                            const percentage = getPercentage(option.votes);
                            const isSelected = userVote?.optionIndex === index;

                            return (
                                <View key={option.id} className="mb-5 p-4 rounded-2xl" style={{
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
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
