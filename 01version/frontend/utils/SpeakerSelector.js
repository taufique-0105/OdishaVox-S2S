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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";

const SpeakerSelector = ({
  label,
  selectedSpeaker,
  onSelectSpeaker,
  showSpeakerModal,
  setShowSpeakerModal,
}) => {
  const speakers = [
    { code: "abhilash", name: "Abhilash", color: "#3498db" },
    { code: "anushka", name: "Anushka", color: "#e74c3c" },
    { code: "manisha", name: "Manisha", color: "#2ecc71" },
    { code: "arya", name: "Arya", color: "#f39c12" },
    { code: "hitesh", name: "Hitesh", color: "#9b59b6" },
    { code: "karun", name: "Karun", color: "#1abc9c" },
    { code: "vidya", name: "Vidya", color: "#d35400" },
  ];

  const modalTranslateY = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSpeakerModal) {
      Animated.parallel([
        Animated.spring(modalTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      modalTranslateY.setValue(500);
      fadeAnim.setValue(0);
    }
  }, [showSpeakerModal]);

  const getSpeakerName = (code) => {
    return speakers.find((s) => s.code === code)?.name || "Select Speaker";
  };

  const getSpeakerColor = (code) => {
    return speakers.find((s) => s.code === code)?.color || "#bdc3c7";
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalTranslateY, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowSpeakerModal(false));
  };

  const handleSpeakerSelect = (code) => {
    onSelectSpeaker(code);
    closeModal();
  };

  const renderInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <TouchableOpacity
        style={styles.speakerSelector}
        onPress={() => setShowSpeakerModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.selectorContent}>
          {selectedSpeaker ? (
            <View
              style={[
                styles.selectorAvatar,
                { backgroundColor: getSpeakerColor(selectedSpeaker) },
              ]}
            >
              <Text style={styles.avatarText}>
                {renderInitials(getSpeakerName(selectedSpeaker))}
              </Text>
            </View>
          ) : (
            <View style={[styles.selectorAvatar, styles.emptyAvatar]}>
              <Ionicons name="person-outline" size={20} color="#7f8c8d" />
            </View>
          )}
          <Text style={styles.speakerSelectorText}>
            {getSpeakerName(selectedSpeaker)}
          </Text>
        </View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <MaterialIcons
            name={showSpeakerModal ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={28}
            color="#3498db"
          />
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={showSpeakerModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: modalTranslateY }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={26} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={speakers}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.speakerItem,
                  selectedSpeaker === item.code && styles.selectedSpeakerItem,
                ]}
                onPress={() => handleSpeakerSelect(item.code)}
                activeOpacity={0.7}
              >
                <View style={styles.speakerInfo}>
                  <View
                    style={[
                      styles.speakerAvatar,
                      { backgroundColor: item.color },
                      selectedSpeaker === item.code && styles.selectedSpeakerAvatar,
                    ]}
                  >
                    <Text style={styles.avatarText}>
                      {renderInitials(item.name)}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.speakerItemText,
                        selectedSpeaker === item.code && styles.selectedSpeakerItemText,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.speakerRole}>Voice Artist</Text>
                  </View>
                </View>
                {selectedSpeaker === item.code && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={18} color="#fff" />
                  </View>
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

export default SpeakerSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: "94%",
    alignSelf: "center",
  },
  selectorLabel: {
    fontSize: 15,
    color: "#7f8c8d",
    marginBottom: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  speakerSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#dfe6e9",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectorAvatar: {
    width: 30,
    height: 30,
    borderRadius: 21,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyAvatar: {
    backgroundColor: "#f1f2f6",
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  speakerSelectorText: {
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingBottom: 15,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
    paddingBottom: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  speakerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  speakerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedSpeakerAvatar: {
    transform: [{ scale: 1.15 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  speakerItemText: {
    fontSize: 14,
    color: "#2d3436",
    fontWeight: "600",
    marginBottom: 3,
  },
  speakerRole: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  selectedSpeakerItem: {
    backgroundColor: "#f8fafb",
    borderWidth: 1.5,
    borderColor: "#3498db50",
  },
  selectedSpeakerItemText: {
    color: "#3498db",
  },
  selectedBadge: {
    backgroundColor: "#3498db",
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#f1f2f6",
    marginVertical: 2,
  },
});