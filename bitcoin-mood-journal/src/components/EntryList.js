import React from 'react';
import { getMoodName, getMoodEmoji } from '../services/contractService';

const EntryList = ({ entries, loading, onRefresh, onCreateInscription }) => {
  // Helper function to get inscription view link
  const getInscriptionViewLink = (inscriptionId) => {
    return `https://ordinals.com/inscription/${inscriptionId}`;
  };

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

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

export default EntryList;