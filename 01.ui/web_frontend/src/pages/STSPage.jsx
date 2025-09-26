import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStopCircle, FaPaperPlane } from 'react-icons/fa';
import { IoIosSwap, IoMdChatbubbles, IoMdSwap } from 'react-icons/io';
import MessageBubble from '../components/MessageBubble';
import LanguageSelector from '../components/LanguageSelector';
import { useSpeaker } from '../context/SpeakerContext';

function STSPage() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // State for source language selection
  const [sourceLanguage, setSourceLanguage] = useState('en-IN');
  const [showSourceModal, setShowSourceModal] = useState(false);

  // State for destination language selection
  const [destinationLanguage, setDestinationLanguage] = useState('od-IN');
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  const speaker = useSpeaker();

  const startRecording = async () => {
    if (!window.MediaRecorder) {
      alert('MediaRecorder is not supported in this browser.');
      return;
    }

    try {
      const stream = await getPermissionforMicrophone();
      if (!stream) {
        alert('Microphone permission denied. Please allow access to the microphone.');
        return;
      }

      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioChunksRef.current = [];
        streamRef.current?.getTracks().forEach(track => track.stop());
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `text_${Date.now()}`,
            role: 'user',
            contentType: 'audio',
            content: audioUrl,
            timestamp: new Date().toLocaleTimeString()
          },
        ]);

        fetchSTS(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const fetchSTS = async (audioBlob) => {
    if (!audioBlob) {
      alert("No audio, record again and submit.")
    }

    const URI = `${import.meta.env.VITE_API_URL}/api/v1/sts`
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("source_language", sourceLanguage);
    formData.append("destination_language", destinationLanguage);
    formData.append("speaker", speaker.voiceName);

    // console.log(formData.getAll)

    // console.log(formData)
    // console.log(formData)
    try {
      const response = await fetch(URI, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "user-agent":
            "BharatVoxApp/web-app-v0.1.0",
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server responded with an error");
      }

      const data = await response.json();

      // console.log(data);

      if (data.translation) {
        const audioMessage = {
          id: `audio_${Date.now()}`,
          role: "api",
          contentType: "audio",
          content: data.audio,
          timestamp: new Date().toLocaleTimeString(),
          isError: false,
        };
        setMessages((prev) => [...prev, audioMessage]);
      }

    } catch (error) {
      alert("Error during API fetch.")
      console.error(error)
    }
  }

  const getPermissionforMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-3">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="text-purple-600">Speech</span> to <span className="text-indigo-600">Speech</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Record, convert, and play audio messages
          </p>
        </div>

        {/* Language Selector */}
        <div className="mb-6 flex justify-around items-center gap-4">
          <LanguageSelector
            label="Source Language"
            selectedLanguage={sourceLanguage}
            onSelectLanguage={setSourceLanguage}
            showLanguageModal={showSourceModal}
            setShowLanguageModal={setShowSourceModal}
          />
          <IoMdSwap
            className="text-gray-400"
            size={24}
            onClick={() => {
              const temp = sourceLanguage;
              setSourceLanguage(destinationLanguage);
              setDestinationLanguage(temp);
            }}
          />
          <LanguageSelector
            label="Target Language"
            selectedLanguage={destinationLanguage}
            onSelectLanguage={setDestinationLanguage}
            showLanguageModal={showDestinationModal}
            setShowLanguageModal={setShowDestinationModal}
          />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Status Bar */}
          <div className={`px-6 py-4 ${isRecording ? 'bg-amber-50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">
                {isRecording ? 'Recording in progress...' : 'Ready to record'}
              </span>
              {isRecording && (
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm text-gray-600">REC</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8">
            {/* Messages or Instructions */}
            {messages.length > 0 ? (
              <div className="space-y-4 mb-6 min-h-60">
                {messages.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    contents={{
                      role: msg.role, // Changed from msg.sender to msg.role
                      contentType: msg.contentType,
                      content: msg.content,
                      text: msg.text, // Include if text content is available
                      isError: msg.isError || false,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="prose prose-sm text-gray-600 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">How it works:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Click the "Start Recording" button to begin</li>
                  <li>Speak clearly into your microphone</li>
                  <li>Click "Stop Recording" when finished</li>
                  <li>Send the audio or record a new one</li>
                </ol>
              </div>
            )}

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className={`flex items-center justify-center px-6 py-3 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${isRecording ? 'bg-red-500 hover:bg-red-600 focus:ring-red-300' : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <FaStopCircle className="h-5 w-5 mr-2" />
                ) : (
                  <FaMicrophone className="h-5 w-5 mr-2" />
                )}
                <span className="text-lg font-semibold">
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Convert speech from one language to another and listen to the translation.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default STSPage;
