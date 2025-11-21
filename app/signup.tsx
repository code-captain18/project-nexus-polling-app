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
import { signUp } from "../store/slices/authSlice";

export default function SignUp() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = () => {
        // Validate inputs
        if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            alert("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        // Here you would typically create account with your backend
        // For now, simulate successful sign up
        dispatch(signUp({
            user: {
                id: Date.now().toString(),
                name: name,
                email: email,
            },
            token: "mock-token-" + Date.now(),
        }));

        // Navigate to home
        router.replace("/" as any);
    };

    const canSubmit =
        name.trim() !== "" &&
        email.trim() !== "" &&
        password.trim() !== "" &&
        confirmPassword.trim() !== "" &&
        password === confirmPassword &&
        password.length >= 6;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-secondary-dark"
        >
            {/* Header with Back Button */}
            <View className="px-6 pt-12 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="self-start"
                >
                    <Text className="text-primary text-base">← Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                <View className="px-6">
                    {/* Logo/Title Section */}
                    <View className="items-center mb-6">
                        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
                            <Text className="text-4xl">📊</Text>
                        </View>
                        <Text className="text-2xl font-bold text-background mb-1">
                            Create Account
                        </Text>
                        <Text className="text-primary-light text-sm">
                            Join the polling community
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-4">
                        {/* Name Input */}
                        <View className="mb-3">
                            <Text className="text-primary-light text-xs font-medium mb-1.5">
                                Full Name
                            </Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="John Doe"
                                placeholderTextColor="#a1a3ae"
                                autoCapitalize="words"
                                autoComplete="name"
                                className="bg-white/10 border-2 border-primary-light/30 rounded-xl p-3.5 text-background text-base"
                            />
                        </View>

                        {/* Email Input */}
                        <View className="mb-3">
                            <Text className="text-primary-light text-xs font-medium mb-1.5">
                                Email Address
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="your@email.com"
                                placeholderTextColor="#a1a3ae"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                className="bg-white/10 border-2 border-primary-light/30 rounded-xl p-3.5 text-background text-base"
                            />
                        </View>

                        {/* Password Input */}
                        <View className="mb-3">
                            <Text className="text-primary-light text-xs font-medium mb-1.5">
                                Password
                            </Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="At least 6 characters"
                                placeholderTextColor="#a1a3ae"
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password-new"
                                className="bg-white/10 border-2 border-primary-light/30 rounded-xl p-3.5 text-background text-base"
                            />
                        </View>

                        {/* Confirm Password Input */}
                        <View className="mb-4">
                            <Text className="text-primary-light text-xs font-medium mb-1.5">
                                Confirm Password
                            </Text>
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Re-enter your password"
                                placeholderTextColor="#a1a3ae"
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="password-new"
                                className="bg-white/10 border-2 border-primary-light/30 rounded-xl p-3.5 text-background text-base"
                            />
                            {confirmPassword !== "" && password !== confirmPassword && (
                                <Text className="text-red-400 text-xs mt-1">
                                    Passwords do not match
                                </Text>
                            )}
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={!canSubmit}
                            className={`rounded-full py-3.5 items-center ${canSubmit ? "bg-primary" : "bg-neutral/30"
                                }`}
                        >
                            <Text className="text-white text-base font-semibold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-px bg-primary-light/30" />
                            <Text className="text-neutral mx-3 text-xs">OR</Text>
                            <View className="flex-1 h-px bg-primary-light/30" />
                        </View>

                        {/* Social Sign Up */}
                        <TouchableOpacity className="border-2 border-primary-light/30 rounded-full py-3 items-center mb-2">
                            <Text className="text-background text-sm font-medium">
                                Continue with Google
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="border-2 border-primary-light/30 rounded-full py-3 items-center">
                            <Text className="text-background text-sm font-medium">
                                Continue with Apple
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center items-center mt-3">
                        <Text className="text-primary-light text-sm">
                            Already have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => router.push("/signin" as any)}>
                            <Text className="text-primary text-sm font-semibold">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Terms */}
                    <Text className="text-neutral text-xs text-center mt-3 mb-4">
                        By signing up, you agree to our{" "}
                        <Text className="text-primary-light">Terms of Service</Text> and{" "}
                        <Text className="text-primary-light">Privacy Policy</Text>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
