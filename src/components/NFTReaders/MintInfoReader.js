import React, { useState } from 'react';
import { getMintInfo } from '../../utils/contractReads';

const MintInfoReader = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [mintInfo, setMintInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMintInfo = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');
    try {
      const info = await getMintInfo(contractAddress, tokenId);
      setMintInfo(info);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching mint info:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Mint Information Reader</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={fetchMintInfo} disabled={loading || !tokenId}>
          {loading ? 'Loading...' : 'Get Mint Info'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {mintInfo && (
        <div className="info-grid">
          <div>Value: {mintInfo.value}</div>
          <div>Reference Day: {mintInfo.referenceDay}</div>
          <div>Reference Month: {mintInfo.referenceMonth}</div>
        </div>
      )}
    </div>
  );
};

export default MintInfoReader; 