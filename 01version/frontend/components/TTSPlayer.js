import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useAudioPlayer } from "expo-audio";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Network from "expo-network";
import MessageBubble from "../utils/MessageBubble";

const TTSComponent = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  // const player = useAudioPlayer(audioUri);

  const languages = [
    { code: "en-IN", name: "English (India)" },
    { code: "od-IN", name: "Odia" },
    { code: "hi-IN", name: "Hindi" },
    { code: "ta-IN", name: "Tamil" },
    { code: "te-IN", name: "Telugu" },
    { code: "kn-IN", name: "Kannada" },
    { code: "ml-IN", name: "Malayalam" },
    { code: "bn-IN", name: "Bengali" },
    { code: "gu-IN", name: "Gujarati" },
    { code: "mr-IN", name: "Marathi" },
    { code: "pa-IN", name: "Punjabi" },
  ];

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const checkNetworkStatus = async () => {
    try {
      const status = await Network.getNetworkStateAsync();
      setNetworkStatus(status);
      if (!status.isConnected) {
        Alert.alert(
          "No Internet Connection",
          "Please check your internet connection"
        );
      }
    } catch (error) {
      Alert.alert("Network Error", "Unable to check network status");
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert("Input Required", "Please enter some text to convert");
      return;
    }

    if (text.length > 1000) {
      Alert.alert("Text Too Long", "Please keep under 1000 characters");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        type: "user",
        content_type: "text",
        isError: false,
      },
    ]);

    fetchTTS();
  };

  const fetchTTS = async () => {
    if (!networkStatus?.isConnected) {
      Alert.alert("No Internet Connection", "Please check your connection");
      return;
    }

    setLoading(true);
    const host = process.env.EXPO_PUBLIC_URL;
    const URI = `${host}/api/v1/tts`;

    if (!URI) {
      Alert.alert("Configuration Error", "API URL is not defined");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-agent": "OdishaVoxApp/0.1.0",
        },
        body: JSON.stringify({
          text: text.trim(),
          target_language_code: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!data.audios?.[0]) {
        throw new Error("No audio data received");
      }

      const fileName = `tts-${Date.now()}.wav`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, data.audios[0], {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAudioUri(fileUri);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Audio generated in ${getLanguageName(selectedLanguage)}`,
          type: "api",
          content_type: "audio",
          audioUri: fileUri,
          isError: false,
        },
      ]);
      setText("");
    } catch (error) {
      Alert.alert("Conversion Error", error.message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: error.message,
          type: "api",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // const handlePlay = async (uri) => {
  //   if (!uri) {
  //     Alert.alert("Playback Error", "No audio file to play");
  //     return;
  //   }

  //   try {
  //     player.replace(uri);
  //     await player.play();
  //   } catch (error) {
  //     Alert.alert("Playback Error", error.message);
  //   }
  // };

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setShowLanguageModal(false);
  };

  const getLanguageName = (code) => {
    return languages.find((l) => l.code === code)?.name || "Select Language";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={20} color="#000" />
      </Pressable>

      <View style={styles.mainContent}>
        <Text style={styles.title}>Text-to-Speech Converter</Text>

        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.languageSelectorText}>
            {getLanguageName(selectedLanguage)}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#2c3e50" />
        </TouchableOpacity>

        <View style={styles.displayContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {" "}
                Enter text below to convert it to speech{" "}
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item }) => <MessageBubble message={item} />}
              keyExtractor={(item) => item.id.toString()}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              onLayout={() => flatListRef.current?.scrollToEnd()}
            />
          )}
        </View>

        <Modal
          visible={showLanguageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLanguageModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    selectedLanguage === item.code &&
                      styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text
                    style={[
                      styles.languageItemText,
                      selectedLanguage === item.code &&
                        styles.selectedLanguageItemText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedLanguage === item.code && (
                    <MaterialIcons name="check" size={20} color="#3498db" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type or paste your text here..."
          placeholderTextColor="#888"
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialIcons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  languageSelectorText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  displayContainer: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center",
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedLanguageItem: {
    backgroundColor: "#f5f5f5",
  },
  languageItemText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  selectedLanguageItemText: {
    fontWeight: "bold",
    color: "#3498db",
  },
});

export default TTSComponent;
