import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
// import { useSpeaker } from "./context/SpeakerContext";
import SpeakerSelector from "../utils/SpeakerSelector";
import { useSpeaker } from "../context/SpeakerContext";

const Settings = () => {
  const { selectedSpeaker, setSelectedSpeaker } = useSpeaker();
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Preferences</Text>
        <SpeakerSelector
          label="App Speaker"
          selectedSpeaker={selectedSpeaker}
          onSelectSpeaker={setSelectedSpeaker}
          showSpeakerModal={showSpeakerModal}
          setShowSpeakerModal={setShowSpeakerModal}
        />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3436",
    marginBottom: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3436",
    marginBottom: 10,
  },
});