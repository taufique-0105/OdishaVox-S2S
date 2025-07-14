import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LanguageSelector = ({
  label, // New prop for distinguishing between Source and Destination
  selectedLanguage,
  onSelectLanguage,
  showLanguageModal,
  setShowLanguageModal,
}) => {
  const languages = [
    // { code: "auto", name: "Auto Detect" }, // Added Auto Detect option)
    { code: "en-IN", name: "English (India) " },
    { code: "od-IN", name: "Odia " },
    { code: "hi-IN", name: "Hindi " },
    { code: "ta-IN", name: "Tamil " },
    { code: "te-IN", name: "Telugu " },
    { code: "kn-IN", name: "Kannada " },
    { code: "ml-IN", name: "Malayalam " },
    { code: "bn-IN", name: "Bengali " },
    { code: "gu-IN", name: "Gujarati " },
    { code: "mr-IN", name: "Marathi " },
    { code: "pa-IN", name: "Punjabi " },
  ];

  if (label === "Source Language") {
    languages.unshift({ code: "auto", name: "Auto Detect" }); // Add Auto Detect option at the top for Source
  }

  const getLanguageName = (code) => {
    return languages.find((l) => l.code === code)?.name || "Select Language";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.languageSelector}
        onPress={() => setShowLanguageModal(true)}
      >
        <Text style={styles.languageSelectorText}>
          {getLanguageName(selectedLanguage)}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#2c3e50" />
      </TouchableOpacity>

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
          <Text style={styles.modalTitle}>Select {label}</Text>
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
                onPress={() => onSelectLanguage(item.code)}
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
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  container: {
    // Added a container for individual selector to give it a label
    marginBottom: 10,
    alignSelf: "flex-start", // Prevents full width
    },
    selectorLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center", // Aligns label to the start
    },
    languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    minWidth: 160, // Set a minimum width for consistency
    maxWidth: 250, // Prevents it from being too wide
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    },
    languageSelectorText: {
    fontSize: 16,
    color: "#2c3e50",
    flexShrink: 1, // Prevents text overflow
    },
    modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Align modal to bottom
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

