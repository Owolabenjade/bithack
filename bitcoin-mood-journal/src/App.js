import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { AppConfig, UserSession } from '@stacks/auth';

// Components
import Header from './components/Header';
import JournalEntry from './components/JournalEntry';
import EntryList from './components/EntryList';
import ConnectWallet from './components/ConnectWallet';

// Services
import { getUserEntries } from './services/contractService';

// Styles
import './styles/main.css';

// Clear any session data to avoid version conflicts
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem('blockstack-session');
  } catch (e) {
    console.error('Failed to clear session data:', e);
  }
}

// Create a fresh app config and user session
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const App = () => {
  const [userData, setUserData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [entryCount, setEntryCount] = useState(3); // Initial count of mock entries

  // Initialize wallet connection
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      try {
        const data = userSession.loadUserData();
        setUserData(data);
      } catch (e) {
        console.error('Error loading user data:', e);
        userSession.signUserOut();
      }
    }
  }, []);

  // Fetch entries when user is authenticated
  useEffect(() => {
    if (userData && userData.profile) {
      fetchEntries();
    }
  }, [userData]);

  // Fetch entries from the blockchain
  const fetchEntries = async () => {
    if (!userData || !userData.profile) return;
    
    setLoading(true);
    try {
      // Use testnet or mainnet address based on availability
      const address = userData.profile.stxAddress?.testnet || userData.profile.stxAddress;
      const userEntries = await getUserEntries(address);
      setEntries(userEntries);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful entry creation
  const handleEntryAdded = (newEntry) => {
    // Create a new entry with the current time
    const newEntryWithTimestamp = {
      id: entryCount + 1,
      content: newEntry.content,
      mood: newEntry.mood,
      timestamp: new Date().getTime(),
      owner: userData.profile.stxAddress?.testnet || userData.profile.stxAddress,
      inscriptionId: null
    };
    
    // Update entry count for future entries
    setEntryCount(prevCount => prevCount + 1);
    
    // Add the new entry to the list
    setEntries([newEntryWithTimestamp, ...entries]);
    
    // Switch to history tab after adding an entry
    setActiveTab('history');
  };

  // Handle ordinal inscription creation
  const handleCreateInscription = (entryId) => {
    // Update the entry with a mock inscription ID
    setEntries(
      entries.map(entry => 
        entry.id === entryId 
          ? { ...entry, inscriptionId: `${Date.now().toString(16)}i0` } 
          : entry
      )
    );
  };

  // Authentication config
  const authOptions = {
    appDetails: {
      name: 'Bitcoin Mood Journal',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      try {
        const data = userSession.loadUserData();
        setUserData(data);
        window.history.replaceState({}, document.title, '/');
      } catch (error) {
        console.error('Error loading user data after auth:', error);
      }
    },
    userSession,
  };

  // Handle sign out
  const handleSignOut = () => {
    userSession.signUserOut();
    setUserData(null);
    setEntries([]);
  };

  return (
    <Connect authOptions={authOptions}>
      <div className="app-container">
        <Header 
          userData={userData} 
          onSignOut={handleSignOut}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="main-content">
          {!userData ? (
            <ConnectWallet />
          ) : (
            <>
              {activeTab === 'new' && (
                <JournalEntry onEntryAdded={handleEntryAdded} />
              )}
              
              {activeTab === 'history' && (
                <EntryList 
                  entries={entries} 
                  loading={loading} 
                  onRefresh={fetchEntries}
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
    </Connect>
  );
};

export default App;