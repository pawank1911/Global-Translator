import { getApiErrorMessage, parseApiResponse } from './response';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const RAPIDAPI_URL = import.meta.env.VITE_RAPIDAPI_URL;

export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  if (!text.trim()) return '';
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !RAPIDAPI_URL) {
    throw new Error('Please add your translation RapidAPI settings to your .env file.');
  }

  const payload = {
    text: text,
    to: targetLanguage
  };

  if (sourceLanguage && sourceLanguage !== 'auto') {
    payload.from_lang = sourceLanguage;
  }

  try {
    const response = await fetch(RAPIDAPI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      },
      body: JSON.stringify(payload)
    });

    const { data: responseData, rawBody } = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(
        getApiErrorMessage({
          response,
          data: responseData,
          rawBody,
          fallbackMessage: 'Translation API returned an error'
        })
      );
    }

    if (!responseData) {
      throw new Error('Translation API returned an empty response.');
    }

    const translatedText =
      responseData?.[0]?.translated ||
      responseData?.data?.translations?.[0]?.translatedText ||
      responseData?.[0]?.translations?.[0]?.text ||
      responseData?.translatedText ||
      '';

    if (!translatedText) {
      throw new Error('Translation API response did not contain translated text.');
    }

    return translatedText;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || 'Translation failed. Please check your API key & setup.');
  }
};
