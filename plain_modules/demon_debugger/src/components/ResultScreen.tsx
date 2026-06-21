import React, { useEffect } from 'react';
import { GameState, Demon } from '../types';
import { playSound } from '../App';

interface Props {
  gameState: GameState;
  demon: Demon;
  onNext: () => void;
}

const ResultScreen: React.FC<Props> = ({ gameState, demon, onNext }) => {
  const isCorrect = gameState.lastAnswerCorrect;

  /**
   * Play victory/defeat sounds on mount based on outcome.
   * Implements :codeplain::AdditionalFunctionality:
   */
  useEffect(() => {
    if (isCorrect) {
      playSound('victory');
    } else {
      playSound('defeat');
    }
  }, [isCorrect]);

  if (!demon) {
    return (
      <div className="card">
        <p>The echoes of the battle fade into nothingness.</p>
        <button onClick={onNext}>Continue</button>
      </div>
    );
  }

  const correctOption = demon.options.find(opt => opt.id === demon.correctOptionId);
  const correctFixText = correctOption ? correctOption.text : "Unknown Ritual";

  return (
    <div className="card result-container" style={{ textAlign: 'center', borderTop: `4px solid ${isCorrect ? 'var(--accent-purple)' : 'var(--accent-red)'}`, padding: '40px' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '20px', color: isCorrect ? 'var(--accent-purple)' : 'var(--accent-red)' }}>
        {isCorrect ? "Demon Exorcised" : "The bug grows stronger"}
      </h2>

      <div className="result-lore" style={{ fontStyle: 'italic', color: '#d1d1d1', fontSize: '1.2rem', marginBottom: '25px', padding: '10px', borderLeft: '2px solid var(--accent-purple)', background: 'rgba(157, 80, 187, 0.05)' }}>
        "{demon.lore}"
      </div>

      <div className="result-details" style={{ textAlign: 'left', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', textTransform: 'uppercase' }}>Resolution</h3>
        <p style={{ margin: '10px 0', lineHeight: '1.6' }}>{demon.explanation}</p>
        
        <div className="correct-patch-reveal" style={{ marginTop: '20px', padding: '15px', background: '#000', border: '1px solid #332244', borderRadius: '4px' }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 'bold', marginRight: '10px' }}>[CORRECT PATCH]</span>
          <code style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>{correctFixText}</code>
        </div>
      </div>

      <button onClick={onNext} style={{ padding: '12px 40px', fontSize: '1.1rem', cursor: 'pointer' }}>
        Continue Journey
      </button>
    </div>
  );
};

export default ResultScreen;