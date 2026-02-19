import { Stack } from "expo-router";
import { WorkoutProvider } from "../context/WorkoutContext";

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack />
    </WorkoutProvider>
  );
}
