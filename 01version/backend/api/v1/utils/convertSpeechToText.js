import { FormData } from "formdata-node";
import { Blob } from "fetch-blob";
import { model } from "mongoose";

const API_SECRET = process.env.API_KEY;
const SARVAM_API_URL = "https://api.sarvam.ai/speech-to-text";

/**
 * Converts audio buffer to text using Sarvam AI API
 * @param {Object} audioFile - File object containing buffer, mimetype, and originalname
 * @param {Object} options - Optional parameters
 * @param {string} options.model - Model to use (default: 'saarika:v2')
 * @param {string} options.languageCode - Language code (default: 'unknown')
 * @returns {Promise<Object>} - API response data
 * @throws {Error} - If conversion fails
 */
export const convertSpeechToText = async (audioFile, options = {}) => {
  console.log("options are: ", options);
  const { source_language } = options;

  const languageCode = source_language;

  // console.log("Language code:", languageCode);
  const model = options.model || "saarika:v2";

  if (!audioFile?.buffer) {
    throw new Error("Missing audio file buffer");
  }

  console.log(languageCode, model);

  if (!API_SECRET) {
    throw new Error("API_SECRET is not configured");
  }

  const { buffer, mimetype, originalname } = audioFile;

  console.log(
    "Processing audio file:",
    originalname,
    "with mimetype:",
    mimetype
  );
  console.log("Audio buffer length:", buffer.length);

  // Prepare form data
  const formData = new FormData();
  const blob = new Blob([buffer], { type: mimetype });

  formData.set("file", blob, originalname || "audio.wav");
  formData.set("model", model);
  formData.set("language_code", languageCode);

  try {
    const response = await fetch(SARVAM_API_URL, {
      method: "POST",
      headers: {
        "api-subscription-key": API_SECRET,
        ...formData.headers,
      },
      body: formData,
    });

    const data = await response.json();
    // console.log("API response data:", data);

    if (!response.ok) {
      throw new Error(
        data.message || `Speech-to-text failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("Error in speech-to-text conversion:", error);
    throw error;
  }
};
