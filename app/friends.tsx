import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PageHeader } from "../components";
import "../global.css";

export default function Friends() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View className="flex-1 bg-secondary-dark">
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" translucent={false} />
            <PageHeader
                title="Friends"
                subtitle="Connect and share polls with friends"
                icon="people"
            />

            {/* Search Bar */}
            <View className="bg-background px-5 pt-4 pb-2">
                <View className="flex-row items-center bg-white rounded-2xl px-4 py-3" style={{
                    shadowColor: '#1E293B',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                    borderWidth: 1,
                    borderColor: '#E2E8F0'
                }}>
                    <Ionicons name="search-outline" size={20} color="#64748B" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search friends..."
                        placeholderTextColor="#94A3B8"
                        className="flex-1 ml-3 text-base"
                        style={{ color: '#1E293B' }}
                    />
                </View>
            </View>

            {/* Friends List */}
            <ScrollView className="flex-1 bg-background px-5 pt-4" showsVerticalScrollIndicator={false}>
                {/* Empty State */}
                <View className="items-center justify-center py-20">
                    <View className="w-20 h-20 rounded-full mb-6 items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                        <Ionicons name="people-outline" size={40} color="#2563EB" />
                    </View>
                    <Text className="text-lg font-semibold mb-2" style={{ color: '#1E293B' }}>
                        No friends yet
                    </Text>
                    <Text className="text-sm text-center px-8" style={{ color: '#64748B' }}>
                        Start connecting with people to share and discuss polls together
                    </Text>
                </View>

                {/* Add Friend Button */}
                <View className="mt-6 mb-8">
                    <TouchableOpacity
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
                        <Ionicons name="person-add-outline" size={24} color="#FFFFFF" />
                        <Text className="text-lg font-bold ml-2" style={{ color: '#FFFFFF' }}>
                            Add Friends
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
