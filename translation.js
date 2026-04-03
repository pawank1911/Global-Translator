const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;
const RAPIDAPI_URL = import.meta.env.VITE_RAPIDAPI_URL;

export const translateText = async (text, targetLanguage, sourceLanguage = 'auto') => {
  if (!text.trim()) return '';
  if (RAPIDAPI_KEY === 'YOUR_RAPID_API_KEY') {
    throw new Error('Please enter your RapidAPI key in src/api/translation.js');
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

    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.message || responseData.Error || 'Translation API returned an error');
    }

    const translatedText =
      responseData?.[0]?.translated ||
      responseData?.data?.translations?.[0]?.translatedText ||
      responseData?.[0]?.translations?.[0]?.text ||
      responseData?.translatedText ||
      JSON.stringify(responseData);

    return translatedText;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || 'Translation failed. Please check your API key & setup.');
  }
};
