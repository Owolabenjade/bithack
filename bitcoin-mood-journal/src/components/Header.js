import React from 'react';

const Header = ({ userData, onSignOut, activeTab, setActiveTab }) => {
  // Format the STX address for display (first 6 and last 4 characters)
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="app-header">
      <div className="app-title">
        <img src="/logo.png" alt="Logo" className="app-logo" />
        <h1>Bitcoin Mood Journal</h1>
      </div>
      
      {userData && (
        <>
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New Entry
            </div>
            <div 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              My Journal
            </div>
          </div>
          
          <div className="auth-section">
            <div className="user-info">
              <span>{formatAddress(userData.profile.stxAddress.testnet)}</span>
            </div>
            <button className="connect-button" onClick={onSignOut}>
              Sign Out
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;