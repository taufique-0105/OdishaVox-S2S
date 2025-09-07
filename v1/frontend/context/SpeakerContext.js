import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SpeakerContext = createContext();

export const SpeakerProvider = ({ children }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState('vidya'); // Default speaker

  // Load saved speaker from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("selectedSpeaker").then((value) => {
      if (value) setSelectedSpeaker(value);
    });
  }, []);

  // Save selected speaker to AsyncStorage when it changes
  const updateSelectedSpeaker = (code) => {
    setSelectedSpeaker(code);
    AsyncStorage.setItem("selectedSpeaker", code);
  };

  return (
    <SpeakerContext.Provider value={{ selectedSpeaker, setSelectedSpeaker: updateSelectedSpeaker }}>
      {children}
    </SpeakerContext.Provider>
  );
};

export const useSpeaker = () => useContext(SpeakerContext);