import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();

  const handleFieldFocus = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const handleFieldBlur = async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
      valid = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    const host = process.env.EXPO_PUBLIC_URL;
    const URI = `${host}/api/v1/feedback/submit`;
    if (!URI) {
      Alert.alert(
        "Error",
        "API URL is not defined. Please check your configuration."
      );
      return;
    }
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (validateForm()) {
        const response = await fetch(URI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-agent":
              "OdishaVoxApp/0.1.0 (Android/Linux; ARMv8; Android 10; Build/18-06-2025)",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit feedback");
        }

        Alert.alert(
          "Thank You!",
          result.message || "Feedback submitted successfully",
          [{ text: "OK", onPress: () => resetForm() }]
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit feedback. Please try again."
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rating: 0,
      message: "",
    });
    setErrors({});
  };

  const handleStarPress = async (rating) => {
    try {
      await Haptics.selectionAsync();
      handleChange("rating", rating);
    } catch (error) {
      console.log("Haptic error:", error);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={i <= formData.rating ? "star" : "star-outline"}
            size={32}
            color={i <= formData.rating ? "#FFD700" : "#ccc"}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={30} color="#000000ff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, styles.formContainer]}>
          <Text style={styles.title}>Share Your Feedback</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="your@email.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>How would you rate our app?</Text>
            <View style={styles.ratingContainer}>{renderStarRating()}</View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Feedback*</Text>
            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                errors.message && styles.errorInput,
              ]}
              placeholder="Tell us what you think..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={formData.message}
              onChangeText={(text) => handleChange("message", text)}
              onFocus={handleFieldFocus}
              onBlur={handleFieldBlur}
            />
            {errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    // paddingTop: 40,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 26,
    paddingVertical: 12,
    backgroundColor: "#f9fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    // marginBottom: 16,
    // elevation: 3,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e5ec",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  formContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderColor: "#ddd",
    color: "#333",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 5,
  },
  errorInput: {
    borderColor: "#ff4444",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Feedback;
