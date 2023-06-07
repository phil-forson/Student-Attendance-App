import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import "expo-dev-client";
import React from "react";
import { CourseProvider } from "./providers/CourseProvider";
import { ClassProvider } from "./providers/ClassProvider";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <CourseProvider>
          <ClassProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </ClassProvider>
        </CourseProvider>
      </SafeAreaProvider>
    );
  }
}
