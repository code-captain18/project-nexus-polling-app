import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, Share, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { ChartTypeToggle, PageHeader, PrimaryButton, ResultsBreakdown, StatusBanner, VotingOption } from "../../components";
import "../../global.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { deletePollAsync, fetchPollByIdAsync, updatePollAsync, votePollAsync } from "../../store/thunks/pollThunks";

const screenWidth = Dimensions.get("window").width;

export default function PollDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
    const [isEditing, setIsEditing] = useState(false);
    const [editQuestion, setEditQuestion] = useState("");
    const [editOptions, setEditOptions] = useState<string[]>([]);

    const { polls, userVotes } = useAppSelector((state) => state.polls);
    const { user } = useAppSelector((state) => state.auth);
    const poll = polls.find(p => p.id === id);
    const userVote = userVotes.find(v => v.pollId === id);
    const hasVoted = !!userVote;
    const isCreator = user && poll && poll.createdBy === user.id;

    // Check poll status
    const now = new Date();
    const startDate = poll?.startDate ? new Date(poll.startDate) : null;
    const endDate = poll?.endDate ? new Date(poll.endDate) : null;

    const isPending = startDate && now < startDate;
    const isEnded = endDate && now > endDate;
    const isActive = !isPending && !isEnded;

    // Fetch poll data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (id && typeof id === 'string') {
                dispatch(fetchPollByIdAsync(id));
            }
        }, [id, dispatch])
    );

    // Auto-refresh poll data every 10 seconds when viewing results
    useEffect(() => {
        if (!isEditing && hasVoted && id && typeof id === 'string') {
            const interval = setInterval(() => {
                dispatch(fetchPollByIdAsync(id));
            }, 10000); // Refresh every 10 seconds

            return () => clearInterval(interval);
        }
    }, [id, dispatch, isEditing, hasVoted]);

    useEffect(() => {
        if (id && typeof id === 'string') {
            dispatch(fetchPollByIdAsync(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (poll) {
            setEditQuestion(poll.question);
            setEditOptions(poll.options.map(opt => opt.text));
        }
    }, [poll]);

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

    const handleDelete = async () => {
        Alert.alert(
            'Delete Poll',
            'Are you sure you want to delete this poll? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (typeof id === 'string') {
                                await dispatch(deletePollAsync(id)).unwrap();
                                Alert.alert('Success', 'Poll deleted successfully');
                                router.back();
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error || 'Failed to delete poll. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        if (poll) {
            setEditQuestion(poll.question);
            setEditOptions(poll.options.map(opt => opt.text));
        }
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!editQuestion.trim() || editOptions.filter(opt => opt.trim()).length < 2) {
            Alert.alert('Error', 'Please provide a question and at least 2 options');
            return;
        }

        try {
            setLoading(true);
            if (typeof id === 'string') {
                await dispatch(updatePollAsync({
                    id,
                    data: {
                        question: editQuestion.trim(),
                        options: editOptions.filter(opt => opt.trim()).map(opt => opt.trim())
                    }
                })).unwrap();
                Alert.alert('Success', 'Poll updated successfully');
                setIsEditing(false);
            }
        } catch (error: any) {
            Alert.alert('Error', error || 'Failed to update poll. Please try again.');
        } finally {
            setLoading(false);
        }
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
            <PageHeader
                title={poll.question}
                showBack
                rightElement={
                    <View className="flex-row items-center gap-2">
                        {isCreator && !isEditing && (
                            <>
                                <TouchableOpacity
                                    onPress={handleEdit}
                                    className="flex-row items-center px-3 py-2 rounded-lg"
                                    style={{ backgroundColor: '#DBEAFE' }}
                                >
                                    <Ionicons name="pencil-outline" size={20} color="#2563EB" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="flex-row items-center px-3 py-2 rounded-lg"
                                    style={{ backgroundColor: '#FEE2E2' }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </>
                        )}
                        {!isEditing && (
                            <TouchableOpacity
                                onPress={handleShare}
                                className="flex-row items-center px-3 py-2 rounded-lg"
                                style={{ backgroundColor: '#2563EB20' }}
                            >
                                <Ionicons name="share-social-outline" size={20} color="#60A5FA" />
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                {/* Edit Mode */}
                {isEditing ? (
                    <View>
                        <Text className="text-sm font-bold mb-3" style={{ color: '#1E293B' }}>
                            Edit Poll Question
                        </Text>
                        <TextInput
                            value={editQuestion}
                            onChangeText={setEditQuestion}
                            placeholder="What would you like to ask?"
                            placeholderTextColor="#94A3B8"
                            className="rounded-2xl p-4 text-base mb-4"
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: editQuestion ? '#2563EB' : '#E2E8F0',
                                color: '#1E293B',
                                minHeight: 100,
                                textAlignVertical: 'top'
                            }}
                            multiline
                            maxLength={200}
                        />

                        <Text className="text-sm font-bold mb-3" style={{ color: '#1E293B' }}>
                            Edit Options
                        </Text>
                        {editOptions.map((option, index) => (
                            <View key={index} className="mb-3">
                                <TextInput
                                    value={option}
                                    onChangeText={(text) => {
                                        const newOptions = [...editOptions];
                                        newOptions[index] = text;
                                        setEditOptions(newOptions);
                                    }}
                                    placeholder={`Option ${index + 1}`}
                                    placeholderTextColor="#94A3B8"
                                    className="rounded-2xl p-4 text-base"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        borderWidth: 2,
                                        borderColor: option ? '#2563EB' : '#E2E8F0',
                                        color: '#1E293B',
                                    }}
                                    maxLength={100}
                                />
                            </View>
                        ))}

                        <View className="flex-row gap-3 mt-6">
                            <View className="flex-1">
                                <TouchableOpacity
                                    onPress={handleCancelEdit}
                                    className="rounded-2xl py-4 items-center"
                                    style={{
                                        backgroundColor: '#F1F5F9',
                                        borderWidth: 2,
                                        borderColor: '#E2E8F0',
                                    }}
                                >
                                    <Text className="text-base font-bold" style={{ color: '#64748B' }}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="flex-1">
                                <PrimaryButton
                                    onPress={handleSaveEdit}
                                    loading={loading}
                                    title="Save Changes"
                                    loadingTitle="Saving..."
                                    icon="checkmark-circle"
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Poll Status Banner */}
                        {isPending && startDate && (
                            <StatusBanner
                                type="pending"
                                title="Poll Not Started Yet"
                                subtitle={`Starts ${startDate.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}`}
                            />
                        )}
                        {isEnded && endDate && (
                            <StatusBanner
                                type="ended"
                                title="Poll Has Ended"
                                subtitle={`Ended ${endDate.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}`}
                            />
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
                                    <VotingOption
                                        key={index}
                                        text={option.text}
                                        isSelected={selectedOption === index}
                                        onSelect={() => setSelectedOption(index)}
                                    />
                                ))}

                                {isActive && (
                                    <View className="mt-8">
                                        <PrimaryButton
                                            onPress={handleVote}
                                            disabled={selectedOption === null}
                                            loading={loading}
                                            title="Submit Vote"
                                            loadingTitle="Submitting..."
                                        />
                                    </View>
                                )}
                            </View>
                        ) : (
                            // Results View (for voted users OR inactive polls)
                            <View>
                                {hasVoted && isActive && (
                                    <StatusBanner
                                        type="voted"
                                        title="Thank you for voting! 🎉"
                                    />
                                )}

                                {/* Chart Type Toggle */}
                                <View className="flex-row justify-between items-center mb-5">
                                    <Text className="text-base font-bold" style={{ color: '#1E293B' }}>
                                        Results ({poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'})
                                    </Text>
                                    <ChartTypeToggle chartType={chartType} onToggle={setChartType} />
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

                                {poll.options.map((option, index) => (
                                    <ResultsBreakdown
                                        key={option.id}
                                        option={option}
                                        percentage={getPercentage(option.votes)}
                                        isSelected={userVote?.optionIndex === index}
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
