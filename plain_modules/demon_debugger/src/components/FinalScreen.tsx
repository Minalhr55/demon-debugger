import React from 'react';
import { GameState, Rank, Weapon } from '../types';
import { WEAPONS } from '../data/demons';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

/**
 * FinalScreen renders the post-game summary and provides the "Scroll of Conquest" download.
 * Implements :codeplain::AdditionalFunctionality:
 */
const FinalScreen: React.FC<Props> = ({ gameState, onRestart }) => {
  const getRank = (score: number): Rank => {
    if (score >= 100) return "Archmage Debugger";
    if (score >= 60) return "Demon Slayer";
    if (score >= 30) return "Junior Exorcist";
    return "Cursed Intern";
  };

  const rank = getRank(gameState.score);
  
  // Retrieve weapon details for the scroll
  const weapon: Weapon | undefined = WEAPONS.find(w => w.language === gameState.language);

  /**
   * Generates and downloads a JSON file representing the player's performance.
   */
  const downloadScroll = () => {
    try {
      const scrollData = {
        weapon: weapon?.weaponName || "Unknown Implement",
        language: gameState.language,
        score: gameState.score,
        demonsExorcised: gameState.demonsDefeated,
        bestCombo: gameState.bestCombo,
        rank: rank,
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(scrollData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = `scroll_of_conquest_${gameState.language || 'unknown'}.json`;
      
      // Append to body, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Critical Failure: Could not manifest the Scroll of Conquest.", error);
      alert("The ritual to manifest your scroll failed. Check the console for debugger insights.");
    }
  };

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontFamily: 'serif' }}>Battle Concluded</h1>
      
      <div style={{ 
        margin: '30px 0', 
        padding: '20px', 
        border: '2px double var(--accent-purple)',
        background: 'rgba(157, 80, 187, 0.05)',
        boxShadow: '0 0 15px rgba(157, 80, 187, 0.2)'
      }}>
        <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#aaa', letterSpacing: '2px' }}>Your Title</p>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-purple)', margin: '10px 0' }}>{rank}</h2>
        <p style={{ fontStyle: 'italic', color: '#888' }}>Wielder of the {weapon?.weaponName || "Mystic Code"}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
        <div>
          <p style={{ fontSize: '1.8rem', margin: '0' }}>{gameState.score}</p>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Final Score</p>
        </div>
        <div>
          <p style={{ fontSize: '1.8rem', margin: '0' }}>{gameState.demonsDefeated}</p>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Demons Slain</p>
        </div>
        <div>
          <p style={{ fontSize: '1.8rem', margin: '0' }}>{gameState.bestCombo}</p>
          <p style={{ fontSize: '0.7rem', opacity: 0.6, textTransform: 'uppercase' }}>Best Combo</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={downloadScroll}
          style={{ backgroundColor: 'var(--accent-purple)', color: 'white' }}
        >
          Download Scroll of Conquest
        </button>
        
        <button 
          onClick={onRestart}
          className="secondary"
          style={{ background: 'transparent', border: '1px solid #444' }}
        >
          Descend Again
        </button>
      </div>
    </div>
  );
};

export default FinalScreen;