import React, { useState } from 'react';
import { getTokenInfo } from '../../utils/contractReads';

const TokenInfoReader = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTokenInfo = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');
    try {
      const info = await getTokenInfo(contractAddress, tokenId);
      console.log('Token Info received:', info);
      setTokenInfo(info);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching token info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Token Information Reader</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={fetchTokenInfo} disabled={loading || !tokenId}>
          {loading ? 'Loading...' : 'Get Token Info'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tokenInfo && (
        <div className="info-grid">
          <div className="info-item">
            <strong>Token ID:</strong>
            <span>{tokenInfo.tokenId}</span>
          </div>
          <div className="info-item">
            <strong>Info:</strong>
            <span>{tokenInfo.info}</span>
          </div>
          <div className="info-item">
            <strong>Value:</strong>
            <span>{tokenInfo.value}</span>
          </div>
          <div className="info-item">
            <strong>Reference Day:</strong>
            <span>{tokenInfo.referenceDay}</span>
          </div>
          <div className="info-item">
            <strong>Reference Month:</strong>
            <span>{tokenInfo.referenceMonth}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenInfoReader; 