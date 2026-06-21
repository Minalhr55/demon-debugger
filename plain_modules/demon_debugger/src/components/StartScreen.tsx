import React, { useState } from 'react';
import { Language } from '../types';
import { WEAPONS } from '../data/demons';
import { playSound } from '../App';

interface Props {
  onStart: (lang: Language) => void;
  onAiSummon: (lang: Language) => void;
  isSummoning: boolean;
}

const StartScreen: React.FC<Props> = ({ onStart, onAiSummon, isSummoning }) => {
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);

  const handleWeaponSelect = (lang: Language) => {
    playSound('select');
    setSelectedLang(lang);
  };

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Demon Debugger</h1>
      <p style={{ color: 'var(--accent-purple)', fontSize: '1.2rem', marginBottom: '2rem', fontStyle: 'italic' }}>
        Exorcise the bugs that haunt your code
      </p>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Choose your weapon</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {WEAPONS.map((weapon) => (
          <div 
            key={weapon.language}
            onClick={() => handleWeaponSelect(weapon.language)}
            style={{
              padding: '20px',
              border: `2px solid ${selectedLang === weapon.language ? 'var(--accent-purple)' : '#332244'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              background: selectedLang === weapon.language ? 'rgba(157, 80, 187, 0.1)' : 'transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.6 }}>{weapon.language}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{weapon.weaponName}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: 'bold' }}>{weapon.weaponType}</div>
            <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.4', marginTop: '10px' }}>{weapon.flavor}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => selectedLang && onStart(selectedLang)}
          disabled={!selectedLang || isSummoning}
          style={{ fontSize: '1.1rem', padding: '15px 30px', opacity: selectedLang ? 1 : 0.5 }}
        >
          Enter the Dungeon
        </button>

        <button 
          onClick={() => selectedLang && onAiSummon(selectedLang)}
          disabled={!selectedLang || isSummoning}
          className="danger-btn"
          style={{ fontSize: '1.1rem', padding: '15px 30px', opacity: selectedLang ? 1 : 0.5 }}
        >
          {isSummoning ? 'Summoning...' : 'Summon a Random Demon'}
        </button>
      </div>
    </div>
  );
};

export default StartScreen;