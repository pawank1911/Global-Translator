import { getApiErrorMessage, parseApiResponse } from './response';

const RAPIDAPI_OCR_KEY = import.meta.env.VITE_RAPIDAPI_OCR_KEY;
const RAPIDAPI_OCR_HOST = import.meta.env.VITE_RAPIDAPI_OCR_HOST;
const RAPIDAPI_OCR_URL = import.meta.env.VITE_RAPIDAPI_OCR_URL;

export const extractTextFromImage = async (imageFile) => {
  if (!imageFile) return '';
  if (!RAPIDAPI_OCR_KEY || !RAPIDAPI_OCR_HOST || !RAPIDAPI_OCR_URL) {
    throw new Error('Please add your OCR RapidAPI settings to your .env file.');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(RAPIDAPI_OCR_URL, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_OCR_KEY,
        'X-RapidAPI-Host': RAPIDAPI_OCR_HOST
      },
      body: formData
    });

    const { data: responseData, rawBody } = await parseApiResponse(response);

    if (!response.ok) {
      throw new Error(
        getApiErrorMessage({
          response,
          data: responseData,
          rawBody,
          fallbackMessage: 'OCR API returned an error'
        })
      );
    }

    if (!responseData) {
      throw new Error('OCR API returned an empty response.');
    }

    const extractedText =
      responseData?.ParsedResults?.[0]?.ParsedText ||
      responseData?.text ||
      responseData?.data?.text ||
      '';

    if (!extractedText) {
      throw new Error('OCR API response did not contain extracted text.');
    }

    return extractedText;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || 'Image extraction failed.');
  }
};
