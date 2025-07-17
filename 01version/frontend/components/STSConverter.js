import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MessageBubble from "../utils/MessageBubble";
import AudioRecorderButton from "../utils/AudioRecorderButton";
import LanguageSelector from "../utils/LanguageSelector";
import { useSpeaker } from "../context/SpeakerContext";

const STSConverter = () => {
  const [audioUri, setAudioUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);

  const [sourceLanguage, setSourceLanguage] = useState("en-IN"); // Default source language
  const [showSourceLanguageModal, setShowSourceLanguageModal] = useState(false);

  // States for Destination Language
  const [destinationLanguage, setDestinationLanguage] = useState("od-IN");
  const [showDestinationLanguageModal, setShowDestinationLanguageModal] =
    useState(false);

  const { selectedSpeaker } = useSpeaker(); // Use the SpeakerContext to get the selected speaker

  useEffect(() => {
    // Scroll to end when messages update
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleRecordingComplete = (uri) => {
    setAudioUri(uri);
    const newMessage = {
      id: `sent_${Date.now().toString()}`,
      audioUri: uri,
      type: "user",
      content_type: "audio",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: "Voice message",
      isError: false,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleRecordingStart = () => {
    // You can add logic here if something needs to happen when recording starts,
    // like clearing previous audioUri or reset some state
    setAudioUri(null); // Clear previous audio when new recording starts
    setIsLoading(false); // Ensure main component isn't stuck in loading
  };

  const speechToSpeech = async () => {
    if (!audioUri) {
      Alert.alert("No Audio", "Please record an audio file first.");
      return;
    }
    const host = process.env.EXPO_PUBLIC_URL;
    const URI = `${host}/api/v1/sts`;

    if (!URI) {
      Alert.alert(
        "Error",
        "API URL is not defined. Please check your configuration."
      );
      return;
    }
    try {
      setIsLoading(true);
      // console.log("Processing audio:", audioUri);

      const formData = new FormData();
      formData.append("audio", {
        uri: audioUri,
        type: "audio/wav",
        name: `recording-${Date.now()}.wav`,
      });

      formData.append("source_language", sourceLanguage);
      formData.append("destination_language", destinationLanguage);
      formData.append("speaker", selectedSpeaker);

      const response = await fetch(URI, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "user-agent":
            "OdishaVoxApp/0.1.1 (Android/Linux; ARMv8; Build/17-07-2025)",
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
        id: `received_${Date.now().toString()}`,
        audioUri: fileUri,
        type: "api",
        content_type: "audio",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: "Audio response",
        isError: false,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      // console.log("Processed audio saved at", fileUri);
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert(
        "Processing Error",
        error.message || "Failed to process audio"
      );
      setMessages((prev) => [
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
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="#000" />
        </Pressable>
        {/* hasPermission check is now handled internally by AudioRecorderButton */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Speech to Speech</Text>
          <Text style={styles.subtitle}>Record, convert, and play audio</Text>
        </View>
      </View>
      <View style={styles.languageSelectorsContainer}>
        <LanguageSelector
          label="Source Language"
          selectedLanguage={sourceLanguage}
          onSelectLanguage={(lang) => {
            setSourceLanguage(lang);
            setShowSourceLanguageModal(false);
          }}
          showLanguageModal={showSourceLanguageModal}
          setShowLanguageModal={setShowSourceLanguageModal}
        />
        <TouchableOpacity>
          <MaterialIcons
            name="swap-horiz"
            size={30}
            color="#3498db"
            onPress={() => {
              const temp = sourceLanguage;
              setSourceLanguage(destinationLanguage);
              setDestinationLanguage(temp);
            }}
          />
        </TouchableOpacity>
        <LanguageSelector
          label="Destination Language"
          selectedLanguage={destinationLanguage}
          onSelectLanguage={(lang) => {
            setDestinationLanguage(lang);
            setShowDestinationLanguageModal(false);
          }}
          showLanguageModal={showDestinationLanguageModal}
          setShowLanguageModal={setShowDestinationLanguageModal}
        />
      </View>
      <View style={styles.messagesContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Welcome to Speech to Speech</Text>
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
              />
            ))
          )}
        </ScrollView>
      </View>
      <View style={styles.mainButtonContainer}>
        <AudioRecorderButton
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={handleRecordingStart}
        />
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.sendButton,
            (!audioUri || isLoading) && styles.disabledButton, // Disable if no audio or conversion is loading
            pressed && styles.buttonPressed,
          ]}
          onPress={speechToSpeech}
          disabled={!audioUri || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Ionicons name="send" size={24} color="white" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
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

  titleContainer: {
    flex: 1,
    marginLeft: 35,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121",
  },

  subtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 2,
  },
  languageSelectorsContainer: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    gap: 10, // Added gap for spacing between buttons
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
