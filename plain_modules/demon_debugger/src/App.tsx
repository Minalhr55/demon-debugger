import React, { useState } from 'react';
import { GameState, Language, Demon } from './types';
import StartScreen from './components/StartScreen';
import BattleScreen from './components/BattleScreen';
import ResultScreen from './components/ResultScreen';
import FinalScreen from './components/FinalScreen';
import { DEMONS } from './data/demons';
import { summonAiDemon } from './services/aiSummon';
import './index.css';

const INITIAL_STATE: GameState = {
  language: null,
  index: 0,
  hearts: 3,
  score: 0,
  demonsDefeated: 0,
  combo: 0,
  bestCombo: 0,
  lastAnswerCorrect: null,
  screen: "start",
  aiDemon: null
};

export const playSound = (event: string) => {
  try {
    const audio = new Audio(`/sounds/${event}.mp3`);
    audio.play().catch(err => {
      console.warn(`Audio Playback blocked or failed for event: ${event}`, err);
    });
  } catch (error) {
    console.error(`Sound System Error: Failed to initialize audio for ${event}.`, error);
  }
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isSummoning, setIsSummoning] = useState(false);

  const currentRoster: Demon[] = gameState.language 
    ? DEMONS.filter(d => d.language === gameState.language)
    : [];

  const selectLanguage = (language: Language) => {
    playSound('start');
    setGameState((prev) => ({
      ...prev,
      language,
      hearts: 3,
      score: 0,
      combo: 0,
      index: 0,
      aiDemon: null,
      screen: "battle"
    }));
  };

  const handleAiSummon = async (language: Language) => {
    setIsSummoning(true);
    playSound('select');
    try {
      const demon = await summonAiDemon(language);
      setGameState((prev) => ({
        ...prev,
        language,
        hearts: 3,
        score: 0,
        combo: 0,
        index: 0,
        aiDemon: demon,
        screen: "battle"
      }));
    } catch (error) {
      console.error("Critical summon failure in App controller", error);
    } finally {
      setIsSummoning(false);
    }
  };

  const handleBattleResult = (correct: boolean) => {
    const currentDemon = gameState.aiDemon || currentRoster[gameState.index];
    
    if (!currentDemon) {
      console.error("App Error: Reference to missing entity during result calculation.");
      return;
    }

    setGameState(prev => {
      const newHearts = correct ? prev.hearts : prev.hearts - 1;
      const newCombo = correct ? prev.combo + 1 : 0;
      let scoreGain = correct ? currentDemon.points : 0;
      if (correct && newCombo >= 3) {
        scoreGain += Math.floor(currentDemon.points / 2);
      }

      return {
        ...prev,
        lastAnswerCorrect: correct,
        screen: "result",
        hearts: newHearts,
        score: prev.score + scoreGain,
        demonsDefeated: correct ? prev.demonsDefeated + 1 : prev.demonsDefeated,
        combo: newCombo,
        bestCombo: Math.max(prev.bestCombo, newCombo)
      };
    });
  };

  const handleNext = () => {
    playSound('select');
    setGameState(prev => {
      const isDead = prev.hearts <= 0;
      // If AI demon, there is no "next" in the roster, go to final after defeat or success
      const isAiFinished = !!prev.aiDemon && prev.lastAnswerCorrect;
      const isRosterComplete = prev.lastAnswerCorrect && (prev.index + 1 >= currentRoster.length);

      if (isDead || isAiFinished || isRosterComplete) {
        return { ...prev, screen: "final" };
      }

      return { 
        ...prev, 
        index: prev.lastAnswerCorrect ? prev.index + 1 : prev.index, 
        screen: "battle",
        lastAnswerCorrect: null 
      };
    });
  };

  const resetGame = () => {
    playSound('select');
    setGameState(INITIAL_STATE);
  };

  const renderScreen = () => {
    try {
      const activeDemon = gameState.aiDemon || currentRoster[gameState.index];

      switch (gameState.screen) {
        case "start":
          return <StartScreen onStart={selectLanguage} onAiSummon={handleAiSummon} isSummoning={isSummoning} />;
        case "battle":
          if (!activeDemon) throw new Error("Exorcism Target Missing.");
          return <BattleScreen gameState={gameState} demon={activeDemon} onResult={handleBattleResult} />;
        case "result":
          if (!activeDemon) throw new Error("Summary Error.");
          return <ResultScreen gameState={gameState} demon={activeDemon} onNext={handleNext} />;
        case "final":
          return <FinalScreen gameState={gameState} onRestart={resetGame} />;
        default:
          throw new Error("Critical Reality Failure.");
      }
    } catch (error) {
      return (
        <div className="card error-boundary" style={{ border: '2px solid #ff4a4a', padding: '2rem', background: '#1a0f0f', color: '#fff' }}>
          <h2>Critical Exception</h2>
          <pre>{error instanceof Error ? error.message : "Unknown Error"}</pre>
          <button onClick={resetGame}>Return to Sanctum</button>
        </div>
      );
    }
  };

  return <div className="app-container">{renderScreen()}</div>;
};

export default App;