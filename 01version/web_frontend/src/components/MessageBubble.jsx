import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaDownload } from 'react-icons/fa';

const MessageBubble = ({ contents }) => {
  const { role, contentType, content, isError, text } = contents;
  const [audio, setAudio] = useState(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [waveHeights, setWaveHeights] = useState([10, 10, 10, 10, 10]);
  const [isDownloading, setIsDownloading] = useState(false);
  const animationRef = useRef(null);
  const lastTap = useRef(0);
  const doubleTapDelay = 300;

  useEffect(() => {
    if (contentType === 'audio' && content) {
      const audioObj = new Audio("data:audio/wav;base64," +content[0]);
      setAudio(audioObj);
      setIsAudioLoaded(true);

      audioObj.addEventListener('ended', () => setIsAudioPlaying(false));
      return () => {
        audioObj.pause();
        audioObj.removeEventListener('ended', () => setIsAudioPlaying(false));
      };
    } else {
      setAudio(null);
      setIsAudioLoaded(false);
    }
  }, [content, contentType]);

  useEffect(() => {
    if (audio) {
      animationRef.current = setInterval(() => {
        if (isAudioPlaying) {
          setWaveHeights(Array(5).fill(0).map(() => Math.random() * 20 + 5));
        } else {
          setWaveHeights([10, 10, 10, 10, 10]);
        }
      }, 80);

      return () => clearInterval(animationRef.current);
    }
  }, [isAudioPlaying, audio]);

  const playSound = () => {
    if (!audio || !isAudioLoaded) return;
    try {
      audio.currentTime = 0;
      audio.play().then(() => setIsAudioPlaying(true)).catch((error) => {
        console.error('Error playing audio:', error);
        setIsAudioPlaying(false);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseSound = () => {
    if (audio) {
      audio.pause();
      setIsAudioPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isAudioPlaying) {
      pauseSound();
    } else {
      playSound();
    }
  };

  const handleDownload = async () => {
    if (!content) {
      alert('No audio content provided.');
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = content.split('/').pop() || 'downloaded_audio.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      alert('Download Complete: Audio has been saved.');
    } catch (error) {
      console.error('Error downloading audio:', error);
      alert(`Download Failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleTextPress = () => {
    const now = Date.now();
    if (now - lastTap.current < doubleTapDelay) {
      handleCopyText();
    }
    lastTap.current = now;
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Message copied to clipboard.');
      }).catch((error) => {
        console.error('Error copying text:', error);
        alert('Failed to copy text.');
      });
    }
  };

  const bubbleClasses = `
    w-auto p-4 rounded-lg flex items-center
    ${role === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-purple-100 text-purple-900'}
    ${isError ? 'bg-red-100 text-red-900' : ''}
    shadow-sm transition-all duration-200
  `;

  const renderAudioPlayer = () => (
    <div className="flex items-center justify-between w-full min-w-[180px] py-1">
      <button
        onClick={togglePlayPause}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          ${role === 'user' ? 'bg-white/25' : 'bg-indigo-500/15'}
          text-indigo-600 hover:text-indigo-800 focus:outline-none
        `}
      >
        {isAudioPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
      </button>
      <div className="flex items-center justify-between flex-1 mx-2 h-[30px]">
        {waveHeights.map((height, i) => (
          <div
            key={i}
            className={`
              w-1 rounded
              ${role === 'user' ? 'bg-white' : 'bg-indigo-600'}
              ${isAudioPlaying ? 'opacity-100' : 'opacity-60'}
            `}
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      <button
        onClick={handleDownload}
        className={`
          w-9 h-9 rounded-full flex items-center justify-center
          ${role === 'user' ? 'bg-white/25' : 'bg-indigo-500/15'}
          text-indigo-600 hover:text-indigo-800 focus:outline-none
          ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={isDownloading}
      >
        <FaDownload size={18} />
      </button>
    </div>
  );

  return (
    <div
      className={`
        max-w-[40%]  my-2
        ${role === 'user' ? 'ml-auto mr-3 items-end' : 'mr-auto ml-3 items-start'}
      `}
    >
      <div
        onClick={contentType === 'text' ? handleTextPress : undefined}
        className={bubbleClasses}
        style={{ cursor: contentType === 'text' ? 'pointer' : 'default' }}
      >
        {isError ? (
          <span className="text-lg text-center font-medium">{text}</span>
        ) : contentType === 'text' ? (
          <span className="text-lg font-medium">{text}</span>
        ) : (
          renderAudioPlayer()
        )}
      </div>
    </div>
  );
};

export default MessageBubble;