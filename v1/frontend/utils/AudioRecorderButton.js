import React, { useState, useEffect } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import * as FileSystem from "expo-file-system"; // Keep this if you need file system access within the button for some reason, otherwise can remove

const AudioRecorderButton = ({ onRecordingComplete, onRecordingStart }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For internal button loading, e.g., during permission request

  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    extension: ".wav",
    outputFormat: "wav",
    audioQuality: "high",
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  };

  const audioRecorder = useAudioRecorder(recordingOptions);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        setIsLoading(true);
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required for recording audio."
          );
        }
      } catch (error) {
        console.error("Permission error:", error);
        Alert.alert("Error", "Failed to request microphone permission.");
      } finally {
        setIsLoading(false);
      }
    };

    requestPermission();

    return () => {
      // Ensure recording stops if component unmounts while recording
      if (isRecording) {
        audioRecorder.stop();
        setIsRecording(false);
      }
    };
  }, [isRecording]); // Re-run effect if isRecording changes to handle cleanup

  const record = async () => {
    if (isRecording) {
      Alert.alert(
        "Already recording",
        "Please stop the current recording first."
      );
      return;
    }

    if (hasPermission === false) {
      Alert.alert(
        "Permission Required",
        "Please grant microphone permission in your device settings to record."
      );
      return;
    }

    try {
      // Notify parent component that recording has started (optional)
      if (onRecordingStart) {
        onRecordingStart();
      }
      setIsLoading(true); // Indicate busy state for the button
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to start recording"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsLoading(true); // Indicate busy state for the button
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        throw new Error("No audio file was recorded.");
      }

      setIsRecording(false);
      // Pass the recorded URI back to the parent component
      if (onRecordingComplete) {
        onRecordingComplete(uri);
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to stop recording"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      record();
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.recordButton,
        isRecording && styles.recordingButton,
        pressed && styles.buttonPressed,
        hasPermission === false && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={hasPermission === false || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Ionicons name={isRecording ? "stop" : "mic"} size={32} color="white" />
      )}
      <Text style={styles.recordButtonText}>
        {isLoading
          ? "..."
          : isRecording
          ? "Stop Recording"
          : "Start Recording"}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  recordButton: {
    backgroundColor: "#4263eb",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  recordingButton: {
    backgroundColor: "#f03e3e",
  },
  recordButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
});

export default AudioRecorderButton;