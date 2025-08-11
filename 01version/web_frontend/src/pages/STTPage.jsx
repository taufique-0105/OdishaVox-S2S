import React, { useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import { FaMicrophone, FaStopCircle } from 'react-icons/fa';
import MessageBubble from '../components/MessageBubble';
import LanguageSelector from '../components/LanguageSelector';
import { IoMdSwap } from 'react-icons/io';

function STTPage() {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // State for source language selection
  const [sourceLanguage, setSourceLanguage] = useState('en-IN');
  const [showSourceModal, setShowSourceModal] = useState(false);

  // State for destination language selection
  const [destinationLanguage, setDestinationLanguage] = useState('en-IN');
  const [showDestinationModal, setShowDestinationModal] = useState(false);


  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {

    if (!window.MediaRecorder) {
      alert('MediaRecorder is not supported in this browser.');
      return;
    }

    try {
      //1. Check for microphone permission
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
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioChunksRef.current = []; // Clear the chunks for the next recording
        streamRef.current?.getTracks().forEach(track => track.stop());
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'user',
            contentType: 'audio',
            content: audioUrl,
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random().toString(36)
          }
        ])
        // console.log(audioUrl)
        setIsProcessing(true);
        fetchSTT(audioBlob)
      }

      mediaRecorderRef.current.start();
      // console.log("Recording Started")
      setIsRecording(true);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone settings.');
      return;
    }


  }

  const stopRecording = () => {
    // 3. Stop recording logic
    // console.log("Recording stoped")
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  const fetchSTT = async (audioURL) => {
    if (!audioURL) {
      alert("No audio recording present, record audio and then submit.")
    }
    // console.log(audioURL)
    setIsProcessing(true)
    const URL = `${import.meta.env.VITE_API_URL}/api/v1/stt`;
    // console.log(URL)
    try {
      const formData = new FormData();
      formData.append("audio", audioURL, "recording.wav");
      formData.append("source_language", sourceLanguage);
      formData.append("destination_language", destinationLanguage);
      // console.log(formData)
      const response = await fetch(URL, {
        method: 'POST',
        // headers: {
        //   'content-type': 'application/json'
        // },
        body: formData
      })
      const data = await response.json();

      // console.log(data.translation)
      if (data.translation) {
        const textMessage = {
          id: `text_${Date.now()}`,
          text: data.translation,
          content: data.translation,
          role: "api",
          contentType: "text",
          timestamp: new Date().toLocaleTimeString(),
          isError: false,
        };

        // console.log(textMessage)
        setMessages((prev) => [...prev, textMessage]);
      }
      // console.log(data)
    } catch (error) {
      alert("Error while fetching API.")
      console.log(error)
    }
    finally {
      setIsProcessing(false)
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3">
            <span className="text-purple-600">Speech</span> to <span className="text-indigo-600">Text</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Convert your speech to text with high accuracy
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
              {isProcessing ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : isRecording && (
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
              <div className="space-y-4 mb-6">
                {messages.map((message, index) => (
                  <MessageBubble
                    contents={{
                      role: message.role,
                      contentType: message.contentType,
                      content: message.content,
                      text: message.text // Add this line to pass the text content
                    }}
                    key={index}
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
                  <li>Your speech will be converted to text</li>
                </ol>
              </div>
            )}

            {/* Recording Button */}
            <div className="flex justify-center mt-8">
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
            <p className="text-sm text-gray-500 text-center">Convert your speech to text with high accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default STTPage;
