import { Link, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../global.css";
import { useAppSelector } from "../store/hooks";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { polls } = useAppSelector((state) => state.polls);

  const handleCreatePoll = () => {
    if (!isAuthenticated) {
      router.push("/signin" as any);
    } else {
      router.push("/create" as any);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-secondary-dark pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-background mb-2">
          Online Polls
        </Text>
        <Text className="text-primary-light text-sm">
          Vote and see real-time results
        </Text>
      </View>

      {/* Poll List */}
      <ScrollView className="flex-1 px-6 pt-4">
        {polls.map((poll) => (
          <Link href={`/poll/${poll.id}` as any} key={poll.id} asChild>
            <TouchableOpacity className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-primary-light/20">
              <Text className="text-lg font-semibold text-secondary-dark mb-3">
                {poll.question}
              </Text>

              <View className="flex-row items-center justify-between">
                <Text className="text-neutral text-sm">
                  {poll.options.length} options
                </Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-primary mr-2" />
                  <Text className="text-neutral-dark text-sm font-medium">
                    {poll.totalVotes} votes
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      {/* Create Poll Button */}
      <View className="p-6 bg-background border-t border-primary-light/20">
        <TouchableOpacity
          onPress={handleCreatePoll}
          className="bg-primary rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-white text-lg font-semibold">
            + Create New Poll
          </Text>
        </TouchableOpacity>
        {!isAuthenticated && (
          <Text className="text-neutral text-xs text-center mt-2">
            Sign in required to create polls
          </Text>
        )}
      </View>
    </View>
  );
}
