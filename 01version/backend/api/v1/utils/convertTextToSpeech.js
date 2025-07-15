import { translateText } from "./translateText.js";

const API_SECRET = process.env.API_KEY;
const SARVAM_TTS_API_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Converts text to speech using Sarvam AI API
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Optional parameters
 * @param {string} options.target_language_code - Target language code (required)
 * @param {string} options.model - model type (default bulbul:v2 , bulbul:v1)
 * @param {string} options.speaker - Speaker name (optional, default is 'abhilash' in our case)
 * @returns {Promise<Object>} - API response data with audios array
 * @throws {Error} - If conversion fails
 */
export const convertTextToSpeech = async (text, options = {}) => {
  const { target_language_code,
		model='bulbul:v2',
    speaker = speaker || 'abhilash',  // Default speaker
    source_language_code
	} = options;

  // Validate required parameters
  if (!text) {
    throw new Error('Text is required for text-to-speech conversion');
  }

  if (!target_language_code) {
    throw new Error('Target language code is required');
  }

  if (!API_SECRET) {
    throw new Error('API_SECRET is not configured');
  }

  const translatedText = () => {
    try {
      console.log(text, target_language_code);
      return translateText(text, target_language_code);
    } catch (error) {
      console.error("Error in text translation:", error);
      throw error;
    }
  }

  console.log("Translating text before TTS conversion...");
  const translated = await translatedText();

  text = translated.translation || text; // Use translated text if available

  console.log("Translated text:", text.substring(0, 100) + "...");
  if (!text) {
    throw new Error("Translation failed or returned empty text");
  }

  console.log("Converting text to speech:", text.substring(0, 100) + "...");
  console.log("Target language:", target_language_code);

  // Prepare request payload
  const requestBody = {
    text,
    target_language_code,
    speaker,
		model,
//    ...additionalOptions // Allow for future API parameters
  };

  try {
    const response = await fetch(SARVAM_TTS_API_URL, {
      method: 'POST',
      headers: {
        'api-subscription-key': API_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Text-to-speech failed with status ${response.status}: ${errorText}`);
    }

    const ttsResult = await response.json();
    console.log("TTS API response received");

    // Validate response structure
    if (!ttsResult.audios || !Array.isArray(ttsResult.audios)) {
      throw new Error('Invalid TTS response structure - missing or invalid audios array');
    }

    return {
      request_id: ttsResult.request_id || 'unknown',
      audios: ttsResult.audios,
    };

  } catch (error) {
    console.error("Error in text-to-speech conversion:", error);
    throw error;
  }
};
