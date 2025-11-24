import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPollByIdAsync, votePollAsync } from "../../store/thunks/pollThunks";

export default function PollDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const { polls, userVotes } = useAppSelector((state) => state.polls);
    const poll = polls.find(p => p.id === id);
    const userVote = userVotes.find(v => v.pollId === id);
    const hasVoted = !!userVote;

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
            <View className="bg-secondary-dark pt-12 pb-6 px-6">
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-primary text-base">← Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} className="flex-row items-center">
                        <Ionicons name="share-social-outline" size={20} color="#0B6ECA" />
                        <Text className="text-primary text-sm font-medium ml-1">Share</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-2xl font-bold text-background">
                    {poll.question}
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {!hasVoted ? (
                    // Voting View
                    <View>
                        <Text className="text-neutral-dark text-sm mb-4 font-medium">
                            Select your answer:
                        </Text>
                        {poll.options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedOption(index)}
                                className={`mb-3 p-4 rounded-xl border-2 ${selectedOption === index
                                    ? "bg-primary/10 border-primary"
                                    : "bg-white border-primary-light/30"
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selectedOption === index
                                            ? "border-primary bg-primary"
                                            : "border-neutral"
                                            }`}
                                    >
                                        {selectedOption === index && (
                                            <View className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </View>
                                    <Text
                                        className={`text-base ${selectedOption === index
                                            ? "text-secondary-dark font-semibold"
                                            : "text-neutral-dark"
                                            }`}
                                    >
                                        {option.text}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={handleVote}
                            disabled={selectedOption === null || loading}
                            className={`mt-6 rounded-full py-4 items-center ${selectedOption !== null && !loading ? "bg-primary" : "bg-neutral/30"
                                }`}
                        >
                            <Text className="text-white text-lg font-semibold">
                                {loading ? "Submitting..." : "Submit Vote"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Results View
                    <View>
                        <View className="bg-primary/10 rounded-xl p-4 mb-6">
                            <Text className="text-secondary text-sm font-medium text-center">
                                Thank you for voting! 🎉
                            </Text>
                        </View>

                        <Text className="text-neutral-dark text-sm mb-4 font-medium">
                            Results ({poll.totalVotes} total votes):
                        </Text>

                        {poll.options.map((option, index) => {
                            const percentage = getPercentage(option.votes);
                            const isSelected = userVote?.optionIndex === index;

                            return (
                                <View key={option.id} className="mb-4">
                                    <View className="flex-row justify-between mb-2">
                                        <Text
                                            className={`text-base ${isSelected
                                                ? "text-secondary-dark font-semibold"
                                                : "text-neutral-dark"
                                                }`}
                                        >
                                            {option.text}
                                            {isSelected && " ✓"}
                                        </Text>
                                        <Text className="text-neutral-dark font-semibold">
                                            {percentage}%
                                        </Text>
                                    </View>
                                    <View className="h-3 bg-primary-light/30 rounded-full overflow-hidden">
                                        <View
                                            className={`h-full rounded-full ${isSelected ? "bg-primary" : "bg-primary-light"
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </View>
                                    <Text className="text-neutral text-xs mt-1">
                                        {option.votes} votes
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
