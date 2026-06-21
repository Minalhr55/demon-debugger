export type Language = "javascript" | "python" | "java" | "c";

export type GameScreen = "start" | "battle" | "result" | "final";

export interface Weapon {
  language: Language;
  weaponName: string;
  weaponType: string;
  flavor: string;
}

export interface Demon {
  id: string;
  name: string;
  title: string;
  bugCategory: string;
  difficulty: "easy" | "medium" | "hard";
  language: Language;
  spriteId: string;
  codeSnippet: string;
  buggyLineIndex: number;
  options: { id: string; text: string }[];
  correctOptionId: string;
  terminalAnswer: string;
  simulationFailOutput: string;
  simulationPassOutput: string;
  explanation: string;
  lore: string;
  points: number;
}

export interface GameState {
  language: Language | null;
  index: number;
  hearts: number;
  score: number;
  demonsDefeated: number;
  combo: number;
  bestCombo: number;
  lastAnswerCorrect: boolean | null;
  screen: GameScreen;
  aiDemon?: Demon | null; // Added to support :AiSummon:
}

export type Rank = "Cursed Intern" | "Junior Exorcist" | "Demon Slayer" | "Archmage Debugger";