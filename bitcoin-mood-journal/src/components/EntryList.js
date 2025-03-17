import React from 'react';
import { getMoodName, getMoodEmoji } from '../services/contractService';
import { getInscriptionViewLink, hasInscription, createOrdinalInscription } from '../services/ordinalsService';
import { setInscriptionId } from '../services/contractService';

const EntryList = ({ entries, loading, onRefresh }) => {
  // Handle creating an ordinal inscription for an entry
  const handleCreateInscription = async (entry) => {
    try {
      // Call the ordinals service to create an inscription
      const result = await createOrdinalInscription(entry);
      
      if (result.success) {
        // Update the entry with the new inscription ID
        await setInscriptionId(entry.id, result.inscriptionId);
        // Refresh the entries list
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating inscription:', error);
      alert('Failed to create inscription. Please try again.');
    }
  };

  // Format block height as a readable date
  const formatBlockDate = (blockHeight) => {
    // In a real app, you would convert block height to an approximate date
    // For the hackathon, we'll use a simple estimation
    const now = new Date();
    // Assuming 10 minutes per block on average
    const minutesAgo = blockHeight * 10;
    const dateAgo = new Date(now.getTime() - (minutesAgo * 60000));
    
    return dateAgo.toLocaleString();
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
              {formatBlockDate(entry.timestamp)}
            </div>
          </div>
          
          <div className="entry-content">
            {entry.content}
          </div>
          
          {hasInscription(entry) ? (
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
                onClick={() => handleCreateInscription(entry)}
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