import React, { useState, useEffect } from 'react';

const DEVICE_NAMES = {
  1: 'Parquímetro',
  2: 'Monitor',
  3: 'PDV',
  4: 'App',
  5: 'WhatsApp',
  6: 'Site'
};

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_RETRIES = 6; // Maximum number of retries
const TIMEOUT_DURATION = 12000; // 12 seconds (2s * 6 retries)

const MintNFTSimple = ({ walletId, contractAddress, authToken }) => {
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    value: '0x0000',
    linkInfoComplete: 'https://example.com/info',
    tokenURI: 'https://example.com/metadata',
    referenceDay: 1,
    referenceMonth: 1,
  });

  // Initialize arrays for each zone's data with appropriate types
  const [zoneData, setZoneData] = useState({
    ticketsAzul: Array(6).fill(0),      // Changed to number for uint256
    pagTpusAzul: Array(6).fill('0x00'), // Kept as hex string for bytes
    ticketsVerde: Array(6).fill(0),     // Changed to number for uint256
    pagTpusVerde: Array(6).fill('0x00') // Kept as hex string for bytes
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

  const handleZoneDataChange = (type, index, value) => {
    setZoneData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => {
        if (i !== index) return item;
        // Convert to number for ticket values, keep as is for pagTpu values
        if (type === 'ticketsAzul' || type === 'ticketsVerde') {
          return parseInt(value) || 0;
        }
        return value;
      })
    }));
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
            functionSignature: 'mintNFTSimple(bytes,string,string,uint256,uint256,uint256[],bytes[],uint256[],bytes[])',
            argumentsValues: [
              formData.value,
              formData.linkInfoComplete,
              formData.tokenURI,
              formData.referenceDay,
              formData.referenceMonth,
              zoneData.ticketsAzul,
              zoneData.pagTpusAzul,
              zoneData.ticketsVerde,
              zoneData.pagTpusVerde
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
      <h2>Mint Revenue NFT</h2>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="form-group">
        <label>
          Value (hex):
          <input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
          />
        </label>
        <label>
          Link Info Complete:
          <input
            type="text"
            value={formData.linkInfoComplete}
            onChange={(e) => setFormData({...formData, linkInfoComplete: e.target.value})}
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

        <div className="zone-data-container">
          <h3>Zone Data</h3>
          {Array(6).fill().map((_, index) => (
            <div key={index} className="device-data">
              <h4>{DEVICE_NAMES[index + 1]}</h4>
              <div className="zone-inputs">
                <div className="zona-azul">
                  <h5>Zona Azul</h5>
                  <input
                    type="number"
                    placeholder={`${DEVICE_NAMES[index + 1]} Ticket Value`}
                    value={zoneData.ticketsAzul[index]}
                    onChange={(e) => handleZoneDataChange('ticketsAzul', index, e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder={`${DEVICE_NAMES[index + 1]} PagTPU (hex)`}
                    value={zoneData.pagTpusAzul[index]}
                    onChange={(e) => handleZoneDataChange('pagTpusAzul', index, e.target.value)}
                  />
                </div>
                <div className="zona-verde">
                  <h5>Zona Verde</h5>
                  <input
                    type="number"
                    placeholder={`${DEVICE_NAMES[index + 1]} Ticket Value`}
                    value={zoneData.ticketsVerde[index]}
                    onChange={(e) => handleZoneDataChange('ticketsVerde', index, e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder={`${DEVICE_NAMES[index + 1]} PagTPU (hex)`}
                    value={zoneData.pagTpusVerde[index]}
                    onChange={(e) => handleZoneDataChange('pagTpusVerde', index, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button 
            onClick={handleMintSimple} 
            disabled={loading}
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