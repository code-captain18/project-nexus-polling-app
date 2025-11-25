import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { EmptyState, LoadingState, PageHeader, PollCard, PrimaryButton } from "../components";
import "../global.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPollsAsync } from "../store/thunks/pollThunks";

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { polls, loading } = useAppSelector((state) => state.polls);

  useEffect(() => {
    dispatch(fetchPollsAsync());
  }, [dispatch]);

  const handleCreatePoll = () => {
    if (!isAuthenticated) {
      router.push("/signin" as any);
    } else {
      router.push("/create" as any);
    }
  };

  const getPollStatus = (poll: any): { status: 'pending' | 'active' | 'ended', label: string, color: string, bg: string } => {
    const now = new Date();
    const startDate = poll.startDate ? new Date(poll.startDate) : null;
    const endDate = poll.endDate ? new Date(poll.endDate) : null;

    if (startDate && now < startDate) {
      return { status: 'pending', label: 'Upcoming', color: '#F59E0B', bg: '#FEF3C7' };
    }
    if (endDate && now > endDate) {
      return { status: 'ended', label: 'Closed', color: '#64748B', bg: '#F1F5F9' };
    }
    return { status: 'active', label: 'Live', color: '#10B981', bg: '#D1FAE5' };
  };

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="Polls"
        subtitle="Create, vote, and explore public opinion"
        icon="stats-chart"
      />

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <LoadingState message="Loading polls..." />
        ) : polls.length === 0 ? (
          <EmptyState
            icon="list-outline"
            title="No polls yet"
            subtitle="Be the first to create a poll and get the conversation started!"
          />
        ) : (
          polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} getPollStatus={getPollStatus} />
          ))
        )}
      </ScrollView>

      {/* Create Poll Button */}
      <View className="px-5 py-5" style={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
        <PrimaryButton
          onPress={handleCreatePoll}
          title="Create New Poll"
          icon="add-circle-outline"
        />
        {!isAuthenticated && (
          <Text className="text-neutral-light text-xs text-center mt-3">
            Sign in required to create polls
          </Text>
        )}
      </View>
    </View>
  );
}
