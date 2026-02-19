import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WorkoutProvider>
        <Stack />
      </WorkoutProvider>
    </GestureHandlerRootView>
  );
}
