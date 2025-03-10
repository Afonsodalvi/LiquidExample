import React, { useState, useEffect } from 'react';

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 6; // Maximum number of retries
const TIMEOUT_DURATION = 12000; // 12 seconds (2s * 6 retries)

const MintNFTSimple = ({ walletId, contractAddress, authToken }) => {
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    info: '',
    value: '',
    tokenURI: 'https://example.com/metadata',
    referenceDay: 1,
    referenceMonth: 1,
    referenceYear: new Date().getFullYear(), // Default to current year
    version: 1,
    ibge: ''
  });

  useEffect(() => {
    // Cleanup function to clear any remaining intervals/timeouts
    return () => {
      setLoading(false);
      setErrorMessage('');
    };
  }, []);

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

  const handleMintSimple = async () => {
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
          walletId,
          contractAddress,
          operations: [{
            functionSignature: 'mintNFT(string,string,string,uint8,uint8,uint16,uint256,uint256)',
            argumentsValues: [
              formData.info,
              formData.value,
              formData.tokenURI,
              formData.referenceDay,
              formData.referenceMonth,
              formData.referenceYear,
              formData.version,
              formData.ibge
            ],
          }],
        }),
      });

      if (!response.ok) throw new Error('Mint failed');
      
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
      console.error('Error minting NFT:', error);
      setErrorMessage('Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-nft-container">
      <h2>Mint NFT</h2>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="form-group">
        <label>
          Info:
          <input
            type="text"
            value={formData.info}
            onChange={(e) => setFormData({...formData, info: e.target.value})}
            placeholder="Enter NFT information"
          />
        </label>
        <label>
          Value:
          <input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            placeholder="Enter value"
          />
        </label>
        <label>
          Token URI:
          <input
            type="text"
            value={formData.tokenURI}
            onChange={(e) => setFormData({...formData, tokenURI: e.target.value})}
          />
        </label>
        <label>
          Reference Day:
          <input
            type="number"
            min="1"
            max="31"
            value={formData.referenceDay}
            onChange={(e) => setFormData({...formData, referenceDay: parseInt(e.target.value)})}
          />
        </label>
        <label>
          Reference Month:
          <input
            type="number"
            min="1"
            max="12"
            value={formData.referenceMonth}
            onChange={(e) => setFormData({...formData, referenceMonth: parseInt(e.target.value)})}
          />
        </label>
        <label>
          Reference Year:
          <input
            type="number"
            min="1"
            value={formData.referenceYear}
            onChange={(e) => setFormData({...formData, referenceYear: parseInt(e.target.value)})}
          />
        </label>
        <label>
          Version:
          <input
            type="number"
            min="1"
            value={formData.version}
            onChange={(e) => setFormData({...formData, version: parseInt(e.target.value)})}
          />
        </label>
        <label>
          IBGE Code:
          <input
            type="number"
            min="1"
            value={formData.ibge}
            onChange={(e) => setFormData({...formData, ibge: parseInt(e.target.value)})}
            placeholder="Enter IBGE code"
          />
        </label>

        <div className="button-group">
          <button 
            onClick={handleMintSimple} 
            disabled={loading || !formData.info || !formData.value || !formData.ibge}
          >
            {loading ? 'Processing...' : 'Mint NFT'}
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

export default MintNFTSimple;