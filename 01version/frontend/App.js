import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import TTSPlayer from "./components/TTSPlayer";
import STTConverter from "./components/STTConverter";
import Feedback from "./components/Feedback";
import STSConverter from "./components/STSConverter";
import { ThemeProvider } from "./context/ThemeContext";
import { NetworkProvider } from "./context/NetworkContext";
import OfflineNotice from "./components/OfflineNotice";

const Stack = createNativeStackNavigator();

function MainApp() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.appContainer,
        {
          // paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            header: ({ navigation }) => <Header navigation={navigation} />,
            contentStyle: { backgroundColor: "#fff" },
            animation: "fade",
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="TTS"
            component={TTSPlayer}
            options={{
              gestureDirection: "horizontal",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="STT"
            component={STTConverter}
            options={{
              gestureDirection: "horizontal",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="Feedback"
            component={Feedback}
            options={{
              presentation: "modal",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="STS"
            component={STSConverter}
            options={{
              gestureDirection: "vertical",
              headerShown: true,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Footer /> */}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <OfflineNotice />
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
