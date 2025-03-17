import React from 'react';
import { getMoodName, getMoodEmoji } from '../services/contractService';

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  // Define available moods (matching the contract constants)
  const moods = [
    { id: 1, name: 'Happy', emoji: '😊' },
    { id: 2, name: 'Sad', emoji: '😔' },
    { id: 3, name: 'Neutral', emoji: '😐' },
    { id: 4, name: 'Anxious', emoji: '😰' },
    { id: 5, name: 'Excited', emoji: '🤩' }
  ];

  return (
    <div className="mood-selector">
      {moods.map((mood) => (
        <div 
          key={mood.id}
          className={`mood-option ${selectedMood === mood.id ? 'selected' : ''}`}
          onClick={() => onMoodSelect(mood.id)}
        >
          <div className="mood-emoji">{mood.emoji}</div>
          <div className="mood-label">{mood.name}</div>
        </div>
      ))}
    </div>
  );
};

export default MoodSelector;