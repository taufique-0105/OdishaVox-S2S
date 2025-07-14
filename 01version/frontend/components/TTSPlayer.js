import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Network from "expo-network";
import MessageBubble from "../utils/MessageBubble";
import LanguageSelector from "../utils/LanguageSelector";
import SpeakerSelector from "../utils/SpeakerSelector";

const TTSComponent = ({ initialText = "" }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // States for Source Language
  const [sourceLanguage, setSourceLanguage] = useState("auto"); // Default source language
  const [showSourceLanguageModal, setShowSourceLanguageModal] = useState(false);

  // States for Destination Language
  const [destinationLanguage, setDestinationLanguage] = useState("od-IN"); // Default destination language
  const [showDestinationLanguageModal, setShowDestinationLanguageModal] =
    useState(false);

  // States for Speaker Selection
  const [selectedSpeaker, setSelectedSpeaker] = useState("manisha"); // State for selected speaker
  const [showSourceSpeakerModal, setShowSourceSpeakerModal] = useState(false);

  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const navigation = useNavigation();

  // Define languages locally for use in getLanguageName for message display
  const allLanguages = [
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

  const getLanguageName = (code) => {
    return allLanguages.find((l) => l.code === code)?.name || "";
  };

  useEffect(() => {
    checkNetworkStatus();
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardShow
    );
    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardHide
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
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

  const handleKeyboardShow = () => {
    setIsKeyboardVisible(true);
  };

  const handleKeyboardHide = () => {
    setIsKeyboardVisible(false);
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
          source_language_code: sourceLanguage, // Use sourceLanguage
          target_language_code: destinationLanguage, // Use destinationLanguage
          speaker: selectedSpeaker, // Uncomment if you implement SpeakerSelector
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

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Audio generated from ${getLanguageName(
            sourceLanguage
          )} to ${getLanguageName(destinationLanguage)}`, // Update message text
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 20}
      style={styles.container}
    >
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={20} color="#000" />
      </Pressable>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Text-to-Speech Converter</Text>

        <View style={styles.languageSelectorsContainer}>
          {/* Source Language Selector */}
          <LanguageSelector
            label="Source Language"
            selectedLanguage={sourceLanguage}
            onSelectLanguage={(lang) => {
              setSourceLanguage(lang);
              setShowSourceLanguageModal(false); // Close modal on selection
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

          {/* Destination Language Selector */}
          <LanguageSelector
            label="Destination Language"
            selectedLanguage={destinationLanguage}
            onSelectLanguage={(lang) => {
              setDestinationLanguage(lang);
              setShowDestinationLanguageModal(false); // Close modal on selection
            }}
            showLanguageModal={showDestinationLanguageModal}
            setShowLanguageModal={setShowDestinationLanguageModal}
          />
        </View>

        <View>
        {/* Source Speaker Selector */}
        <SpeakerSelector
          label="Speaker"
          selectedSpeaker={selectedSpeaker}
          onSelectSpeaker={(speakerCode) => {
            setSelectedSpeaker(speakerCode);
          }}
          showSpeakerModal={showSourceSpeakerModal}
          setShowSpeakerModal={setShowSourceSpeakerModal}
        />

        </View>

        {/* <SpeakerSelector /> */}

        <View style={styles.displayContainer}>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Enter text below to convert it to speech \n
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
      </View>
      <View style={styles.inputWrapper}>
        <TouchableOpacity
          style={styles.keyboardButton}
          onPress={() => {
            if (isKeyboardVisible) {
              Keyboard.dismiss();
            } else {
              textInputRef.current?.focus();
            }
          }}
        >
          <MaterialIcons
            name={
              isKeyboardVisible ? "keyboard-arrow-down" : "keyboard-arrow-up"
            }
            size={30}
            color="#3498db"
          />
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
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
  languageSelectorsContainer: {
    marginBottom: 15, // Space between selectors and display area
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    paddingBottom: 10,
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
    paddingBottom: 20,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardButton: {
    width: 30,
    height: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  buttonDisabled: {
    backgroundColor: "#95a5a6",
    opacity: 0.7,
  },
});

export default TTSComponent;
