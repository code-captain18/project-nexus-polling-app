import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOut } from "../store/slices/authSlice";
import { logoutAsync } from "../store/thunks/authThunks";

export default function Profile() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const { polls, userVotes } = useAppSelector((state) => state.polls);

    const handleSignOut = async () => {
        await dispatch(logoutAsync());
        dispatch(signOut());
        router.push("/signin" as any);
    };

    // Calculate user stats from local data
    const userPolls = polls.filter(poll => poll.createdBy === user?.id);
    const votesCount = userVotes.length;

    if (!isAuthenticated) {
        return (
            <SafeAreaView className="flex-1 bg-background" edges={['top']}>
                {/* Header */}
                <View className="bg-secondary-dark pb-6 px-6">
                    <Text className="text-3xl font-bold text-background mb-2">
                        Profile
                    </Text>
                </View>

                {/* Sign In Prompt */}
                <View className="flex-1 items-center justify-center px-6">
                    <Ionicons name="person-circle-outline" size={80} color="#49657B" />
                    <Text className="text-xl font-semibold text-secondary-dark mt-4 mb-2">
                        Sign in to view your profile
                    </Text>
                    <Text className="text-neutral text-center mb-6">
                        Create and manage your polls
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/signin" as any)}
                        className="bg-primary rounded-full py-3 px-8"
                    >
                        <Text className="text-white text-base font-semibold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            {/* Header */}
            <View className="bg-secondary-dark pb-6 px-6">
                <Text className="text-3xl font-bold text-background mb-2">Profile</Text>
                <Text className="text-primary-light text-sm">
                    Manage your account and polls
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* User Info Card */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-primary-light/20">
                    <View className="items-center mb-4">
                        <View className="bg-primary/10 rounded-full p-4 mb-3">
                            <Ionicons name="person" size={40} color="#0B6ECA" />
                        </View>
                        <Text className="text-xl font-bold text-secondary-dark">
                            {user?.name || "User"}
                        </Text>
                        <Text className="text-neutral text-sm">{user?.email}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-primary-light/20">
                        <Text className="text-2xl font-bold text-primary mb-1">{userPolls.length}</Text>
                        <Text className="text-neutral text-sm">Polls Created</Text>
                    </View>
                    <View className="bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-primary-light/20">
                        <Text className="text-2xl font-bold text-primary mb-1">{votesCount}</Text>
                        <Text className="text-neutral text-sm">Votes Cast</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary-light/20 mb-6">
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-primary-light/20">
                        <Ionicons name="create-outline" size={24} color="#49657B" />
                        <Text className="flex-1 ml-3 text-secondary-dark font-medium">
                            My Polls
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#49657B" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4 border-b border-primary-light/20">
                        <Ionicons name="settings-outline" size={24} color="#49657B" />
                        <Text className="flex-1 ml-3 text-secondary-dark font-medium">
                            Settings
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#49657B" />
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center p-4">
                        <Ionicons name="help-circle-outline" size={24} color="#49657B" />
                        <Text className="flex-1 ml-3 text-secondary-dark font-medium">
                            Help & Support
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#49657B" />
                    </TouchableOpacity>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="bg-red-500 rounded-full py-4 items-center shadow-lg mb-6"
                >
                    <Text className="text-white text-base font-semibold">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
