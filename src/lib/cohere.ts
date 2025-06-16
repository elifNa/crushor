import axios from "axios";

const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;

type TranslationMode = 'honest' | 'savage' | 'soft' | 'chaotic';

const modePrompts = {
  honest: "You are a brutally honest AI that translates what people really mean when they text. Be direct and realistic about their intentions.",
  savage: "You are a savage AI that roasts people's texting habits. Be brutally honest and a bit mean about what they really meant.",
  soft: "You are a gentle AI that gives the most optimistic interpretation of what someone meant in their text. Be kind and hopeful.",
  chaotic: "You are a chaotic AI that gives wild, unpredictable interpretations of what someone meant. Be random and funny."
};

export async function fetchCohereTranslation(inputText: string, mode: TranslationMode): Promise<string> {
  if (!COHERE_API_KEY) {
    console.error("Cohere API key is missing");
    return "API key not configured. Please add your Cohere API key.";
  }

  const systemPrompt = modePrompts[mode];
  const prompt = `${systemPrompt}

Original message: "${inputText}"

What they really meant (respond in one sentence):`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: prompt,
        max_tokens: 100,
        temperature: mode === 'chaotic' ? 1.2 : 0.8,
        stop_sequences: ["\n"],
        return_likelihoods: "NONE"
      },
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.generations[0].text.trim();
    return result || "Hmm... couldn't decode that. Try again!";
  } catch (error) {
    console.error("Cohere API error:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
    }
    return "Something went wrong with the translation. Please try again.";
  }
}