# Global Translator

A beautifully designed, modern web application that allows users to instantly smash language barriers. Built natively with **React JS** and styled using **Tailwind CSS**, this sleek interface offers blazing fast translation utilizing rapid third-party APIs.

## 🚀 Smart Features
- **🌍 Auto Language Detection:** Intelligently detects the source language on-the-fly.
- **🎙️ Voice Input Control:** Speaks directly into the browser utilizing native Web Speech-to-Text Recognition APIs.
- **🔊 Voice Output (Read Aloud):** Automatically reads translated text with native Text-to-Speech synthesis in fluid, native accents.
- **📸 Image-to-Text (OCR):** Upload photos of text to instantly extract the words directly into the translator using RapidAPI's Optical Character Recognition.
- **✨ Pure React Architecture:** Built natively with zero external bloat. Completely stripped of heavy NPM libraries like Axios, Lucide, or external OCR binaries—meaning ultra-fast load times!

## ⚙️ How to Setup locally

### 1. Requirements
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install the Vite react framework dependencies:
```bash
npm install
```

### 3. API Key Configuration
This application hooks securely into **RapidAPI** for its cloud processing. 
1. Create a `.env` file in the root directory (you can copy `.env.example`).
2. Add your RapidAPI Translation Key and RapidAPI OCR Key:
```env
VITE_RAPIDAPI_KEY=your_key_here
VITE_RAPIDAPI_HOST=google-api31.p.rapidapi.com
VITE_RAPIDAPI_URL=https://google-api31.p.rapidapi.com/translate

VITE_RAPIDAPI_OCR_KEY=your_key_here
VITE_RAPIDAPI_OCR_HOST=ocr-extract-text.p.rapidapi.com
VITE_RAPIDAPI_OCR_URL=https://ocr-extract-text.p.rapidapi.com/ocr/extract-text
```

### 4. Running the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/` inside your favorite browser!

---
> *#JustCodeError#*
