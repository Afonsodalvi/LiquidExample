import React, { useState } from 'react';
import { getPagTpu } from '../../utils/contractReads';

const DEVICE_NAMES = {
  1: 'Parquímetro',
  2: 'Monitor',
  3: 'PDV',
  4: 'App',
  5: 'WhatsApp',
  6: 'Site'
};

const PagTpuReader = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [deviceId, setDeviceId] = useState('1');
  const [pagTpuData, setPagTpuData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPagTpu = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getPagTpu(contractAddress, tokenId, deviceId);
      setPagTpuData(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching PagTpu:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>PagTpu Reader</h3>
      <div className="search-controls">
        <input
          type="number"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
          {Object.entries(DEVICE_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <button onClick={fetchPagTpu} disabled={loading || !tokenId}>
          {loading ? 'Loading...' : 'Get PagTpu'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {pagTpuData && (
        <div className="zone-data">
          <div>
            <h4>PagTpu Values</h4>
            <p>Zona Azul: {pagTpuData.pagTpuAzul}</p>
            <p>Zona Verde: {pagTpuData.pagTpuVerde}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagTpuReader; 