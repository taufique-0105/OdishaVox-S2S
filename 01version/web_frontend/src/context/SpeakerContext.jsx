import { createContext, useContext, useState } from "react";

const SpeakerContext = createContext();
const UpdateSpeakerContext = createContext();

export const useSpeaker = () => {
  return useContext(SpeakerContext);
}

export const useUpdateSpeaker = () => {
  return useContext(UpdateSpeakerContext);
}

export const SpeakerProvider = ({children}) => {
  const [speaker, setSpeaker] = useState({ gender: 'male', voiceName: 'abhilash' });

  const updateSpeaker = (newSpeaker) => {
    setSpeaker(newSpeaker);
  }
  
  return (
    <SpeakerContext.Provider value={speaker}>
      <UpdateSpeakerContext.Provider value={updateSpeaker}>
        {children}
      </UpdateSpeakerContext.Provider>
    </SpeakerContext.Provider>
  )
}
