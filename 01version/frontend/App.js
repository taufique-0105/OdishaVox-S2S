import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Text } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "./components/Header";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./components/Home";
import TTSPlayer from "./components/TTSPlayer";
import STTConverter from "./components/STTConverter";
import Feedback from "./components/Feedback";
import STSConverter from "./components/STSConverter";
import Settings from "./components/Settings";
import { ThemeProvider } from "./context/ThemeContext";
import { NetworkProvider } from "./context/NetworkContext";
import { SpeakerProvider } from "./context/SpeakerContext";
import OfflineNotice from "./components/OfflineNotice";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStackNavigator({ onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginPage {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function MainStackNavigator() {
  return (
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
        name="STS"
        component={STSConverter}
        options={{
          gestureDirection: "vertical",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.appContainer,
        {
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        {isLoggedIn ? (
          <Drawer.Navigator
            initialRouteName="Main"
            screenOptions={{
              drawerPosition: "right",
              drawerStyle: {
                backgroundColor: "#073d5c",
                width: 240,
              },
              drawerActiveTintColor: "#fff",
              drawerInactiveTintColor: "#ccc",
              drawerLabelStyle: {
                fontSize: 16,
              },
            }}
          >
            <Drawer.Screen
              name="Main"
              component={MainStackNavigator}
              options={{
                drawerLabel: "Home",
                headerShown: false,
              }}
            />
            <Drawer.Screen
              name="Profile"
              options={{
                header: ({ navigation }) => <Header navigation={navigation} />,
              }}
            >
              {(props) => <ProfilePage {...props} onLogout={handleLogout} />}
            </Drawer.Screen>
            <Drawer.Screen
              name="Feedback"
              component={Feedback}
              options={{
                presentation: "modal",
                header: ({ navigation }) => <Header navigation={navigation} />,
              }}
            />
            <Drawer.Screen
              name="Settings"
              component={Settings}
              options={{
                header: ({ navigation }) => <Header navigation={navigation} />,
              }}
            />
          </Drawer.Navigator>
        ) : (
          <AuthStackNavigator onLoginSuccess={handleLogin} />
        )}
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <OfflineNotice />
        <ThemeProvider>
          <SpeakerProvider>
            <MainApp />
          </SpeakerProvider>
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
