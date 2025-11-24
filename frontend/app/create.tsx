import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { createPollAsync } from "../store/thunks/pollThunks";

export default function CreatePoll() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [loading, setLoading] = useState(false);

    // Date/Time states
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [startTimeMode, setStartTimeMode] = useState<'date' | 'time'>('date');
    const [endTimeMode, setEndTimeMode] = useState<'date' | 'time'>('date');

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

    const handleCreatePoll = async () => {
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

        // Validate dates
        if (startDate && endDate && startDate >= endDate) {
            alert("End date must be after start date");
            return;
        }

        try {
            setLoading(true);
            await dispatch(createPollAsync({
                question: question.trim(),
                options: validOptions.map(opt => opt.trim()),
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
            })).unwrap();

            // Reset form
            setQuestion("");
            setOptions(["", ""]);
            setStartDate(undefined);
            setEndDate(undefined);
            setStartTimeMode('date');
            setEndTimeMode('date');

            // Navigate back to home on success
            router.back();
        } catch (error: any) {
            alert(error || "Failed to create poll. Please try again.");
        } finally {
            setLoading(false);
        }
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
            <View className="pt-12 pb-6 px-6" style={{ backgroundColor: '#1E293B' }}>
                <TouchableOpacity onPress={() => router.back()} className="mb-4 flex-row items-center">
                    <Ionicons name="arrow-back" size={24} color="#60A5FA" />
                    <Text className="text-base font-semibold ml-2" style={{ color: '#60A5FA' }}>Cancel</Text>
                </TouchableOpacity>
                <Text className="text-3xl font-bold text-white mb-1">
                    New Poll
                </Text>
                <Text className="text-base" style={{ color: '#CBD5E1' }}>
                    Create and share your poll
                </Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
                {/* Question Input */}
                <View className="mb-6">
                    <Text className="text-sm font-bold mb-3" style={{ color: '#1E293B' }}>
                        Poll Question *
                    </Text>
                    <TextInput
                        value={question}
                        onChangeText={setQuestion}
                        placeholder="What would you like to ask?"
                        placeholderTextColor="#94A3B8"
                        className="rounded-2xl p-4 text-base"
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderWidth: 2,
                            borderColor: question ? '#2563EB' : '#E2E8F0',
                            color: '#1E293B',
                            minHeight: 100,
                            textAlignVertical: 'top'
                        }}
                        multiline
                        maxLength={200}
                    />
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-xs font-medium" style={{ color: '#64748B' }}>
                            Be clear and concise
                        </Text>
                        <Text className="text-xs font-semibold" style={{ color: question.length > 180 ? '#EF4444' : '#64748B' }}>
                            {question.length}/200
                        </Text>
                    </View>
                </View>

                {/* Options */}
                <View className="mb-6">
                    <Text className="text-sm font-bold mb-3" style={{ color: '#1E293B' }}>
                        Answer Options *
                    </Text>

                    {options.map((option, index) => (
                        <View key={index} className="mb-3 flex-row items-center">
                            <View className="flex-1 mr-2">
                                <TextInput
                                    value={option}
                                    onChangeText={(text) => updateOption(index, text)}
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
                            {options.length > 2 && (
                                <TouchableOpacity
                                    onPress={() => removeOption(index)}
                                    className="w-11 h-11 rounded-2xl items-center justify-center"
                                    style={{ backgroundColor: '#FEE2E2' }}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {options.length < 6 && (
                        <TouchableOpacity
                            onPress={addOption}
                            className="rounded-2xl p-4 items-center flex-row justify-center"
                            style={{
                                borderWidth: 2,
                                borderStyle: 'dashed',
                                borderColor: '#2563EB',
                                backgroundColor: '#EFF6FF',
                            }}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#2563EB" />
                            <Text className="text-base font-bold ml-2" style={{ color: '#2563EB' }}>
                                Add Option
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Text className="text-xs font-medium mt-2" style={{ color: '#64748B' }}>
                        Add 2-6 answer options for voters to choose from
                    </Text>
                </View>

                {/* Date & Time Section */}
                <View className="mb-6">
                    <Text className="text-sm font-bold mb-3" style={{ color: '#1E293B' }}>
                        Schedule (Optional)
                    </Text>

                    {/* Start Date & Time */}
                    <View className="mb-4">
                        <Text className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>START DATE & TIME</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setStartTimeMode('date');
                                setShowStartPicker(true);
                            }}
                            className="rounded-2xl p-4 flex-row items-center justify-between"
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: startDate ? '#10B981' : '#E2E8F0',
                            }}
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: startDate ? '#D1FAE5' : '#EFF6FF' }}>
                                    <Ionicons name="calendar-outline" size={22} color={startDate ? '#10B981' : '#2563EB'} />
                                </View>
                                <Text className="ml-3 text-base font-semibold" style={{ color: startDate ? '#1E293B' : '#64748B' }}>
                                    {startDate
                                        ? startDate.toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })
                                        : 'Starts immediately'}
                                </Text>
                            </View>
                            {startDate && (
                                <TouchableOpacity
                                    onPress={() => setStartDate(undefined)}
                                    className="w-8 h-8 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: '#FEE2E2' }}
                                >
                                    <Ionicons name="close" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* End Date & Time */}
                    <View className="mb-2">
                        <Text className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>END DATE & TIME</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setEndTimeMode('date');
                                setShowEndPicker(true);
                            }}
                            className="rounded-2xl p-4 flex-row items-center justify-between"
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderWidth: 2,
                                borderColor: endDate ? '#F59E0B' : '#E2E8F0',
                            }}
                        >
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: endDate ? '#FEF3C7' : '#EFF6FF' }}>
                                    <Ionicons name="time-outline" size={22} color={endDate ? '#F59E0B' : '#2563EB'} />
                                </View>
                                <Text className="ml-3 text-base font-semibold" style={{ color: endDate ? '#1E293B' : '#64748B' }}>
                                    {endDate
                                        ? endDate.toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })
                                        : 'No end date'}
                                </Text>
                            </View>
                            {endDate && (
                                <TouchableOpacity
                                    onPress={() => setEndDate(undefined)}
                                    className="w-8 h-8 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: '#FEE2E2' }}
                                >
                                    <Ionicons name="close" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Date Pickers */}
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate || new Date()}
                            mode={Platform.OS === 'ios' ? 'datetime' : startTimeMode}
                            display="default"
                            onChange={(event: any, selectedDate?: Date) => {
                                if (Platform.OS === 'android') {
                                    setShowStartPicker(false);
                                }

                                if (event.type === 'set' && selectedDate) {
                                    if (Platform.OS === 'ios') {
                                        // iOS datetime picker - set both at once
                                        setStartDate(new Date(selectedDate));
                                        setShowStartPicker(false);
                                    } else {
                                        // Android - two-step process
                                        if (startTimeMode === 'date') {
                                            // After date selection, show time picker
                                            const existingDate = startDate || new Date();
                                            const newDate = new Date(
                                                selectedDate.getFullYear(),
                                                selectedDate.getMonth(),
                                                selectedDate.getDate(),
                                                existingDate.getHours(),
                                                existingDate.getMinutes()
                                            );
                                            setStartDate(newDate);
                                            setStartTimeMode('time');
                                            setShowStartPicker(true);
                                        } else {
                                            // Time selected
                                            const existingDate = startDate || new Date();
                                            const newDate = new Date(
                                                existingDate.getFullYear(),
                                                existingDate.getMonth(),
                                                existingDate.getDate(),
                                                selectedDate.getHours(),
                                                selectedDate.getMinutes()
                                            );
                                            setStartDate(newDate);
                                            setShowStartPicker(false);
                                            setStartTimeMode('date');
                                        }
                                    }
                                } else {
                                    setShowStartPicker(false);
                                    setStartTimeMode('date');
                                }
                            }}
                            minimumDate={new Date()}
                        />
                    )}

                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate || startDate || new Date()}
                            mode={Platform.OS === 'ios' ? 'datetime' : endTimeMode}
                            display="default"
                            onChange={(event: any, selectedDate?: Date) => {
                                if (Platform.OS === 'android') {
                                    setShowEndPicker(false);
                                }

                                if (event.type === 'set' && selectedDate) {
                                    if (Platform.OS === 'ios') {
                                        // iOS datetime picker - set both at once
                                        setEndDate(new Date(selectedDate));
                                        setShowEndPicker(false);
                                    } else {
                                        // Android - two-step process
                                        if (endTimeMode === 'date') {
                                            // After date selection, show time picker
                                            const existingDate = endDate || new Date();
                                            const newDate = new Date(
                                                selectedDate.getFullYear(),
                                                selectedDate.getMonth(),
                                                selectedDate.getDate(),
                                                existingDate.getHours(),
                                                existingDate.getMinutes()
                                            );
                                            setEndDate(newDate);
                                            setEndTimeMode('time');
                                            setShowEndPicker(true);
                                        } else {
                                            // Time selected
                                            const existingDate = endDate || new Date();
                                            const newDate = new Date(
                                                existingDate.getFullYear(),
                                                existingDate.getMonth(),
                                                existingDate.getDate(),
                                                selectedDate.getHours(),
                                                selectedDate.getMinutes()
                                            );
                                            setEndDate(newDate);
                                            setShowEndPicker(false);
                                            setEndTimeMode('date');
                                        }
                                    }
                                } else {
                                    setShowEndPicker(false);
                                    setEndTimeMode('date');
                                }
                            }}
                            minimumDate={startDate || new Date()}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Create Button */}
            <View className="px-5 py-5" style={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' }}>
                <TouchableOpacity
                    onPress={handleCreatePoll}
                    disabled={!canSubmit || loading}
                    className="rounded-2xl py-4 items-center flex-row justify-center"
                    style={{
                        backgroundColor: canSubmit && !loading ? '#2563EB' : '#E2E8F0',
                        shadowColor: '#2563EB',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: canSubmit && !loading ? 0.3 : 0,
                        shadowRadius: 8,
                        elevation: canSubmit && !loading ? 5 : 0,
                    }}
                >
                    {loading ? (
                        <>
                            <Ionicons name="hourglass-outline" size={24} color="#FFFFFF" />
                            <Text className="text-lg font-bold ml-2" style={{ color: '#FFFFFF' }}>
                                Creating...
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={24} color={canSubmit ? '#FFFFFF' : '#94A3B8'} />
                            <Text className="text-lg font-bold ml-2" style={{ color: canSubmit ? '#FFFFFF' : '#94A3B8' }}>
                                Create Poll
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
