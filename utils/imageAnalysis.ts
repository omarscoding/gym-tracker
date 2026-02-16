import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error(
    'Missing EXPO_PUBLIC_GEMINI_API_KEY. Ensure it is set in your .env file.',
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface AnalysisResult {
  isGymEquipment: boolean;
  label: string;
  confidence: string;
}

/**
 * Analyze a photo to detect if it contains a dumbbell or gym equipment.
 * Uses Google Gemini Vision to classify the image.
 * Accepts base64-encoded image data directly.
 */
export async function analyzePhoto(base64Data: string): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      },
      {
        text: `You are a gym equipment detector. Analyze this image and determine if it contains a dumbbell or other gym/workout equipment (barbell, kettlebell, weight plate, resistance band, bench press, cable machine, treadmill, etc.).

Respond ONLY with a JSON object in this exact format, no markdown, no code fences:
{"isGymEquipment": true/false, "label": "name of equipment or 'none'", "confidence": "high/medium/low"}`,
      },
    ]);

    const responseText = result.response.text().trim();

    // Parse the JSON response, stripping any markdown fences if present
    const cleaned = responseText
      .replaceAll(/```json\s*/gi, '')
      .replaceAll(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as AnalysisResult;
    console.log('Image analysis result:', parsed);
    return parsed;
  } catch (error) {
    console.error('Image analysis failed:', error);
    // On error, default to not detected so streak doesn't falsely increment
    return {
      isGymEquipment: false,
      label: 'error',
      confidence: 'low',
    };
  }
}
