import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const getPollStatus = (poll: any) => {
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
      {/* Header with Gradient */}
      <View className="pt-12 pb-8 px-6" style={{ backgroundColor: '#1E293B' }}>
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-4xl font-bold text-white mb-1">
              Polls
            </Text>
            <Text className="text-neutral-light text-base">
              Create, vote, and explore public opinion
            </Text>
          </View>
          <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: '#2563EB' }}>
            <Ionicons name="stats-chart" size={24} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Poll List */}
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center justify-center py-20">
            <View className="w-12 h-12 rounded-full mb-4" style={{ backgroundColor: '#DBEAFE' }}>
              <Ionicons name="hourglass-outline" size={24} color="#2563EB" style={{ marginTop: 10, marginLeft: 10 }} />
            </View>
            <Text className="text-neutral-dark font-medium">Loading polls...</Text>
          </View>
        ) : polls.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full mb-6 items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
              <Ionicons name="ballot-outline" size={40} color="#2563EB" />
            </View>
            <Text className="text-neutral-dark text-lg font-semibold mb-2">
              No polls yet
            </Text>
            <Text className="text-neutral text-sm text-center px-8">
              Be the first to create a poll and get the conversation started!
            </Text>
          </View>
        ) : (
          polls.map((poll) => {
            const pollStatus = getPollStatus(poll);

            return (
              <Link href={`/poll/${poll.id}` as any} key={poll.id} asChild>
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
                    <View
                      className="px-3 py-1.5 rounded-full flex-row items-center"
                      style={{ backgroundColor: pollStatus.bg }}
                    >
                      <View
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{ backgroundColor: pollStatus.color }}
                      />
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: pollStatus.color }}
                      >
                        {pollStatus.label}
                      </Text>
                    </View>
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
          })
        )}
      </ScrollView>

      {/* Create Poll Button */}
      <View className="px-5 py-5" style={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
        <TouchableOpacity
          onPress={handleCreatePoll}
          className="rounded-2xl py-4 items-center flex-row justify-center"
          style={{
            backgroundColor: '#2563EB',
            shadowColor: '#2563EB',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text className="text-white text-lg font-bold ml-2">
            Create New Poll
          </Text>
        </TouchableOpacity>
        {!isAuthenticated && (
          <Text className="text-neutral-light text-xs text-center mt-3">
            Sign in required to create polls
          </Text>
        )}
      </View>
    </View>
  );
}
