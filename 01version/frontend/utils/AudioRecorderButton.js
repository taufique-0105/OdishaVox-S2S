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
import {
  AudioModule,
  AudioQuality,
  IOSOutputFormat,
  RecordingPresets,
  useAudioRecorder,
} from "expo-audio";
import * as FileSystem from "expo-file-system";

const AudioRecorderButton = ({ onRecordingComplete, onRecordingStart }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recordingOptions = {
    ...RecordingPresets.HIGH_QUALITY,
    extension: ".m4a",
    ios: {
      outputFormat: IOSOutputFormat.MPEG4AAC,
    },
    android: {
      outputFormat: "mpeg4",
      audioEncoder: "aac",
    },
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    },
  };

  const audioRecorder = useAudioRecorder(recordingOptions);

  useEffect(() => {
    // Update recording duration
    let interval;
    if (isRecording) {
      interval = setInterval(async () => {
        const status = await audioRecorder.getStatusAsync();
        if (status.isRecording) {
          setRecordingDuration(Math.floor(status.durationMillis / 1000));
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      if (isRecording) {
        audioRecorder.stop();
        setIsRecording(false);
      }
    };
  }, [isRecording]);

  const record = async () => {
    if (isRecording) {
      Alert.alert(
        "Already recording",
        "Please stop the current recording first."
      );
      return;
    }

    if (hasPermission === null) {
      try {
        setIsLoading(true);
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required for recording audio."
          );
          return;
        }
      } catch (error) {
        console.error("Permission error:", error);
        Alert.alert("Error", "Failed to request microphone permission.");
        return;
      } finally {
        setIsLoading(false);
      }
    }

    if (hasPermission === false) {
      Alert.alert(
        "Permission Required",
        "Please grant microphone permission in your device settings to record."
      );
      return;
    }

    try {
      await audioRecorder.prepareToRecordAsync();
      console.log("Recording started");
      audioRecorder.record();
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
      setIsLoading(true);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      console.log("Recording stopped, file saved at:", uri);
      if (!uri) {
        throw new Error("No audio file was recorded.");
      }

      setIsRecording(false);
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
      setRecordingDuration(0);
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
          ? `Recording (${recordingDuration}s)`
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
