// App.js
import React, { useState } from 'react';
import CreateWallet from './components/CreateWallet';
import MintNFTSimple from './components/MintNFTSimple';
import NFTDataViewer from './components/NFTDataViewer';
import SetIBGE from './components/SetIBGE';
import './App.css';

const App = () => {
  const [walletId, setWalletId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const authToken = process.env.REACT_APP_AUTH_TOKEN;
  const contractAddress = process.env.REACT_APP_CONTRACT_ID;

  return (
    <div className="app-container">
      <header className="header">
        <CreateWallet setWalletId={setWalletId} setWalletAddress={setWalletAddress} />
        {walletId && (
          <p className="wallet-info">
            Wallet ID: {walletId}
            <br />
            Address: {walletAddress}
          </p>
        )}
      </header>
      <main className="content">
        <h1>Revenue NFT Management</h1>
        <MintNFTSimple 
          walletId={walletId} 
          contractAddress={contractAddress} 
          authToken={authToken} 
        />
        <SetIBGE 
          contractAddress={contractAddress} 
          authToken={authToken}
        />
        <NFTDataViewer contractAddress={contractAddress} />
      </main>
    </div>
  );
};

export default App;
