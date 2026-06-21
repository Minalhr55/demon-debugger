import React from 'react';
import { Demon } from '../types';

interface CombatArenaProps {
  demon: Demon;
  isAnimatingCorrect: boolean;
  isAnimatingIncorrect: boolean;
  showPoints: number | null;
}

/**
 * CombatArena handles the visual representation of the battle,
 * including hero/demon sprites and combat-triggered animations.
 */
const CombatArena: React.FC<CombatArenaProps> = ({
  demon,
  isAnimatingCorrect,
  isAnimatingIncorrect,
  showPoints,
}) => {
  // Defensive check: Ensure demon data exists to prevent rendering crashes
  if (!demon) {
    console.error("CombatArena Error: No demon data provided for rendering.");
    return <div className="arena-error">Entity Manifestation Failed</div>;
  }

  return (
    <div 
      className="arena" 
      style={{ 
        height: '320px', 
        background: 'linear-gradient(to bottom, #0f051a, #1a0b25)', 
        margin: '20px 0', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        position: 'relative', 
        borderRadius: '4px', 
        border: '1px solid #332244', 
        padding: '0 60px 40px 60px' 
      }}
    >
      {/* Hero Sprite with Lunge/Recoil animations */}
      <div 
        className={`hero-entity ${isAnimatingCorrect ? 'hero-lunge' : ''} ${isAnimatingIncorrect ? 'hero-recoil' : ''}`} 
        style={{ textAlign: 'center', zIndex: 5 }}
      >
        <img src="/hero_demon_slayer_right.png" alt="Hero" style={{ height: '180px' }} />
      </div>

      {/* Score Popup Animation */}
      {showPoints !== null && (
        <div className="floating-points" style={{ left: '75%', bottom: '200px' }}>
          +{showPoints}
        </div>
      )}

      {/* Demon Sprite with Crumble/Swell animations */}
      <div 
        className={`demon-entity ${isAnimatingCorrect ? 'demon-crumble' : ''} ${isAnimatingIncorrect ? 'demon-swell' : ''}`} 
        style={{ textAlign: 'center' }}
      >
        <div className="demon-info">
          <span style={{ background: 'var(--accent-red)', padding: '2px 8px', fontSize: '0.6rem', borderRadius: '4px' }}>
            {demon.bugCategory.toUpperCase()}
          </span>
          <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}>
            {demon.name}
          </div>
        </div>
        <img 
          src={`/sprites/${demon.spriteId}`} 
          alt={demon.name} 
          style={{ height: '160px' }} 
          onError={(e) => {
            console.error(`CombatArena Error: Sprite failed to load: ${demon.spriteId}`);
            (e.target as HTMLImageElement).src = '/sprites/fallback_demon.png';
          }}
        />
      </div>

      {/* Decorative Floor Line */}
      <div 
        className="floor-line" 
        style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '5%', 
          width: '90%', 
          height: '2px', 
          background: 'linear-gradient(90deg, transparent, var(--accent-purple), var(--accent-red), var(--accent-purple), transparent)', 
          opacity: 0.6 
        }} 
      />
    </div>
  );
};

export default CombatArena;