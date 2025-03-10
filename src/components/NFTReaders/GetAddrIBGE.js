import React, { useState } from 'react';
import { getAddressByIBGE } from '../../utils/contractReads';

const GetAddrIBGE = ({ contractAddress }) => {
  const [ibgeCode, setIbgeCode] = useState('');
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetAddress = async () => {
    if (!ibgeCode) return;
    
    setLoading(true);
    setError('');
    setAddress(null);

    try {
      const addr = await getAddressByIBGE(contractAddress, ibgeCode);
      setAddress(addr);
    } catch (error) {
      console.error('Error fetching address:', error);
      setError(error.message || 'Failed to fetch address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Get Address by IBGE Code</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Enter IBGE code"
          value={ibgeCode}
          onChange={(e) => setIbgeCode(e.target.value)}
          className="ibge-input"
        />
        <button 
          onClick={handleGetAddress} 
          disabled={loading || !ibgeCode}
        >
          {loading ? 'Loading...' : 'Get Address'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {address && (
        <div className="result-card">
          <h4>Address Information</h4>
          <div className="info-item">
            <strong>IBGE Code:</strong>
            <span>{ibgeCode}</span>
          </div>
          <div className="info-item">
            <strong>Wallet Address:</strong>
            <span>{address}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAddrIBGE; 