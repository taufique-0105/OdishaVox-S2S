import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const redirect = AuthSession.makeRedirectUri({ 
    useProxy: true,
    scheme: "bharatvox",
    path: "auth"
  });
  const [request, response, promptAsync] = Google.useAuthRequest({
    // IMPORTANT: Replace "YOUR_IOS_CLIENT_ID", "YOUR_ANDROID_CLIENT_ID", and "YOUR_WEB_CLIENT_ID"
    // in 01version/frontend/.env with your actual Google OAuth client IDs.
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri: redirect,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      if (token) {
        console.log("Google Access Token:", token);
        setGoogleToken(token); // Store the token
        sendTokenToBackend(token);
      } else {
        console.error("No access token in response");
      }
    } else if (response?.type === "error") {
      console.error("Google Auth Error:", response.error);
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    console.log(
      "Redirect URI:",
      AuthSession.makeRedirectUri({ useProxy: false })
    );
  }, []);

  const sendTokenToBackend = async (token) => {
    try {
      setLoading(true);
      const GOOGLE_AUTH_URL = `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/google`;
      const response = await fetch(GOOGLE_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed.");

      console.log("Google login success:", data);

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setUserInfo(data.user); // Assuming backend returns user info
      }
    } catch (error) {
      console.error("Google Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) {
      console.log("Auth request not ready");
      return;
    }
    try {
      setLoading(true);
      console.log("Initiating Google login prompt");
      await promptAsync();
      console.log("Google login prompt initiated"); 
    } catch (error) {
      console.error("Google Login Prompt Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Email:", email);
      console.log("Password:", password);
      const userData = { email, password };

      setLoading(true);
      const LOGIN_URL = `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/login`;
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed.");

      console.log("Email/Password login success:", data);

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setUserInfo(data.user); // Assuming backend returns user info
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.loginButton, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>OR</Text>

      {/* Google Login Button */}
      <TouchableOpacity
        style={[styles.googleButton, loading && { opacity: 0.6 }]}
        onPress={handleGoogleLogin}
        disabled={loading || !request}
      >
        <FontAwesome
          name="google"
          size={20}
          color="#DB4437"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {userInfo && <Text>Logged in as: {userInfo.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
  },
  googleText: {
    fontSize: 16,
    color: "#333",
  },
});
