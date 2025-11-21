import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import "../global.css";
import { useAppDispatch } from "../store/hooks";
import { addPoll } from "../store/slices/pollsSlice";

export default function CreatePoll() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, ""]);
        }
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleCreatePoll = () => {
        // Validate inputs
        if (!question.trim()) {
            alert("Please enter a question");
            return;
        }

        const validOptions = options.filter((opt) => opt.trim() !== "");
        if (validOptions.length < 2) {
            alert("Please add at least 2 options");
            return;
        }

        // Create new poll and add to Redux store
        const newPoll = {
            id: Date.now().toString(),
            question: question.trim(),
            options: validOptions,
            votes: new Array(validOptions.length).fill(0),
            totalVotes: 0,
            createdAt: new Date().toISOString(),
        };

        dispatch(addPoll(newPoll));

        // Navigate back to home
        router.back();
    };

    const canSubmit =
        question.trim() !== "" &&
        options.filter((opt) => opt.trim() !== "").length >= 2;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
        >
            {/* Header */}
            <View className="bg-secondary-dark pt-12 pb-6 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-4">
                    <Text className="text-primary text-base">← Cancel</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-background">
                    Create New Poll
                </Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Question Input */}
                <View className="mb-6">
                    <Text className="text-neutral-dark text-sm font-medium mb-2">
                        Poll Question
                    </Text>
                    <TextInput
                        value={question}
                        onChangeText={setQuestion}
                        placeholder="What would you like to ask?"
                        placeholderTextColor="#a1a3ae"
                        className="bg-white border-2 border-primary-light/30 rounded-xl p-4 text-secondary-dark text-base"
                        multiline
                        maxLength={200}
                    />
                    <Text className="text-neutral text-xs mt-1 text-right">
                        {question.length}/200
                    </Text>
                </View>

                {/* Options */}
                <View className="mb-6">
                    <Text className="text-neutral-dark text-sm font-medium mb-2">
                        Answer Options
                    </Text>

                    {options.map((option, index) => (
                        <View key={index} className="mb-3 flex-row items-center">
                            <View className="flex-1 mr-2">
                                <TextInput
                                    value={option}
                                    onChangeText={(text) => updateOption(index, text)}
                                    placeholder={`Option ${index + 1}`}
                                    placeholderTextColor="#a1a3ae"
                                    className="bg-white border-2 border-primary-light/30 rounded-xl p-4 text-secondary-dark text-base"
                                    maxLength={100}
                                />
                            </View>
                            {options.length > 2 && (
                                <TouchableOpacity
                                    onPress={() => removeOption(index)}
                                    className="w-10 h-10 bg-neutral/20 rounded-full items-center justify-center"
                                >
                                    <Text className="text-neutral-dark text-lg">×</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {options.length < 6 && (
                        <TouchableOpacity
                            onPress={addOption}
                            className="border-2 border-dashed border-primary/40 rounded-xl p-4 items-center"
                        >
                            <Text className="text-primary text-base font-medium">
                                + Add Option
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Text className="text-neutral text-xs mt-2">
                        You can add up to 6 options
                    </Text>
                </View>
            </ScrollView>

            {/* Create Button */}
            <View className="p-6 bg-background border-t border-primary-light/20">
                <TouchableOpacity
                    onPress={handleCreatePoll}
                    disabled={!canSubmit}
                    className={`rounded-full py-4 items-center ${canSubmit ? "bg-primary" : "bg-neutral/30"
                        }`}
                >
                    <Text className="text-white text-lg font-semibold">
                        Create Poll
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
