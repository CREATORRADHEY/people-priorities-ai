import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
// We use a fallback key to prevent initialization crash if the environment variable is not set.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || 'mock_api_key';

let model: any = null;

try {
  const ai = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-flash as specified in SDD_00/AI architecture
  model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
} catch (error) {
  console.error('Failed to initialize Gemini SDK:', error);
}

export { model };
