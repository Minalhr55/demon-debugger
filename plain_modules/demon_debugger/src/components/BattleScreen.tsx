import React, { useState, useEffect } from 'react';
import { GameState, Demon } from '../types';
import { WEAPONS } from '../data/demons';
import { playSound } from '../App';
import CombatArena from './CombatArena';

interface Props {
  gameState: GameState;
  demon: Demon;
  onResult: (correct: boolean) => void;
}

type InteractionState = "initial" | "executing" | "patched";

const BattleScreen: React.FC<Props> = ({ gameState, demon, onResult }) => {
  const [interactionState, setInteractionState] = useState<InteractionState>("initial");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnimatingCorrect, setIsAnimatingCorrect] = useState<boolean>(false);
  const [isAnimatingIncorrect, setIsAnimatingIncorrect] = useState<boolean>(false);
  const [showPoints, setShowPoints] = useState<number | null>(null);

  useEffect(() => {
    setInteractionState("initial");
    setSelectedOptionId(null);
    setIsAnimatingCorrect(false);
    setIsAnimatingIncorrect(false);
    setShowPoints(null);
  }, [demon.id]);

  const weapon = WEAPONS.find(w => w.language === gameState.language);
  const weaponName = weapon ? weapon.weaponName : "Bare Hands";
  const totalSteps = 10; 

  const handleRunCode = () => {
    playSound('select');
    setInteractionState("executing");
    setTimeout(() => {
      setInteractionState("patched");
    }, 800);
  };

  const handleSelectOption = (id: string) => {
    playSound('select');
    setSelectedOptionId(id);
  };

  const handleStrike = () => {
    if (!selectedOptionId) {
      console.warn("BattleScreen: handleStrike called without a selected option.");
      return;
    }

    const isCorrect = selectedOptionId === demon.correctOptionId;
    
    if (isCorrect) {
      playSound('hit');
      setIsAnimatingCorrect(true);
      setShowPoints(demon.points);
      setTimeout(() => onResult(true), 1000);
    } else {
      playSound('hurt');
      setIsAnimatingIncorrect(true);
      setTimeout(() => onResult(false), 1000);
    }
  };

  const isBusy = isAnimatingCorrect || isAnimatingIncorrect;

  return (
    <div className={`card battle-container ${(isAnimatingCorrect || isAnimatingIncorrect) ? 'animate-shake' : ''}`} 
         style={{ maxWidth: '1000px', position: 'relative', overflow: 'hidden' }}>
      
      {isAnimatingCorrect && <div className="impact-flash" />}

      <div className="status-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--accent-purple)', marginBottom: '10px', fontSize: '0.9rem' }}>
        <div className="status-left">
          <span className="weapon-label" style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{weaponName.toUpperCase()}</span>
          {gameState.combo >= 2 && <span className="combo-tag" style={{ marginLeft: '15px', color: '#ffd700' }}>COMBO x{gameState.combo}</span>}
        </div>
        <div className="status-center"><span style={{ color: 'var(--accent-red)', fontSize: '1.2rem' }}>{'❤️'.repeat(Math.max(0, gameState.hearts))}</span></div>
        <div className="status-right" style={{ fontWeight: 'bold' }}>SCORE: <span style={{ color: 'var(--accent-purple)' }}>{gameState.score}</span></div>
      </div>

      <div className="dungeon-path" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`path-node ${i === gameState.index ? 'active' : ''} ${i < gameState.index ? 'cleared' : ''}`} style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--accent-purple)', background: i === gameState.index ? 'var(--accent-red)' : i < gameState.index ? 'var(--accent-purple)' : 'transparent' }} />
        ))}
      </div>

      <CombatArena 
        demon={demon}
        isAnimatingCorrect={isAnimatingCorrect}
        isAnimatingIncorrect={isAnimatingIncorrect}
        showPoints={showPoints}
      />

      <div className="terminal-window" style={{ background: '#000', padding: '15px', borderRadius: '4px', borderLeft: '4px solid var(--accent-purple)', marginBottom: '20px', textAlign: 'left' }}>
        <pre style={{ color: '#d1d1d1', fontSize: '0.9rem', margin: '0 0 15px 0', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{demon.codeSnippet}</pre>
        {interactionState === "initial" && <button onClick={handleRunCode}>&gt; Run the Code</button>}
        {interactionState === "executing" && <div style={{ color: 'var(--accent-purple)', fontStyle: 'italic' }}>executing ritual...</div>}
        {interactionState === "patched" && (
          <div>
            <div style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>[TERMINAL OUTPUT]</div>
            <div style={{ color: '#ffaaaa', fontFamily: 'var(--font-mono)' }}>{demon.simulationFailOutput}</div>
          </div>
        )}
      </div>

      {interactionState === "patched" && (
        <div className="options-container">
          <div className="options-grid" style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
            {demon.options.map((option) => (
              <button 
                key={option.id}
                disabled={isBusy}
                className={`option-btn ${selectedOptionId === option.id ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option.id)}
                style={{ textAlign: 'left', padding: '15px', background: selectedOptionId === option.id ? 'rgba(157, 80, 187, 0.3)' : 'var(--panel-bg)' }}
              >
                <span style={{ color: 'var(--accent-purple)', marginRight: '10px' }}>{selectedOptionId === option.id ? '●' : '○'} [PATCH]</span>
                {option.text}
              </button>
            ))}
          </div>
          <button className="strike-btn" onClick={handleStrike} disabled={!selectedOptionId || isBusy} style={{ width: '100%', padding: '15px', border: '2px solid var(--accent-red)', opacity: (selectedOptionId && !isBusy) ? 1 : 0.4 }}>
            {isAnimatingCorrect ? 'EXORCISING...' : isAnimatingIncorrect ? 'DEFLECTED!' : 'APPLY PATCH & STRIKE'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleScreen;