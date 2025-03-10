// components/createWallet.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateWallet = ({ setWalletId, setWalletAddress }) => {
  const [inputWalletId, setInputWalletId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const authToken = process.env.REACT_APP_AUTH_TOKEN;

  // Function to connect existing wallet
  const connectExistingWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://protocol-sandbox.lumx.io/v2/wallets/${inputWalletId}?includeTokens=false`,
        {
          headers: { Authorization: authToken },
        }
      );
      setWalletId(response.data.id);
      setWalletAddress(response.data.address);
    } catch (error) {
      console.error('Error connecting to existing wallet:', error);
      setError('Failed to connect to wallet. Please verify the Wallet ID.');
    } finally {
      setLoading(false);
    }
  };

  // Function to create new wallet
  const createNewWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://protocol-sandbox.lumx.io/v2/wallets',
        {},
        {
          headers: { Authorization: authToken },
        }
      );
      setWalletId(response.data.id);
      setWalletAddress(response.data.address);
    } catch (error) {
      console.error('Error creating wallet:', error);
      setError('Failed to create new wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (inputWalletId) {
      connectExistingWallet();
    } else {
      createNewWallet();
    }
  };

  return (
    <div className="wallet-connection">
      <div className="input-group">
        <label>
          Existing Wallet ID:
          <input
            type="text"
            value={inputWalletId}
            onChange={(e) => setInputWalletId(e.target.value)}
            placeholder="Enter Wallet ID (optional)"
          />
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
      <button 
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? 'Processing...' : inputWalletId ? 'Connect Wallet' : 'Create New Wallet'}
      </button>
    </div>
  );
};

export default CreateWallet;
