import React, { useState } from 'react';
import './styles/main.css';

// Import mockup components rather than real ones
import MockHeader from './components/MockHeader';
import MockJournalEntry from './components/MockJournalEntry';
import MockEntryList from './components/MockEntryList';

// Sample mock data
const MOCK_ENTRIES = [
  {
    id: 1,
    content: "Feeling really productive today! Got a lot done on my hackathon project.",
    mood: 1, // Happy
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    inscriptionId: "92a6e030fe9ed2e189760h"
  },
  {
    id: 2,
    content: "Frustrated with some technical issues, but still making progress.",
    mood: 4, // Anxious
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    inscriptionId: null
  },
  {
    id: 3,
    content: "Excited about the potential of this project! Bitcoin Ordinals for mood tracking could be really useful.",
    mood: 5, // Excited
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    inscriptionId: "83bc2e53a9b17fd42891t"
  }
];

const MockApp = () => {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [activeTab, setActiveTab] = useState('new');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulate adding a new entry
  const handleEntryAdded = (newEntry) => {
    // Create a "fake" new entry with the next ID
    const entry = {
      id: entries.length + 1,
      content: newEntry.content,
      mood: newEntry.mood,
      timestamp: Date.now(),
      inscriptionId: null
    };
    
    // Add to our mock entries
    setEntries([entry, ...entries]);
    
    // Switch to history tab
    setActiveTab('history');
  };

  // Simulate adding an inscription to an entry
  const handleCreateInscription = (entryId) => {
    setEntries(
      entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, inscriptionId: `${Date.now().toString(16)}i0` } 
          : entry
      )
    );
  };

  // Simulate login/logout
  const handleToggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="app-container">
      <MockHeader 
        isLoggedIn={isLoggedIn}
        onToggleLogin={handleToggleLogin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <main className="main-content">
        {!isLoggedIn ? (
          <div className="connect-wallet">
            <h2>Welcome to Bitcoin Mood Journal</h2>
            <p>Track your moods and thoughts with permanent records on Bitcoin.</p>
            <p>Connect your wallet to get started.</p>
            <button className="connect-button" onClick={handleToggleLogin}>
              Connect Wallet (Demo)
            </button>
            <div className="wallet-info">
              <p>This is a demo version for the Buidl Battle Hackathon.</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'new' && (
              <MockJournalEntry onEntryAdded={handleEntryAdded} />
            )}
            
            {activeTab === 'history' && (
              <MockEntryList 
                entries={entries} 
                onCreateInscription={handleCreateInscription}
              />
            )}
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Built for Buidl Battle · Hackathon Project · 2025</p>
      </footer>
    </div>
  );
};

export default MockApp;