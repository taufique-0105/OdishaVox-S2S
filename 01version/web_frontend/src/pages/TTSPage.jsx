import React, { useEffect, useRef, useState } from 'react';
import { FaMagic, FaPaperPlane, FaPause, FaPlay } from 'react-icons/fa';
import MessageBubble from '../components/MessageBubble';
import LanguageSelector from '../components/LanguageSelector';
import { IoMdSwap } from 'react-icons/io';
import { useSpeaker } from '../context/SpeakerContext';

function TTSPage() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle');
  const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');

  const audioRef = useRef(null);

  const speaker = useSpeaker();

  // State for source language selection
  const [sourceLanguage, setSourceLanguage] = useState('en-IN');
  const [showSourceModal, setShowSourceModal] = useState(false);

  // State for destination language selection
  const [destinationLanguage, setDestinationLanguage] = useState('od-IN');
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  const convertTextToSpeech = async () => {
    setIsProcessing(true);
    setStatus('processing')
    const URL = `${import.meta.env.VITE_API_URL}/api/v1/tts`;
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          text: text.trim(),
          source_language_code: sourceLanguage,
          target_language_code: destinationLanguage,
          speaker: speaker.voiceName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const data = await response.json();
      audioResponseMessage(data)
      console.log('Success:', data);
      setStatus('ready')
    } catch (error) {
      setStatus('error')
      console.error('Error:', error);
    } finally {
      setIsProcessing(false)
      setStatus()
    }
  }

  const audioResponseMessage = (data) => {
    setMessages(prevMessages => [...prevMessages, {
      role: 'api',
      contentType: 'audio',
      content: data.audios,
      id: data.request_id,
      timestamp: new Date().toISOString()
    }]);
  }

  const handleTextInput = async (text) => {
    if (!text.trim()) {
      alert('Please enter some text to convert.');
      return;
    }
    setMessages(prevMessages => [...prevMessages, {
      role: 'user',
      contentType: 'text',
      content: text,
      isError: false,
      text: text
    }])
    await convertTextToSpeech();
    setText('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio position
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleTextInput(text)
      // Clear the input after action (optional)
      setText('');
    }
  }

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-3">
            <span className="text-purple-600">Text</span> to <span className="text-indigo-600">Speech</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Convert your text to natural sounding speech using advanced AI voices.
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
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row border-b border-gray-200">
              {/* Status Bar - Now takes full width on mobile, half on desktop */}
              <div className={`px-6 py-4 flex-1 ${status === 'idle' ? 'bg-gray-50' :
                status === 'processing' ? 'bg-amber-50' :
                  'bg-green-50'} transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {status === 'idle' ? 'Ready for text input' :
                      status === 'processing' ? 'Generating speech...' :
                        'Speech ready to play!'}
                  </span>
                  {status === 'processing' && (
                    <div className="ml-2 animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8">
            {/* Instructions */}
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  contents={msg}
                />
              ))
            ) : (
              <div className="prose prose-sm text-gray-600 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">How it works:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Type or paste your text in the input box below</li>
                  <li>Select your preferred voice and settings</li>
                  <li>Click the convert button</li>
                  <li>Play or download your generated speech</li>
                </ol>
              </div>
            )}



            {/* Text Input */}
            <div className="mb-6 p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Text</label>
              <textarea
                rows="2"
                className="w-full border-2 rounded-md p-3 border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Type or paste the text you want to convert to speech..."
                value={text}
                onKeyDown={handleKeyDown}
                onChange={
                  (e) => setText(e.target.value)
                }
                disabled={isProcessing}
              />
            </div>

            {/* Convert Button */}
            <div className="flex justify-center">
              <button
                onClick={() => handleTextInput(text)}
                disabled={!text || isProcessing}
                className={`flex items-center justify-center px-6 py-3 rounded-full text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 
                ${!text || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-300'}`}
              >
                <FaMagic className="h-5 w-5 mr-2" />
                <span className="text-lg font-semibold">Convert to Speech</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Your text is processed securely and never stored permanently.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TTSPage;
