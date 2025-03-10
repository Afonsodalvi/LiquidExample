import React, { useState } from 'react';
import axios from 'axios';

const SetIBGE = ({ contractAddress, authToken }) => {
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    walletId: '',
    address: '',
    ibge: ''
  });

  const WALLET_ID = '0added59-15a1-48cf-8a06-96269ab69e5c'; // Fixed wallet ID for admin operations
  const POLL_INTERVAL = 2000; // 2 seconds
  const MAX_RETRIES = 6; // Maximum number of retries
  const TIMEOUT_DURATION = 12000; // 12 seconds

  const pollTransaction = async (transactionId) => {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        reject(new Error('Transaction timeout'));
      }, TIMEOUT_DURATION);

      const pollInterval = setInterval(async () => {
        if (retryCount >= MAX_RETRIES) {
          clearInterval(pollInterval);
          clearTimeout(timeout);
          reject(new Error('Maximum retries reached'));
          return;
        }

        try {
          const pollResponse = await fetch(
            `https://protocol-sandbox.lumx.io/v2/transactions/${transactionId}`,
            { 
              headers: { 
                Authorization: authToken 
              } 
            }
          );

          retryCount++;

          if (!pollResponse.ok) {
            throw new Error(`Transaction check failed: ${pollResponse.status}`);
          }

          const pollData = await pollResponse.json();

          if (pollData.transactionHash) {
            clearTimeout(timeout);
            clearInterval(pollInterval);
            resolve(pollData.transactionHash);
          } else if (retryCount === MAX_RETRIES) {
            clearTimeout(timeout);
            clearInterval(pollInterval);
            reject(new Error('Transaction not found after maximum retries'));
          }
        } catch (error) {
          console.error(`Polling error (attempt ${retryCount}/${MAX_RETRIES}):`, error);
          if (retryCount === MAX_RETRIES) {
            clearTimeout(timeout);
            clearInterval(pollInterval);
            reject(error);
          }
        }
      }, POLL_INTERVAL);
    });
  };

  const handleSetIBGE = async () => {
    setLoading(true);
    setErrorMessage('');
    setTransactionHash(null);

    try {
      const response = await fetch('https://protocol-sandbox.lumx.io/v2/transactions/custom', {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletId: WALLET_ID,
          contractAddress,
          operations: [{
            functionSignature: 'setIBGE(address,uint256)',
            argumentsValues: [
              formData.address,
              formData.ibge
            ],
          }],
        }),
      });

      if (!response.ok) throw new Error('Set IBGE failed');
      
      const data = await response.json();
      const transactionId = data.id;

      try {
        const hash = await pollTransaction(transactionId);
        setTransactionHash(hash);
      } catch (error) {
        setErrorMessage('Transaction timeout. Please try again.');
        console.error('Transaction polling failed:', error);
      }

    } catch (error) {
      console.error('Error setting IBGE:', error);
      setErrorMessage('Failed to set IBGE. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const lookupWalletAddress = async (walletId) => {
    try {
      const response = await axios.get(
        `https://protocol-sandbox.lumx.io/v2/wallets/${walletId}?includeTokens=false`,
        {
          headers: { Authorization: authToken },
        }
      );
      setFormData(prev => ({
        ...prev,
        address: response.data.address
      }));
    } catch (error) {
      console.error('Error looking up wallet address:', error);
      setErrorMessage('Failed to find wallet address. Please verify the Wallet ID.');
    }
  };

  return (
    <div className="set-ibge-container">
      <h2>Set IBGE Code</h2>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="form-group">
        <label>
          Wallet ID:
          <input
            type="text"
            value={formData.walletId}
            onChange={(e) => setFormData({...formData, walletId: e.target.value})}
            placeholder="Enter wallet ID"
          />
          <button 
            onClick={() => lookupWalletAddress(formData.walletId)}
            disabled={!formData.walletId}
          >
            Lookup Address
          </button>
        </label>
        <label>
          Wallet Address:
          <input
            type="text"
            value={formData.address}
            readOnly
            placeholder="Address will appear here after lookup"
          />
        </label>
        <label>
          IBGE Code:
          <input
            type="number"
            min="1"
            value={formData.ibge}
            onChange={(e) => setFormData({...formData, ibge: e.target.value})}
            placeholder="Enter IBGE code"
          />
        </label>

        <div className="button-group">
          <button 
            onClick={handleSetIBGE} 
            disabled={loading || !formData.address || !formData.ibge}
          >
            {loading ? 'Processing...' : 'Set IBGE'}
          </button>
        </div>
      </div>
      {transactionHash && (
        <div className="transaction-info">
          <p>Transaction Hash: {transactionHash}</p>
          <a
            href={`https://amoy.polygonscan.com/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Explorer
          </a>
        </div>
      )}
    </div>
  );
};

export default SetIBGE; 