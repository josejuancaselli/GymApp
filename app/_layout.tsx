import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WorkoutProvider>
        <StatusBar style="dark" />
        <Stack />
      </WorkoutProvider>
    </GestureHandlerRootView>
  );
}
