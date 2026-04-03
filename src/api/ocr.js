const RAPIDAPI_OCR_KEY = import.meta.env.VITE_RAPIDAPI_OCR_KEY;
const RAPIDAPI_OCR_HOST = import.meta.env.VITE_RAPIDAPI_OCR_HOST;
const RAPIDAPI_OCR_URL = import.meta.env.VITE_RAPIDAPI_OCR_URL;

export const extractTextFromImage = async (imageFile) => {
  if (!imageFile) return '';
  if (RAPIDAPI_OCR_KEY === 'ENTER_YOUR_OCR_RAPIDAPI_KEY') {
    throw new Error('Please configure an OCR API in src/api/ocr.js to use this feature.');
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

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'OCR API returned an error');
    }

    const extractedText =
      responseData?.ParsedResults?.[0]?.ParsedText ||
      responseData?.text ||
      responseData?.data?.text ||
      JSON.stringify(responseData);

    return extractedText;
  } catch (error) {
    console.error(error);
    throw new Error(error.message || 'Image extraction failed.');
  }
};
