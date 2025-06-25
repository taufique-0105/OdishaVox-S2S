import React, { useEffect, useRef, useState } from 'react';
import { FaMagic, FaPaperPlane, FaPause, FaPlay } from 'react-icons/fa';
import MessageBubble from '../components/MessageBubble';

function TTSPage() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [speaker, setSpeaker] = useState('abhilash');
  const [targetLanguage, setTargetLanguage] = useState('en-IN');
  const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState('');

  const audioRef = useRef(null);


  const convertTextToSpeech = async () => {
    const trimmedText = text.trim();
    const API_KEY = `${import.meta.env.VITE_SARVAM_API}/text-to-speech`;
    console.log(`API Key: ${API_KEY}`);
    try {
      setIsProcessing(true);
      setStatus('processing');
      const response = await fetch( API_KEY , {
        method: "POST",
        headers: {
          "api-subscription-key": "8cdff9d2-1180-46c2-86c3-f1b4b0c629d0",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "text": trimmedText,
          "target_language_code": targetLanguage,
          "speaker": speaker,
          "pace": 0.8
        })
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(`Error: ${body.message || 'Failed to convert text to speech'}`);
      }

      setAudioUrl(body.audios[0]);

      // console.log(body);
      // console.log(body.audios[0])
      audioResponseMessage(body.audios[0]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
      if (text) {
        setStatus('ready');
      } else {
        setStatus('idle');
      }
    }
  }

  const audioResponseMessage = (audioy) => {
    setMessages(prevMessages => [...prevMessages, {
      role: 'api',
      contentType: 'audio',
      content: audioy
    }]);
  }

  const textInput = async () => {
    if (!text.trim()) {
      alert('Please enter some text to convert.');
      return;
    }
    setMessages(prevMessages => [...prevMessages, {
      role: 'user',
      contentType: 'text',
      content: text
    }])
    await convertTextToSpeech();
    setText('');
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset audio position
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

              {/* Speaker Selection - Better spacing and alignment */}
              <div className="px-6 py-4 flex-1 border-t md:border-t-0 border-gray-200">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaker Voice
                  </label>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
                    onChange={(e) => setSpeaker(e.target.value)}
                  >
                    <option value="abhilash">Abhilash (Male)</option>
                    <option value="anushka">Anushka (Female)</option>
                    <option value="arya">Arya (Male)</option>
                    <option value="hitesh">Hitesh (Male)</option>
                    <option value="karun">Karun (Male)</option>
                    <option value="manisha">Manisha (Female)</option>
                    <option value="vidya">Vidya (Female)</option>
                  </select>
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
                rows="4"
                className="w-full rounded-md p-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                placeholder="Type or paste the text you want to convert to speech..."
                value={text}
                onChange={
                  (e) => setText(e.target.value)
                }
                disabled={isProcessing}
              />
            </div>

            {/* Convert Button */}
            <div className="flex justify-center">
              <button
                onClick={textInput}
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
