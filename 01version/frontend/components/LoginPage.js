import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
const LoginPage = ({ onLoginSuccess, navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ user: { name: "" } });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "WEB_CLIENT_ID_FROM_GOOGLE_CLOUD_CONSOLE.apps.googleusercontent.com", // From Google Cloud Console
      offlineAccess: false,
      hostedDomain: "",
      forceCodeForRefreshToken: false,
      accountName: "",
      iosClientId:
        "IOS_CLIENT_ID_FROM_GOOGLE_CLOUD_CONSOLE.apps.googleusercontent.com", // From Google Cloud Console
      googleServicePlistPath: "",
      openIdRealm: "",
      profileImageSize: 120,
    });
  }, []);

  const googleDataBackend = async (token) => {
    try {
      const API_URL = `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/google`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });

      const data = response.json();
      console.log(data);
    } catch (error) {}
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
      // You can now send the userInfo to your backend for authentication
      // console.log(userInfo);
      const {
        data: { idToken, user },
      } = userInfo;
      // console.log(idToken)
      onLoginSuccess();
      googleDataBackend(idToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const userData = { email, password };
      const LOGIN_URL = `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/login`;
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        setUserInfo(data.user);
        onLoginSuccess();
      }
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <GoogleSigninButton
        style={{ width: 192, height: 48, marginTop: 10 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />

      <TouchableOpacity>
        <Text
          style={{ color: "#4F46E5", fontSize: 16, marginTop: 20
           }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          New user? Register Here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    width: "100%",
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
  userInfo: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
});
