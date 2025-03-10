import React from 'react';
import TokenInfoReader from './NFTReaders/TokenInfoReader';
import DadosByDataReader from './NFTReaders/DadosByDataReader';
import DadosByIBGEReader from './NFTReaders/DadosByIBGEReader';
import GetIBGE from './NFTReaders/GetIBGE';

const NFTDataViewer = ({ contractAddress }) => {
  return (
    <div className="nft-data-viewer">
      <h2>NFT Data Viewer</h2>
      <TokenInfoReader contractAddress={contractAddress} />
      <DadosByDataReader contractAddress={contractAddress} />
      <DadosByIBGEReader contractAddress={contractAddress} />
      <GetIBGE contractAddress={contractAddress} />
    </div>
  );
};

export default NFTDataViewer; 