import React from 'react';

const MockHeader = ({ isLoggedIn, onToggleLogin, activeTab, setActiveTab }) => {
  return (
    <header className="app-header">
      <div className="app-title">
        <h1>Bitcoin Mood Journal</h1>
      </div>
      
      {isLoggedIn && (
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
              <span>ST1...PGZGM</span>
            </div>
            <button className="connect-button" onClick={onToggleLogin}>
              Sign Out (Demo)
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default MockHeader;