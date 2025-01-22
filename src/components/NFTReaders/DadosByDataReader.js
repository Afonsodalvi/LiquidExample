import React, { useState } from 'react';
import { getDadosByData } from '../../utils/contractReads';

const DadosByDataReader = ({ contractAddress }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDadosByData = async () => {
    if (!day || !month) return;
    setLoading(true);
    setError('');
    try {
      const data = await getDadosByData(contractAddress, parseInt(day), parseInt(month));
      console.log('Tokens received:', data);
      setTokens(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tokens:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Search Tokens by Date</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Day (1-31)"
          min="1"
          max="31"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
        <input
          type="number"
          placeholder="Month (1-12)"
          min="1"
          max="12"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <button 
          onClick={fetchDadosByData} 
          disabled={loading || !day || !month}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tokens && tokens.length > 0 ? (
        <div className="info-grid">
          {tokens.map((token, index) => (
            <div key={index} className="token-card">
              <h4>Token #{token.tokenId}</h4>
              <div className="info-item">
                <strong>Info:</strong>
                <span>{token.info}</span>
              </div>
              <div className="info-item">
                <strong>Value:</strong>
                <span>{token.value}</span>
              </div>
              <div className="info-item">
                <strong>Reference Day:</strong>
                <span>{token.referenceDay}</span>
              </div>
              <div className="info-item">
                <strong>Reference Month:</strong>
                <span>{token.referenceMonth}</span>
              </div>
            </div>
          ))}
        </div>
      ) : tokens && (
        <div className="no-results">
          No tokens found for this date
        </div>
      )}
    </div>
  );
};

export default DadosByDataReader; 