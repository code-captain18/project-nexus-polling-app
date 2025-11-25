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
import { DateTimePickerButton, PageHeader, PrimaryButton } from "../components";
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
            <PageHeader
                title="New Poll"
                subtitle="Create and share your poll"
                showBack
                backText="Cancel"
            />

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
                    <DateTimePickerButton
                        label="START DATE & TIME"
                        value={startDate}
                        onPress={() => {
                            setStartTimeMode('date');
                            setShowStartPicker(true);
                        }}
                        onClear={() => setStartDate(undefined)}
                        placeholder="Starts immediately"
                        iconName="calendar-outline"
                        color="#10B981"
                        bgColor="#D1FAE5"
                        borderColor="#10B981"
                    />

                    {/* End Date & Time */}
                    <DateTimePickerButton
                        label="END DATE & TIME"
                        value={endDate}
                        onPress={() => {
                            setEndTimeMode('date');
                            setShowEndPicker(true);
                        }}
                        onClear={() => setEndDate(undefined)}
                        placeholder="No end date"
                        iconName="time-outline"
                        color="#F59E0B"
                        bgColor="#FEF3C7"
                        borderColor="#F59E0B"
                    />

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
                <PrimaryButton
                    onPress={handleCreatePoll}
                    disabled={!canSubmit}
                    loading={loading}
                    title="Create Poll"
                    loadingTitle="Creating..."
                />
            </View>
        </KeyboardAvoidingView>
    );
}
