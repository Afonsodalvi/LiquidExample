import React, { useState } from 'react';
import { getTickets } from '../../utils/contractReads';

const DEVICE_NAMES = {
  1: 'Parquímetro',
  2: 'Monitor',
  3: 'PDV',
  4: 'App',
  5: 'WhatsApp',
  6: 'Site'
};

const TicketsReader = ({ contractAddress }) => {
  const [tokenId, setTokenId] = useState('');
  const [deviceId, setDeviceId] = useState('1');
  const [ticketsData, setTicketsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTickets = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getTickets(contractAddress, tokenId, deviceId);
      setTicketsData(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-section">
      <h3>Tickets Reader</h3>
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
        <button onClick={fetchTickets} disabled={loading || !tokenId}>
          {loading ? 'Loading...' : 'Get Tickets'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {ticketsData && (
        <div className="zone-data">
          <div>
            <h4>Ticket Values</h4>
            <p>Zona Azul: {ticketsData.ticketAzul}</p>
            <p>Zona Verde: {ticketsData.ticketVerde}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsReader; 