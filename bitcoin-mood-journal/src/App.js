import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { UserSession, AppConfig } from '@stacks/auth';

// Components
import Header from './components/Header';
import JournalEntry from './components/JournalEntry';
import EntryList from './components/EntryList';
import ConnectWallet from './components/ConnectWallet';

// Services
import { getUserEntries } from './services/contractService';

// Styles
import './styles/main.css';

// App config for Stacks authentication
const appConfig = new AppConfig(['store_write', 'publish_data']);
// Create a fresh UserSession to avoid version conflicts
const userSession = new UserSession({ appConfig });

// Clear any existing session data to avoid version conflicts
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('blockstack-session');
  }
} catch (e) {
  console.error('Error clearing session data:', e);
}

const App = () => {
  const [userData, setUserData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'

  // Authentication state
  useEffect(() => {
    try {
      if (userSession.isUserSignedIn()) {
        setUserData(userSession.loadUserData());
      }
    } catch (error) {
      console.error('Error checking authentication state:', error);
      // Clear any corrupted session data
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('blockstack-session');
      }
    }
  }, []);

  // Fetch entries when user is authenticated
  useEffect(() => {
    if (userData) {
      fetchEntries();
    }
  }, [userData]);

  // Fetch entries from the blockchain
  const fetchEntries = async () => {
    if (!userData) return;
    
    setLoading(true);
    try {
      const userEntries = await getUserEntries(userData.profile.stxAddress.testnet);
      setEntries(userEntries);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful entry creation
  const handleEntryAdded = () => {
    fetchEntries();
    // Switch to history tab after adding an entry
    setActiveTab('history');
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
        setUserData(userSession.loadUserData());
      } catch (error) {
        console.error('Error loading user data:', error);
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