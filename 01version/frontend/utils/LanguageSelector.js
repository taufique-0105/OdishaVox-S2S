import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";

const LanguageSelector = ({
  label,
  selectedLanguage,
  onSelectLanguage,
  showLanguageModal,
  setShowLanguageModal,
}) => {
  const modalTranslateY = useRef(new Animated.Value(300)).current;

  const languages = [
    { code: "en-IN", name: "English (India)", flag: "🇮🇳" },
    { code: "od-IN", name: "Odia", flag: "🇮🇳" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "ta-IN", name: "Tamil", flag: "🇮🇳" },
    { code: "te-IN", name: "Telugu", flag: "🇮🇳" },
    { code: "kn-IN", name: "Kannada", flag: "🇮🇳" },
    { code: "ml-IN", name: "Malayalam", flag: "🇮🇳" },
    { code: "bn-IN", name: "Bengali", flag: "🇮🇳" },
    { code: "gu-IN", name: "Gujarati", flag: "🇮🇳" },
    { code: "mr-IN", name: "Marathi", flag: "🇮🇳" },
    { code: "pa-IN", name: "Punjabi", flag: "🇮🇳" },
  ];

  if (label === "Source Language") {
    languages.unshift({ code: "auto", name: "Auto Detect", flag: "🌐" });
  }

  useEffect(() => {
    if (showLanguageModal) {
      // Open modal animation
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      // Close modal animation
      Animated.timing(modalTranslateY, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showLanguageModal]);

  const getLanguageName = (code) => {
    return languages.find((l) => l.code === code)?.name || "Select Language";
  };

  const getLanguageFlag = (code) => {
    return languages.find((l) => l.code === code)?.flag || "";
  };

  const closeModal = () => {
    Animated.timing(modalTranslateY, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Use requestAnimationFrame to ensure state update happens after animation
      requestAnimationFrame(() => setShowLanguageModal(false));
    });
  };

  const handleLanguageSelect = (code) => {
    onSelectLanguage(code);
    closeModal();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.languageSelector}
        onPress={() => setShowLanguageModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.languageFlag}>
            {getLanguageFlag(selectedLanguage)}
          </Text>
          <Text style={styles.languageSelectorText}>
            {getLanguageName(selectedLanguage)}
          </Text>
        </View>
        <MaterialIcons
          name={showLanguageModal ? "arrow-drop-up" : "arrow-drop-down"}
          size={24}
          color="#3498db"
        />
      </TouchableOpacity>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: modalTranslateY }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={languages}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.languageItem,
                  selectedLanguage === item.code && styles.selectedLanguageItem,
                ]}
                onPress={() => handleLanguageSelect(item.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text
                    style={[
                      styles.languageItemText,
                      selectedLanguage === item.code &&
                        styles.selectedLanguageItemText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                {selectedLanguage === item.code && (
                  <MaterialIcons name="check" size={20} color="#3498db" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Animated.View>
      </Modal>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "40%",
  },
  selectorLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  languageSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageFlag: {
    fontSize: 15,
    marginRight: 6,
  },
  languageSelectorText: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "65%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  closeButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  languageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLanguageItem: {
    backgroundColor: "#f8f9fa",
  },
  languageItemText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  selectedLanguageItemText: {
    fontWeight: "600",
    color: "#3498db",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 4,
  },
});