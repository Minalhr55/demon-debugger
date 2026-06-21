import type { VercelRequest, VercelResponse } from '@vercel/node';

// Allowed sprite filenames (must exist in /public/sprites). The AI is told to
// pick ONE of these so summoned demons always have real art.
const SPRITES = [
  "null_pointer_imp.png",
  "boundary_banshee.png",
  "mutation_demon.png",
  "type_coercion_trickster.png",
  "async_wraith.png",
  "infinite_loop_incubus.png",
  "offbyone_imp.png",
];

function randomSprite() {
  return SPRITES[Math.floor(Math.random() * SPRITES.length)];
}

// A safe static fallback demon so the game never breaks if the AI fails.
function fallbackDemon(language: string) {
  return {
    id: `fallback-${Math.random().toString(36).slice(2, 9)}`,
    name: "Null Pointer Nightmare",
    title: "Devourer of the Undefined",
    bugCategory: "Null/Undefined Access",
    difficulty: "easy",
    language,
    spriteId: "null_pointer_imp.png",
    codeSnippet: "function getCity(user) {\n  return user.address.city;\n}",
    buggyLineIndex: 1,
    options: [
      { id: "a", text: "return user.address?.city;" },
      { id: "b", text: "return user.address.city.toUpperCase();" },
      { id: "c", text: "return user.city.address;" },
    ],
    correctOptionId: "a",
    terminalAnswer: "return user.address?.city;",
    simulationFailOutput: "TypeError: Cannot read properties of undefined (reading 'city')",
    simulationPassOutput: "OK -> returned undefined safely",
    explanation:
      "If user has no address, user.address is undefined and reading .city throws. Optional chaining (?.) returns undefined instead of crashing.",
    lore:
      "It dwells in the hollow places where a value should be and is not.",
    points: 10,
  };
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  const language: string = (request.body && request.body.language) || "javascript";
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

  // No key configured -> serve a valid fallback so the game still works.
  if (!apiKey || apiKey === 'your_api_key_here') {
    return response.status(200).json(fallbackDemon(language));
  }

  const sprite = randomSprite();

  const prompt = `You generate ONE original programming bug for a debugging game, in ${language}.
Return ONLY a JSON object (no markdown, no code fences, no commentary) with EXACTLY these fields:
{
  "id": string (unique, kebab-case),
  "name": string (a demon name like "Off-by-One Imp"),
  "title": string (an epic subtitle),
  "bugCategory": one of "Null/Undefined Access","Loop Boundary","Termination","Equality","State Mutation","Async Ordering","Type Error","Scope",
  "difficulty": one of "easy","medium","hard",
  "language": "${language}",
  "spriteId": "${sprite}",
  "codeSnippet": string (2-5 lines of REAL ${language} code containing EXACTLY ONE bug; use \\n for newlines; ASCII only, straight quotes),
  "buggyLineIndex": number (0-based line of the bug),
  "options": array of exactly 3 objects { "id": "a"|"b"|"c", "text": string } where exactly ONE is the correct fix and the other two are plausible but wrong,
  "correctOptionId": "a"|"b"|"c",
  "terminalAnswer": string (the corrected line of code),
  "simulationFailOutput": string (short realistic console output for the BUG in ${language} - must match the language, e.g. JS gives TypeError not segfault),
  "simulationPassOutput": string (short console output once fixed),
  "explanation": string (1-2 plain sentences),
  "lore": string (ONE epic-fantasy-meets-witty sentence),
  "points": number (10 easy, 20 medium, 30 hard)
}
CRITICAL: the bug must be REAL and the correctOptionId must ACTUALLY fix it. The failure output MUST be correct for ${language} (e.g. JavaScript throws TypeError/ReferenceError, Python throws exceptions, C may segfault, Java throws exceptions). Make each bug distinct and creative. Use spriteId exactly "${sprite}".`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;
    const gemResp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 1.0, responseMimeType: "application/json" },
      }),
    });

    if (!gemResp.ok) {
      return response.status(200).json(fallbackDemon(language));
    }

    const data = await gemResp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let demon: any;
    try {
      // strip any stray code fences just in case
      const cleaned = text.replace(/```json|```/g, "").trim();
      demon = JSON.parse(cleaned);
    } catch {
      return response.status(200).json(fallbackDemon(language));
    }

    // Validate required fields; if anything is missing or malformed, fall back.
    const required = [
      "id", "name", "title", "bugCategory", "difficulty", "language",
      "spriteId", "codeSnippet", "buggyLineIndex", "options",
      "correctOptionId", "terminalAnswer", "simulationFailOutput",
      "simulationPassOutput", "explanation", "lore", "points",
    ];
    const valid =
      demon &&
      required.every((k) => demon[k] !== undefined && demon[k] !== null) &&
      Array.isArray(demon.options) &&
      demon.options.length >= 2 &&
      demon.options.some((o: any) => o.id === demon.correctOptionId);

    if (!valid) {
      return response.status(200).json(fallbackDemon(language));
    }

    // Force a known-good sprite regardless of what the model returned.
    if (!SPRITES.includes(demon.spriteId)) {
      demon.spriteId = sprite;
    }
    demon.language = language;

    return response.status(200).json(demon);
  } catch (err: any) {
    // Any network/runtime error -> safe fallback, game continues.
    return response.status(200).json(fallbackDemon(language));
  }
}
