import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio"; // Removed useAudioRecorder, RecordingOptions, AudioModule, RecordingPresets
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MessageBubble from "../utils/MessageBubble"; // Assuming MessageBubble is in '../utils/MessageBubble'
import AudioRecorderButton from "../utils/AudioRecorderButton";
import LanguageSelector from "../utils/LanguageSelector";
// import AudioRecorderButton from "./AudioRecorderButton"; // Import the new AudioRecorderButton component

const STTConverter = () => {
  const scrollViewRef = useRef();
  const navigation = useNavigation();

  // Removed isRecording and audioUri (from recorder) as they are now managed by AudioRecorderButton
  const [isLoading, setIsLoading] = useState(false); // For STT API call loading
  const [messages, setMessages] = useState([]);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // State to hold the URI of the last recorded audio, passed from AudioRecorderButton
  const [recordedAudioForSTT, setRecordedAudioForSTT] = useState(null);

  // States for Source Language
  const [sourceLanguage, setSourceLanguage] = useState("en-IN"); // Default source language
  const [showSourceLanguageModal, setShowSourceLanguageModal] = useState(false);

  // States for Destination Language
  const [destinationLanguage, setDestinationLanguage] = useState("od-IN");
  const [showDestinationLanguageModal, setShowDestinationLanguageModal] =
    useState(false);

  // States for Speaker Selection
  // const [selectedSpeaker, setSelectedSpeaker] = useState("manisha");
  // const [showSourceSpeakerModal, setShowSourceSpeakerModal] = useState(false);

  // const { selectedSpeaker } = useSpeaker(); // Use the SpeakerContext to get the selected speaker

  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);

  // This function will be called by AudioRecorderButton when a recording is complete
  const handleRecordingComplete = (uri) => {
    setRecordedAudioForSTT(uri); // Store the URI for the STT conversion
    const audioMessage = {
      id: `audio_${Date.now()}`,
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
    setMessages((prev) => [...prev, audioMessage]);
  };

  // This function can be used to reset state when a new recording starts
  const handleRecordingStart = () => {
    setRecordedAudioForSTT(null); // Clear previous recorded audio when a new one starts
    setIsLoading(false); // Ensure STT loading is reset
    player.pause(); // Pause any currently playing audio
    setPlayingMessageId(null);
  };

  const speechToText = async () => {
    if (!recordedAudioForSTT) {
      Alert.alert("Error", "No audio recording available to convert.");
      return;
    }
    try {
      setIsLoading(true); // Set loading for the STT API call

      const formData = new FormData();
      formData.append("audio", {
        uri: recordedAudioForSTT, // Use the URI from the recordedAudioForSTT state
        type: "audio/wav",
        name: "recording.wav",
      });

      formData.append("source_language", sourceLanguage);
      formData.append("destination_language", destinationLanguage);

      const apiUrl = `${process.env.EXPO_PUBLIC_URL}/api/v1/stt`;
      // console.log("API URL:", apiUrl);
      if (!apiUrl) {
        Alert.alert(
          "Error",
          "API URL is not defined. Please check your configuration."
        );
        return;
      }
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          "user-agent":
            "OdishaVoxApp/0.1.0 (Android/Linux; ARMv8; Build/17-07-2025)",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to convert speech to text"
        );
      }

      const data = await response.json();

      // console.log(data);
      if (data.translation) {
        const textMessage = {
          id: `text_${Date.now()}`,
          text: data.translation,
          type: "api",
          content_type: "text",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: false,
        };
        setMessages((prev) => [...prev, textMessage]);
      } else {
        throw new Error("No transcription received from server");
      }
    } catch (error) {
      console.error("STT Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: error.message || "Failed to convert speech to text",
          type: "api",
          content_type: "text",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        },
      ]);
      Alert.alert(
        "Conversion Error",
        error.message || "Failed to convert speech to text"
      );
    } finally {
      setIsLoading(false);
      // After conversion, you might want to clear the recorded audio URI
      // setRecordedAudioForSTT(null); // Uncomment if you want to clear the audio after sending
    }
  };

  useEffect(() => {
    // Cleanup player on unmount
    return () => {
      player?.stopAsync?.();
    };
  }, []);

  useEffect(() => {
    // Scroll to end when messages update
    if (messages.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (!playerStatus) return;
    setIsPlaying(playerStatus.playing);
    if (playerStatus.didJustFinish) {
      setIsPlaying(false);
      setPlayingMessageId(null);
    }
  }, [playerStatus]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={30} color="#000" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#212121" }}>
            Speech to Text Converter
          </Text>
          <Text style={styles.subtitle}>
            Convert speech to text in various languages{" "}
          </Text>
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

      {/* Speaker Selector */}
      {/* <View>
        <SpeakerSelector
          label="Speaker"
          selectedSpeaker={selectedSpeaker}
          onSelectSpeaker={(speakerCode) => {
            setSelectedSpeaker(speakerCode);
          }}
          showSpeakerModal={showSourceSpeakerModal}
          setShowSpeakerModal={setShowSourceSpeakerModal}
        />
      </View> */}
      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons
              name="mic"
              size={48}
              color="#6200ee"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Press the{" "}
              <Text style={styles.highlightText}>microphone button</Text> below
              to begin
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.chatContent}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isPlaying={playingMessageId === message.id}
              />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {/* Use the AudioRecorderButton component */}
        <AudioRecorderButton
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={handleRecordingStart}
        />
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            (!recordedAudioForSTT || isLoading) && styles.disabledButton, // Disable if no recorded audio or STT is loading
            pressed && styles.buttonPressed,
          ]}
          onPress={speechToText}
          disabled={!recordedAudioForSTT || isLoading || isPlaying} // Disable if no audio, STT loading, or audio is playing
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="send" size={30} color="#fff" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 6,
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
    marginLeft: 15,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  languageSelectorsContainer: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    opacity: 0.2,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 20,
  },
  highlightText: {
    fontWeight: "600",
    color: "#6200ee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  chatContent: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 24,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  // Removed recordButton and recordingActive styles as they are now in AudioRecorderButton
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default STTConverter;
