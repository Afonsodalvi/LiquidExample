import React, { useState } from 'react';
import { getDadosIBGE } from '../../utils/contractReads';

const DadosByIBGEReader = ({ contractAddress }) => {
  const [ibge, setIBGE] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDadosByIBGE = async () => {
    if (!ibge || !year) return;
    setLoading(true);
    setError('');
    try {
      const data = await getDadosIBGE(contractAddress, parseInt(ibge), parseInt(year));
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
      <h3>Search Tokens by IBGE and Year</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="IBGE Code"
          min="1"
          value={ibge}
          onChange={(e) => setIBGE(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year"
          min="1"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button 
          onClick={fetchDadosByIBGE} 
          disabled={loading || !ibge || !year}
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
              <div className="info-item">
                <strong>Reference Year:</strong>
                <span>{token.referenceYear}</span>
              </div>
              <div className="info-item">
                <strong>Version:</strong>
                <span>{token.version}</span>
              </div>
            </div>
          ))}
        </div>
      ) : tokens && (
        <div className="no-results">
          No tokens found for this IBGE code and year
        </div>
      )}
    </div>
  );
};

export default DadosByIBGEReader; 