import React from 'react';

const MockEntryList = ({ entries, onCreateInscription }) => {
  // Helper function to get mood emoji
  const getMoodEmoji = (moodId) => {
    const emojis = {
      1: '😊',
      2: '😔',
      3: '😐',
      4: '😰',
      5: '🤩'
    };
    
    return emojis[moodId] || '❓';
  };

  // Helper function to get mood name
  const getMoodName = (moodId) => {
    const moods = {
      1: 'Happy',
      2: 'Sad',
      3: 'Neutral',
      4: 'Anxious',
      5: 'Excited'
    };
    
    return moods[moodId] || 'Unknown';
  };

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Format inscription link
  const getInscriptionViewLink = (inscriptionId) => {
    return `https://ordinals.com/inscription/${inscriptionId}`;
  };

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="empty-entries">
        <h3>No journal entries yet</h3>
        <p>Your mood journal is empty. Create your first entry to get started!</p>
      </div>
    );
  }

  // Render the list of entries
  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <div key={entry.id} className={`entry-card mood-${entry.mood}`}>
          <div className="entry-header">
            <div className="entry-mood">
              <span className="mood-emoji">{getMoodEmoji(entry.mood)}</span>
              <span>{getMoodName(entry.mood)}</span>
            </div>
            <div className="entry-date">
              {formatDate(entry.timestamp)}
            </div>
          </div>
          
          <div className="entry-content">
            {entry.content}
          </div>
          
          {entry.inscriptionId ? (
            <div className="entry-inscription">
              <a 
                href={getInscriptionViewLink(entry.inscriptionId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Ordinals Explorer: {entry.inscriptionId}
              </a>
            </div>
          ) : (
            <div className="entry-inscription">
              <button 
                onClick={() => onCreateInscription(entry.id)}
                className="connect-button"
              >
                Create Ordinal Inscription
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MockEntryList;