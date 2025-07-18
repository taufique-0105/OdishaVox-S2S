import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
// import { useSpeaker } from "./context/SpeakerContext";
import SpeakerSelector from "../utils/SpeakerSelector";
import { useSpeaker } from "../context/SpeakerContext";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const { selectedSpeaker, setSelectedSpeaker } = useSpeaker();
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [showSpeaker, setShowSpeaker] = useState(false);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={30} color="#000000ff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.preferenceToggle}
          onPress={() => setShowSpeaker(!showSpeaker)}
        >
          <Text style={styles.sectionTitle}>Audio Preferences</Text>
          {showSpeaker ? (
            <MaterialIcons name="keyboard-arrow-up" size={24} color="#2d3436" />
          ) : (
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color="#2d3436"
            />
          )}
        </TouchableOpacity>

        {showSpeaker && (
          <SpeakerSelector
            label="App Speaker"
            selectedSpeaker={selectedSpeaker}
            onSelectSpeaker={setSelectedSpeaker}
            showSpeakerModal={showSpeakerModal}
            setShowSpeakerModal={setShowSpeakerModal}
          />
        )}
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: "#f9fafc",
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
    // marginLeft: 35,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
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
  section: {
    marginBottom: 20,
    padding: 15,
  },
  preferenceToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 10,
  },
});
