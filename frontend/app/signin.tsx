import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_CONFIG } from "../config/api";
import "../global.css";
import { useAppDispatch } from "../store/hooks";
import { signInAsync } from "../store/thunks/authThunks";

// Email validation helper
const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

export default function SignIn() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    // Show API URL on component mount for debugging
    useEffect(() => {
        Alert.alert(
            'API Configuration',
            `Using: ${API_CONFIG.BASE_URL}`,
            [{ text: 'OK' }]
        );
    }, []);

    const handleSignIn = async () => {
        // Validate inputs
        if (!email.trim() || !password.trim()) {
            alert("Please fill in all fields");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            const result = await dispatch(signInAsync({ email, password })).unwrap();

            // Reset form fields
            setEmail("");
            setPassword("");
            setEmailTouched(false);

            // Navigate to home on success
            router.replace("/" as any);
        } catch (error: any) {
            alert(error || "Sign in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = email.trim() !== "" && password.trim() !== "" && isValidEmail(email);
    const showEmailError = emailTouched && email.trim() !== "" && !isValidEmail(email);

    return (
        <SafeAreaView className="flex-1 bg-secondary-dark" edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerClassName="flex-1"
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center px-6">
                        {/* Logo/Title Section */}
                        <View className="items-center mb-12">
                            <Image
                                source={require("../assets/images/vunes-logo.png")}
                                style={{ width: 80, height: 80, marginBottom: 16 }}
                                resizeMode="contain"
                            />
                            <Text className="text-3xl font-bold text-background mb-2">
                                Welcome Back
                            </Text>
                            <Text className="text-primary-light text-base">
                                Sign in to continue voting
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="mb-6">
                            {/* Email Input */}
                            <View className="mb-4">
                                <Text className="text-primary-light text-sm font-medium mb-2">
                                    Email Address
                                </Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    onBlur={() => setEmailTouched(true)}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#a1a3ae"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    style={{
                                        borderColor: showEmailError ? '#EF4444' : 'rgba(186, 230, 253, 0.3)',
                                    }}
                                    className="bg-white/10 border-2 rounded-xl p-4 text-background text-base"
                                />
                                {showEmailError && (
                                    <Text className="text-red-400 text-xs mt-1">
                                        Please enter a valid email address
                                    </Text>
                                )}
                            </View>

                            {/* Password Input */}
                            <View className="mb-2">
                                <Text className="text-primary-light text-sm font-medium mb-2">
                                    Password
                                </Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#a1a3ae"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoComplete="password"
                                    className="bg-white/10 border-2 border-primary-light/30 rounded-xl p-4 text-background text-base"
                                />
                            </View>

                            {/* Forgot Password Link */}
                            <TouchableOpacity className="self-end mb-6">
                                <Text className="text-primary text-sm">Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Sign In Button */}
                            <TouchableOpacity
                                onPress={handleSignIn}
                                disabled={!canSubmit || loading}
                                className={`rounded-full py-4 items-center mb-4 ${canSubmit && !loading ? "bg-primary" : "bg-neutral/30"
                                    }`}
                            >
                                <Text className="text-white text-lg font-semibold">
                                    {loading ? "Signing In..." : "Sign In"}
                                </Text>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View className="flex-row items-center my-6">
                                <View className="flex-1 h-px bg-primary-light/30" />
                                <Text className="text-neutral mx-4 text-sm">OR</Text>
                                <View className="flex-1 h-px bg-primary-light/30" />
                            </View>

                            {/* Social Sign In */}
                            <TouchableOpacity className="border-2 border-primary-light/30 rounded-full py-4 items-center mb-3">
                                <Text className="text-background text-base font-medium">
                                    Continue with Google
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="border-2 border-primary-light/30 rounded-full py-4 items-center">
                                <Text className="text-background text-base font-medium">
                                    Continue with Apple
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign Up Link */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-primary-light text-base">
                                Don't have an account?{" "}
                            </Text>
                            <TouchableOpacity onPress={() => router.push("/signup" as any)}>
                                <Text className="text-primary text-base font-semibold">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
