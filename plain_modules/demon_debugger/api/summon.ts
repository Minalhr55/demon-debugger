import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { language } = request.body;
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    // Defensive check for production environment variables
    if (!apiKey || apiKey === 'your_api_key_here') {
      return response.status(500).json({ 
        error: "API Key missing or invalid on server.",
        details: "AI Summoning requires a valid GOOGLE_GEMINI_API_KEY."
      });
    }

    // Note: In a live production environment, we would use fetch() to call 
    // the Gemini API: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
    
    // Simulating logic for the demonstration as per the established project behavior
    const mockAiResponse = {
      id: `ai-${Math.random().toString(36).substr(2, 9)}`,
      name: "Void Pointer Wraith",
      title: "Eater of Unallocated Souls",
      bugCategory: "Memory",
      difficulty: "medium",
      language: language,
      spriteId: "demon_ai_generic.png",
      codeSnippet: language === 'c' ? "int *p;\n*p = 10;" : "let x;\nconsole.log(x.value);",
      buggyLineIndex: 1,
      options: [
        { id: "opt-1", text: "Allocate memory before use" },
        { id: "opt-2", text: "Declare as a constant" },
        { id: "opt-3", text: "Ignore the warning" }
      ],
      correctOptionId: "opt-1",
      terminalAnswer: "Success",
      simulationFailOutput: "Segmentation Fault (core dumped)",
      simulationPassOutput: "Memory Stabilized.",
      explanation: "The pointer was dereferenced before pointing to a valid memory address.",
      lore: "It haunts the unmapped regions of the heap, waiting for a stray reference.",
      points: 20
    };

    return response.status(200).json(mockAiResponse);
  } catch (err: any) {
    return response.status(500).json({ 
      error: "Internal Summoning Error", 
      details: err.message 
    });
  }
}