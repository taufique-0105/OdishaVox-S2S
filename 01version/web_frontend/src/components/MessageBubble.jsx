import React from 'react';
import { FaUser, FaRobot, FaPlay, FaPause } from 'react-icons/fa';

function MessageBubble({ contents }) {
  const { role, contentType, content } = contents;

  if (!role || !contentType) {
    return null;
  }

  // Audio player component
  const AudioPlayer = ({ audioSrc }) => {
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const togglePlay = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    };

    return (
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`p-2 rounded-full ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
        >
          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
        </button>
        <span className="text-sm text-gray-500">Audio message</span>
        <audio
          ref={audioRef}
          src={audioSrc.startsWith('data:audio') ? audioSrc : `data:audio/mp3;base64,${audioSrc}`}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      </div>
    );
  };

  // Determine bubble styling based on role
  const isUser = role === 'user';
  const bubbleClasses = `max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
    isUser 
      ? 'bg-blue-500 text-white rounded-br-none ml-auto' 
      : 'bg-gray-200 text-gray-800 rounded-bl-none mr-auto'
  }`;

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-2">
        {/* Avatar */}
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-400' : 'bg-gray-300'
        }`}>
          {isUser ? (
            <FaUser className="text-white text-sm" />
          ) : (
            <FaRobot className="text-gray-600 text-sm" />
          )}
        </div>

        {/* Message bubble */}
        <div className={bubbleClasses}>
          {/* Message content based on type */}
          {contentType === 'text' && (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
          
          {contentType === 'audio' && (
            <AudioPlayer audioSrc={content} />
          )}
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 text-right ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;