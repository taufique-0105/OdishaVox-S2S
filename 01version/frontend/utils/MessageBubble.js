import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useAudioPlayer } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Clipboard from "expo-clipboard"; // Import Clipboard

const MessageBubble = (props) => {
  const { message } = props;
  const isError = message.isError;
  const type = message.type;
  const content_type = message.content_type;

  const player = useAudioPlayer();
  const [audioUri, setAudioUri] = useState(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [waveHeights, setWaveHeights] = useState([10, 10, 10, 10, 10]);
  const [isDownloading, setIsDownloading] = useState(false);
  const animationRef = useRef(null);

  // Added state for double-tap detection
  const lastTap = useRef(0);
  const doubleTapDelay = 300; // milliseconds

  useEffect(() => {
    if (message.content_type === "audio") {
      setAudioUri(message.audioUri);
    } else {
      setAudioUri(null);
    }
  }, [message]);

  useEffect(() => {
    const loadAudio = async () => {
      if (!audioUri) {
        setIsAudioLoaded(false);
        return;
      }

      try {
        await player.replace(audioUri);
        setIsAudioLoaded(true);
      } catch (error) {
        console.error("Error loading audio:", error);
        setIsAudioLoaded(false);
      }
    };

    loadAudio();

    return () => {
      clearInterval(animationRef.current);
    };
  }, [audioUri, player]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const playing = await player.playing;
        setIsAudioPlaying(playing);

        if (playing) {
          setWaveHeights(
            Array(5)
              .fill(0)
              .map(() => Math.random() * 20 + 5)
          );
        } else {
          setWaveHeights([10, 10, 10, 10, 10]);
        }
      } catch (error) {
        console.error("Error checking playback status:", error);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [player]);

  const playSound = async () => {
    if (!audioUri || !isAudioLoaded) return;
    try {
      await player.seekTo(0);
      await player.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsAudioPlaying(false);
    }
  };

  const pauseSound = async () => {
    try {
      await player.pause();
    } catch (error) {
      console.error("Error pausing audio:", error);
    }
  };

  const togglePlayPause = () => {
    if (isAudioPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };

  const handleDownload = async () => {
    if (!message.audioUri) {
      Alert.alert("Error", "No audio URI provided.");
      return;
    }

    setIsDownloading(true);
    console.log("Attempting to save audio:", message.audioUri);

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please grant media library access in your device settings to save audio files."
        );
        setIsDownloading(false);
        return;
      }

      const isRemoteUrl =
        message.audioUri.startsWith("http://") ||
        message.audioUri.startsWith("https://");
      let fileToSaveUri = message.audioUri;

      const filenameFromUri = message.audioUri.substring(
        message.audioUri.lastIndexOf("/") + 1
      );
      const fileName =
        filenameFromUri.length > 0 ? filenameFromUri : "downloaded_audio.mp3";

      if (isRemoteUrl) {
        const localUri = FileSystem.documentDirectory + fileName;
        const { uri: downloadedFileUri } = await FileSystem.downloadAsync(
          message.audioUri,
          localUri
        );
        fileToSaveUri = downloadedFileUri;
        console.log("Audio downloaded to local URI:", downloadedFileUri);
      }

      await MediaLibrary.createAssetAsync(fileToSaveUri);

      Alert.alert(
        "Download Complete",
        `"${fileName}" has been saved to your device's media library.`
      );
      console.log("Download complete and saved to device!");
    } catch (error) {
      console.error("Error downloading or saving audio:", error);
      Alert.alert("Download Failed", `There was an error: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTextPress = () => {
    const now = Date.now();
    if (now - lastTap.current < doubleTapDelay) {
      // Double tap detected
      handleCopyText();
    }
    lastTap.current = now;
  };

  const handleCopyText = async () => {
    if (message.text) {
      await Clipboard.setStringAsync(message.text);
      Alert.alert("Copied!", "Message copied to clipboard.");
    }
  };

  const bubbleStyles = [
    styles.messageBubble,
    type === "user" ? styles.userBubble : styles.apiBubble,
    isError && styles.errorBubble,
  ];

  const textStyles = [
    styles.messageText,
    type === "user" ? styles.userText : styles.apiText,
    isError && styles.errorText,
  ];

  const renderAudioPlayer = () => {
    return (
      <View style={styles.audioContainer}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={[
            styles.playButton,
            type === "user" ? styles.userPlayButton : styles.apiPlayButton,
          ]}
        >
          <Ionicons
            name={isAudioPlaying ? "pause" : "play"}
            size={18}
            color={type === "user" ? "#FFFFFF" : "#0A84FF"}
          />
        </TouchableOpacity>
        <View style={styles.waveContainer}>
          {waveHeights.map((height, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: height,
                  backgroundColor: type === "user" ? "#FFFFFF" : "#0A84FF",
                  opacity: isAudioPlaying ? 1 : 0.6,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={handleDownload}
          style={[
            styles.downloadButton,
            type === "user"
              ? styles.userDownloadButton
              : styles.apiDownloadButton,
          ]}
          disabled={isDownloading}
        >
          <Ionicons
            name={isDownloading ? "cloud-download" : "download"}
            size={18}
            color={type === "user" ? "#FFFFFF" : "#0A84FF"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.bubbleContainer,
        type === "user" ? styles.userContainer : styles.apiContainer,
      ]}
    >
      <TouchableOpacity
        // Apply TouchableOpacity to the entire bubble for double-tap
        onPress={content_type === "text" ? handleTextPress : undefined}
        activeOpacity={content_type === "text" ? 0.7 : 1} // Only apply activeOpacity for text bubbles
        disabled={content_type !== "text"} // Disable if not a text message
      >
        <View style={bubbleStyles}>
          {isError ? (
            <Text style={textStyles}>{message.text}</Text>
          ) : content_type === "text" ? (
            <Text style={textStyles}>{message.text}</Text>
          ) : (
            renderAudioPlayer()
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: "80%",
    marginVertical: 8,
  },
  userContainer: {
    alignSelf: "flex-end",
    marginRight: 12,
  },
  apiContainer: {
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    backgroundColor: "#0A84FF",
    borderBottomRightRadius: 4,
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  apiBubble: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 4,
  },
  apiText: {
    color: "#1C2526",
    fontSize: 16,
    lineHeight: 22,
  },
  errorBubble: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: 180,
    paddingVertical: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  userPlayButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  apiPlayButton: {
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    justifyContent: "space-between",
    flex: 1,
    marginHorizontal: 10,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  userDownloadButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  apiDownloadButton: {
    backgroundColor: "rgba(10, 132, 255, 0.15)",
  },
});

export default MessageBubble;
