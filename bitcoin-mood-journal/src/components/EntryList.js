import React, { useState } from 'react';
import { getMoodName, getMoodEmoji } from '../services/contractService';

const EntryList = ({ entries, loading, onRefresh, onCreateInscription }) => {
  const [processingInscription, setProcessingInscription] = useState(null);
  const [showSbtcModal, setShowSbtcModal] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  // Helper function to get inscription view link
  const getInscriptionViewLink = (inscriptionId) => {
    return `https://ordinals.com/inscription/${inscriptionId}`;
  };

  // Format date for display
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Handle creating an inscription with sBTC
  const handleCreateInscription = (entryId) => {
    setSelectedEntryId(entryId);
    setShowSbtcModal(true);
  };

  // Handle confirming sBTC payment and creating inscription
  const handleConfirmSbtcPayment = () => {
    setProcessingInscription(selectedEntryId);
    setShowSbtcModal(false);
    
    // Simulate payment processing and inscription creation
    setTimeout(() => {
      onCreateInscription(selectedEntryId);
      setProcessingInscription(null);
    }, 1500);
  };

  // Modal for sBTC payment
  const SbtcPaymentModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create Ordinal Inscription</h3>
        <p>This will permanently store your journal entry on Bitcoin using Ordinals.</p>
        
        <div className="payment-details">
          <div className="payment-row">
            <span>Inscription Fee:</span>
            <span>0.0001 BTC</span>
          </div>
          <div className="payment-row">
            <span>Network Fee:</span>
            <span>0.00005 BTC</span>
          </div>
          <div className="payment-row total">
            <span>Total:</span>
            <span>0.00015 BTC</span>
          </div>
        </div>
        
        <div className="payment-options">
          <h4>Payment Method</h4>
          <div className="payment-option selected">
            <input type="radio" id="sbtc" name="payment" checked readOnly />
            <label htmlFor="sbtc">Pay with sBTC</label>
            <div className="payment-badge">Fast & Low fees</div>
          </div>
          <div className="payment-option disabled">
            <input type="radio" id="onchain" name="payment" disabled />
            <label htmlFor="onchain">Pay with on-chain BTC</label>
            <div className="payment-badge">Higher fees</div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-button" onClick={() => setShowSbtcModal(false)}>
            Cancel
          </button>
          <button className="connect-button" onClick={handleConfirmSbtcPayment}>
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );

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
              {processingInscription === entry.id ? (
                <div className="processing-inscription">
                  <div className="loading-spinner small"></div>
                  <span>Processing sBTC payment and creating inscription...</span>
                </div>
              ) : (
                <button 
                  onClick={() => handleCreateInscription(entry.id)}
                  className="connect-button"
                >
                  Create Ordinal Inscription with sBTC
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {showSbtcModal && <SbtcPaymentModal />}
    </div>
  );
};

export default EntryList;