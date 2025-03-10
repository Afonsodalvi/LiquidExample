import React, { useState } from 'react';
import { getIBGE } from '../../utils/contractReads';

const GetIBGE = ({ contractAddress }) => {
  const [address, setAddress] = useState('');
  const [ibgeCode, setIbgeCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetIBGE = async () => {
    if (!address) return;
    
    setLoading(true);
    setError('');
    setIbgeCode(null);

    try {
      const code = await getIBGE(contractAddress, address);
      setIbgeCode(code);
    } catch (error) {
      console.error('Error fetching IBGE code:', error);
      setError(error.message || 'Failed to fetch IBGE code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Get IBGE Code</h3>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Enter wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="address-input"
        />
        <button 
          onClick={handleGetIBGE} 
          disabled={loading || !address}
        >
          {loading ? 'Loading...' : 'Get IBGE'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {ibgeCode && (
        <div className="result-card">
          <h4>IBGE Information</h4>
          <div className="info-item">
            <strong>Address:</strong>
            <span>{address}</span>
          </div>
          <div className="info-item">
            <strong>IBGE Code:</strong>
            <span>{ibgeCode}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetIBGE; 