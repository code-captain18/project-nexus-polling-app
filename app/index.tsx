import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { EmptyState, LoadingState, PageHeader, PollCard } from "../components";
import "../global.css";
import { useAuthRedirect } from "../hooks";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchPollsAsync } from "../store/thunks/pollThunks";
import { getPollStatus } from "../utils";

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuthRedirect();
  const { polls, loading } = useAppSelector((state) => state.polls);

  // Fetch polls when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        dispatch(fetchPollsAsync());
      }
    }, [dispatch, isAuthenticated])
  );

  return (
    <View className="flex-1 bg-secondary-dark">
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" translucent={false} />
      <PageHeader
        title="Polls"
        subtitle="Create, vote, and explore public opinion"
        icon="stats-chart"
      />

      <ScrollView className="flex-1 bg-background px-5 pt-6" showsVerticalScrollIndicator={false}>
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
            <PollCard
              key={poll.id}
              poll={poll}
              getPollStatus={() => getPollStatus(poll.startDate, poll.endDate)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
