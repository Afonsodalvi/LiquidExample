import React from 'react';
import MintInfoReader from './NFTReaders/MintInfoReader';
import PagTpuReader from './NFTReaders/PagTpuReader';
import TicketsReader from './NFTReaders/TicketsReader';
import TotalPagTpuReader from './NFTReaders/TotalPagTpuReader';

const NFTDataViewer = ({ contractAddress }) => {
  return (
    <div className="nft-data-viewer">
      <h2>NFT Data Viewer</h2>
      <MintInfoReader contractAddress={contractAddress} />
      <TotalPagTpuReader contractAddress={contractAddress} />
      <PagTpuReader contractAddress={contractAddress} />
      <TicketsReader contractAddress={contractAddress} />
    </div>
  );
};

export default NFTDataViewer; 