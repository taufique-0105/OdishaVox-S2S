import {
  ActivityIndicator,
  Alert,
  ScrollView, // Changed from FlatList
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  useAudioPlayer,
  useAudioRecorder,
  useAudioPlayerStatus,
} from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MessageBubble from "../utils/MessageBubble"; // Import MessageBubble

const WaveAnimation = () => {
  const barHeights = [
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
    useRef(new Animated.Value(5)).current,
  ];

  useEffect(() => {
    barHeights.forEach((barHeight, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(barHeight, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(barHeight, {
            toValue: 5,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });

    return () => {
      barHeights.forEach((barHeight) => barHeight.stopAnimation());
    };
  }, []);

  const barStyle = {
    width: 3,
    backgroundColor: "white",
    marginHorizontal: 1,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        height: 24,
        marginLeft: 8,
      }}
    >
      {barHeights.map((height, index) => (
        <Animated.View key={index} style={[barStyle, { height }]} />
      ))}
    </View>
  );
};

const STSConverter = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null); // Changed from flatListRef

  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);

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

  // Renamed to match STTConverter's function name and adjusted for MessageBubble props

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert(
            "Permission Denied",
            "Microphone access is required for this app to work."
          );
        }
      } catch (error) {
        console.error("Permission error:", error);
        Alert.alert("Error", "Failed to request microphone permission.");
      }
    };

    requestPermission();

    return () => {
      if (isRecording) {
        audioRecorder.stop();
      }
      if (currentlyPlaying) {
        player.pause();
      }
    };
  }, []);

  const record = async () => {
    if (isRecording) {
      Alert.alert(
        "Already recording",
        "Please stop the current recording first."
      );
      return;
    }

    try {
      setIsLoading(false);
      setAudioUri(null);

      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to start recording"
      );
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        throw new Error("No audio file was recorded");
      }

      setAudioUri(uri);
      setIsRecording(false);

      const newMessage = {
        id: `sent_${Date.now().toString()}`, // Added prefix for uniqueness
        audioUri: uri, // Changed to audioUri
        type: "user", // Changed to 'user' for consistency with STTConverter
        content_type: "audio", // Added for MessageBubble consistency
        timestamp: new Date().toLocaleTimeString([], {
          // Changed to locale time string
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: "Voice message", // Added for MessageBubble consistency
        isError: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (scrollViewRef.current) {
        // Changed to scrollViewRef
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Stop recording error:", error);
      Alert.alert(
        "Recording Failed",
        error.message || "Failed to stop recording"
      );
    }
  };

  const speechToSpeech = async () => {
    if (!audioUri) {
      Alert.alert("No Audio", "Please record an audio file first.");
      return;
    }
    const host = process.env.EXPO_PUBLIC_URL;
    const API_URL = `${host}/api/v1/sts`;

    if (!API_URL) {
      Alert.alert(
        "Error",
        "API URL is not defined. Please check your configuration.",
        API_URL
      );
      return;
    }
    try {
      setIsLoading(true);
      console.log("Processing audio:", audioUri);

      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        type: "audio/wav",
        name: `recording-${Date.now()}.wav`,
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "user-agent":
            "OdishaVoxApp/0.1.0 (Android/Linux; ARMv8; Android 10, dev-v0.1.1)",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server responded with an error");
      }

      const data = await response.json();

      if (!data.audio) {
        throw new Error("No audio data received from the server");
      }
      const timestamp = Date.now();
      const fileName = `processed-${timestamp}.wav`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, data.audio, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const newMessage = {
        id: `received_${Date.now().toString()}`, // Added prefix for uniqueness
        audioUri: fileUri, // Changed to audioUri
        type: "api", // Changed to 'api' for consistency with STTConverter
        content_type: "audio", // Added for MessageBubble consistency
        timestamp: new Date().toLocaleTimeString([], {
          // Changed to locale time string
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: "Audio response", // Added for MessageBubble consistency
        isError: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      if (scrollViewRef.current) {
        // Changed to scrollViewRef
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      console.log("Processed audio saved at", fileUri);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Processing Error",
        error.message || "Failed to process audio"
      );
      setMessages((prev) => [
        // Add error message
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: error.message || "Failed to process audio",
          type: "api",
          content_type: "text",
          timestamp: new Date().toLocaleTimeString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!playerStatus) return;

    setIsPlaying(playerStatus.playing);

    if (playerStatus.didJustFinish) {
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    }
  }, [playerStatus]);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#000" />
      </Pressable>
      {hasPermission === false ? (
        <Text style={styles.errorText}>
          Microphone permission is required for this app to work.
        </Text>
      ) : (
        <>
          <Text style={styles.title}>Speech to Speech</Text>
          <Text style={styles.subtitle}>Record, convert, and play audio</Text>
          <View style={styles.messagesContainer}>
            <ScrollView
              ref={scrollViewRef} // Changed from FlatList
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Welcome to Speech to Speech
                  </Text>
                  <Text style={styles.emptySubText}>
                    Record your voice, and we’ll convert it to another speech.
                  </Text>
                  <Text style={styles.emptySubText}>
                    Start by pressing the microphone button below.
                  </Text>
                </View>
              ) : (
                messages.map((item) => (
                  <MessageBubble
                    key={item.id}
                    message={item}
                    isPlaying={currentlyPlaying === item.audioUri && isPlaying}
                    // Pass WaveAnimation only if playing this specific audio
                    WaveAnimationComponent={
                      currentlyPlaying === item.audioUri && isPlaying
                        ? WaveAnimation
                        : null
                    }
                  />
                ))
              )}
            </ScrollView>
          </View>
          <View style={styles.mainButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.recordButton,
                isRecording && styles.recordingButton,
                pressed && styles.buttonPressed,
                hasPermission === false && styles.disabledButton,
              ]}
              onPress={isRecording ? stopRecording : record}
              disabled={hasPermission === false}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={32}
                color="white"
              />
              <Text style={styles.recordButtonText}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.sendButton,
                (!audioUri || isRecording) && styles.disabledButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={speechToSpeech}
              disabled={!audioUri || isRecording || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Ionicons name="send" size={24} color="white" />
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  messagesContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 0,
    padding: 20,
  },
  messagesList: {
    paddingBottom: 20,
  },
  mainButtonContainer: {
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
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
  actionButton: {
    flex: 1,
    maxWidth: 80,
    paddingVertical: 15,
    borderRadius: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sendButton: {
    backgroundColor: "#37b24b",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  errorText: {
    color: "#f03e3e",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default STSConverter;
