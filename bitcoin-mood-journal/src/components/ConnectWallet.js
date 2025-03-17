import React from 'react';
import { useConnect } from '@stacks/connect-react';

const ConnectWallet = () => {
  const { doOpenAuth } = useConnect();

  return (
    <div className="connect-wallet">
      <h2>Welcome to Bitcoin Mood Journal</h2>
      <p>Track your moods and thoughts with permanent records on Bitcoin.</p>
      <p>Connect your wallet to get started.</p>
      <button className="connect-button" onClick={doOpenAuth}>
        Connect Wallet
      </button>
      <div className="wallet-info">
        <p>This app requires a Stacks wallet like Hiro Wallet or Xverse.</p>
      </div>
    </div>
  );
};

export default ConnectWallet;