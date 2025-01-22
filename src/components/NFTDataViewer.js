import React from 'react';
import TokenInfoReader from './NFTReaders/TokenInfoReader';
import DadosByDataReader from './NFTReaders/DadosByDataReader';

const NFTDataViewer = ({ contractAddress }) => {
  return (
    <div className="nft-data-viewer">
      <h2>NFT Data Viewer</h2>
      <TokenInfoReader contractAddress={contractAddress} />
      <DadosByDataReader contractAddress={contractAddress} />
    </div>
  );
};

export default NFTDataViewer; 