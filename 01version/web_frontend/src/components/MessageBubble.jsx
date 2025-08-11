import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaDownload } from 'react-icons/fa';

// MessageBubble component displays text or audio messages with different styling based on role
const MessageBubble = ({ contents }) => {
  const { role, contentType, content, isError, text } = contents;
  const [audioElement, setAudioElement] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState([10, 10, 10, 10, 10]);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const animationFrameRef = useRef(null);
  const lastTapTime = useRef(0);
  const DOUBLE_TAP_DELAY = 300; // Time in ms for double-tap detection

  // Initialize audio element based on content type and role
  useEffect(() => {
    if (contentType === 'audio' && content) {
      const audioSrc = role === 'api' ? `data:audio/wav;base64,${content}` : content;
      const newAudio = new Audio(audioSrc);
      setAudioElement(newAudio);
      setIsAudioReady(true);

      newAudio.addEventListener('ended', () => setIsPlaying(false));
      return () => {
        newAudio.pause();
        newAudio.removeEventListener('ended', () => setIsPlaying(false));
      };
    } else {
      setAudioElement(null);
      setIsAudioReady(false);
    }
  }, [content, contentType, role]);

  // Animate waveform when audio is playing
  useEffect(() => {
    if (audioElement) {
      animationFrameRef.current = setInterval(() => {
        if (isPlaying) {
          setWaveformHeights(Array(5).fill(0).map(() => Math.random() * 20 + 5));
        } else {
          setWaveformHeights([10, 10, 10, 10, 10]);
        }
      }, 80);

      return () => clearInterval(animationFrameRef.current);
    }
  }, [isPlaying, audioElement]);

  // Play audio from the beginning
  const playAudio = () => {
    if (!audioElement || !isAudioReady) return;
    try {
      audioElement.currentTime = 0;
      audioElement.play().then(() => setIsPlaying(true)).catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Pause audio playback
  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // Toggle between play and pause
  const toggleAudio = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  // Download audio file
  const downloadAudio = async () => {
    if (!content) {
      alert('No audio content provided.');
      return;
    }

    setIsDownloadingAudio(true);
    try {
      let blob;
      let filename = `audio_message_${new Date().toISOString().slice(0, 10)}.wav`;

      if (role === 'api') {
        // Convert base64 string to Blob for API audio
        const byteCharacters = atob(content);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        blob = new Blob([byteNumbers], { type: 'audio/wav' });
      } else {
        // Fetch user-uploaded audio
        const response = await fetch(content);
        blob = await response.blob();

        // Extract filename from URL if available
        const urlParts = content.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.includes('.')) {
          filename = lastPart.split('?')[0];
        }
      }

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert(`Download Failed: ${error.message}`);
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  // Handle double-tap to copy text
  const handleTextClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastTapTime.current < DOUBLE_TAP_DELAY) {
      copyTextToClipboard();
    }
    lastTapTime.current = currentTime;
  };

  // Copy text to clipboard
  const copyTextToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Message copied to clipboard.');
      }).catch((error) => {
        console.error('Error copying text:', error);
        alert('Failed to copy text.');
      });
    }
  };

  // Define bubble styles based on role and error state
  const getBubbleStyles = () => {
    let baseStyles = `
      p-4 rounded-lg flex items-center
      shadow-sm transition-all duration-200
    `;
    if (contentType === 'text') {
      baseStyles += ' inline-block'; // Make text bubble wrap content
    } else {
      baseStyles += ' w-auto'; // Keep audio bubble width auto
    }
    baseStyles += role === 'user' ? ' bg-indigo-100 text-indigo-900' : ' bg-purple-100 text-purple-900';
    if (isError) {
      baseStyles += ' bg-red-100 text-red-900';
    }
    return baseStyles;
  };

  // Render audio player UI
  const renderAudioPlayer = () => (
    <div className="flex items-center justify-between w-full min-w-[180px] py-1">
      <button
        onClick={toggleAudio}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          ${role === 'user' ? 'bg-white/25' : 'bg-indigo-500/15'}
          text-indigo-600 hover:text-indigo-800 focus:outline-none
        `}
      >
        {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
      </button>
      <div className="flex items-center justify-between flex-1 mx-2 h-[30px]">
        {waveformHeights.map((height, index) => (
          <div
            key={index}
            className={`
              w-1 rounded
              ${role === 'user' ? 'bg-white' : 'bg-indigo-600'}
              ${isPlaying ? 'opacity-100' : 'opacity-60'}
            `}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      <button
        onClick={downloadAudio}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          ${role === 'user' ? 'bg-white/25' : 'bg-indigo-500/15'}
          text-indigo-600 hover:text-indigo-800 focus:outline-none
          ${isDownloadingAudio ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={isDownloadingAudio}
      >
        <FaDownload size={18} />
      </button>
    </div>
  );

  return (
    <div
      className={`
        my-2
        ${role === 'user' ? 'ml-auto mr-3 items-end' : 'mr-auto ml-3 items-start'}
        ${contentType === 'text' ? 'max-w-[80%] sm:max-w-[60%]' : 'max-w-[50%]'}
      `}
    >
      <div className={`
          flex 
          ${role === 'user' ? 'justify-end' : 'justify-start'}
        `}>
        <div
          onClick={contentType === 'text' ? handleTextClick : undefined}
          className={getBubbleStyles()}
          style={{ cursor: contentType === 'text' ? 'pointer' : 'default' }}
        >
          {isError ? (
            <span className="text-lg font-medium">{text}</span>
          ) : contentType === 'text' ? (
            <span className="text-lg font-medium">{text}</span>
          ) : (
            renderAudioPlayer()
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;