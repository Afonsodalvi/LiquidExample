import React, { useState } from 'react';
import { getTotalPagTpu } from '../../utils/contractReads';

const TotalPagTpuReader = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [pagTpuData, setPagTpuData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTotalPagTpu = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getTotalPagTpu(contractAddress, tokenId);
      console.log('Total PagTpu received:', data);
      setPagTpuData(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching total PagTpu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Total PagTpu Reader</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button onClick={fetchTotalPagTpu} disabled={loading || !tokenId}>
          {loading ? 'Loading...' : 'Get Total PagTpu'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {pagTpuData && (
        <div className="info-grid">
          <div className="zone-data">
            <h4>Zona Azul Values</h4>
            {pagTpuData.azulValues.map((value, index) => (
              <div key={`azul-${index}`} className="info-item">
                <strong>Device {index + 1}:</strong>
                <span>{value || 'No value'}</span>
              </div>
            ))}
          </div>
          <div className="zone-data">
            <h4>Zona Verde Values</h4>
            {pagTpuData.verdeValues.map((value, index) => (
              <div key={`verde-${index}`} className="info-item">
                <strong>Device {index + 1}:</strong>
                <span>{value || 'No value'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalPagTpuReader; 