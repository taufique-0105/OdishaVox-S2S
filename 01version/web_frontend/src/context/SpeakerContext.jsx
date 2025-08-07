import { createContext, useContext, useState } from "react";
import { useEffect } from 'react';
const SpeakerContext = createContext();
const UpdateSpeakerContext = createContext();

export const useSpeaker = () => {
  return useContext(SpeakerContext);
}

export const useUpdateSpeaker = () => {
  return useContext(UpdateSpeakerContext);
}

export const SpeakerProvider = ({children}) => {
  const [speaker, setSpeaker] = useState(() => {
    const storedSpeaker = localStorage.getItem('speaker');
    return storedSpeaker ? JSON.parse(storedSpeaker) : { gender: 'male', voiceName: 'abhilash' };
  });

  const updateSpeaker = (newSpeaker) => {
    setSpeaker(newSpeaker);
    localStorage.setItem('speaker', JSON.stringify(newSpeaker));
  }
  useEffect(() => {
    localStorage.setItem('speaker', JSON.stringify(speaker));
  }, [speaker]);
  
  return (
    <SpeakerContext.Provider value={speaker}>
      <UpdateSpeakerContext.Provider value={updateSpeaker}>
        {children}
      </UpdateSpeakerContext.Provider>
    </SpeakerContext.Provider>
  )
}
