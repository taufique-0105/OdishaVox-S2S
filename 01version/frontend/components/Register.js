import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

const Register = ({ onLoginSuccess, navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const {
        data: { idToken, user },
      } = userInfo;
      // You can now send the userInfo to your backend for authentication
      console.log(userInfo);
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

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const userData = { name, email, password, confirmPassword };
      const REGISTER_URL = `${process.env.EXPO_PUBLIC_URL}/api/v1/auth/register`;
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
        navigation.navigate("Login");
      }
      onLoginSuccess();
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerText}>
          {loading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <GoogleSigninButton
        style={{ width: 192, height: 48, marginTop: 10 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Login");
        }}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#4F46E5", fontSize: 16 }}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

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
  registerButton: {
    width: "100%",
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  orText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#666",
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
