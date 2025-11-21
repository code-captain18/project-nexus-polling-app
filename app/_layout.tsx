import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../global.css";
import { store } from "../store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fdfdfe" },
        }}
      >
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="index" />
        <Stack.Screen name="poll/[id]" />
        <Stack.Screen name="create" />
      </Stack>
    </Provider>
  );
}
