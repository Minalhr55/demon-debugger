import { Demon, Language } from '../types';
import { DEMONS } from '../data/demons';

/**
 * Executes the :AiSummon: feature.
 * Requests a new demon from the serverless endpoint.
 * Implements defensive fallback to :DemonData: on any failure.
 */
export async function summonAiDemon(language: Language): Promise<Demon> {
  try {
    const response = await fetch('/api/summon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Defensive check: Ensure the returned data has the required Demon structure
    if (!data.id || !data.codeSnippet || !data.correctOptionId) {
      throw new Error("Invalid Demon schema received from :AiSummon: endpoint.");
    }

    return data as Demon;
  } catch (error) {
    console.error(
      `[:AiSummon: Error] Failed to summon AI demon. Falling back to local grimoire. ` +
      `Error Detail: ${error instanceof Error ? error.message : String(error)}`
    );
    
    // Fallback: Return a random demon from existing :DemonData: matching the language
    const localRoster = DEMONS.filter(d => d.language === language);
    const randomIndex = Math.floor(Math.random() * localRoster.length);
    return localRoster[randomIndex];
  }
}