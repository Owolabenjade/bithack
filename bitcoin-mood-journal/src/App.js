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
    if (userData && userData.profile && userData.profile.stxAddress) {
      fetchEntries();
    }
  }, [userData]);

  // Fetch entries from the blockchain
  const fetchEntries = async () => {
    if (!userData || !userData.profile || !userData.profile.stxAddress) return;
    
    setLoading(true);
    try {
      // Use testnet or mainnet address based on availability
      const address = userData.profile.stxAddress.testnet || userData.profile.stxAddress;
      const userEntries = await getUserEntries(address);
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