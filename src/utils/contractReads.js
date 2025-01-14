import { ethers } from 'ethers';

// Create provider with explicit network configuration
const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-amoy.g.alchemy.com/v2/XFI_b3XbGnLmJ90fLjA__3q2CtwY4VRX"
  );
//mude para o rpc do seu blockchain, no nosso caso é o polygon amoy (rede teste)
  



// Simple connection test
provider.getNetwork().then(network => {
  console.log('Connected to network:', network.name, 'chainId:', network.chainId);
}).catch(error => {
  console.error('Network connection error:', error);
});

const contractABI = [
  "function getMintInfo(uint256 tokenId) external view returns (uint256, uint256, uint256)",
  "function getTotalPagTpu(uint256 tokenId) external view returns (bytes[] memory azulValues, bytes[] memory verdeValues)",
  "function getTickets(uint256 tokenId, uint256 deviceId) external view returns (uint256 ticketAzul, uint256 ticketVerde)",
  "function getPagTpu(uint256 tokenId, uint256 deviceId) external view returns (bytes pagTpuAzul, bytes pagTpuVerde)"
];

const handleContractError = (error) => {
  console.error('Contract error:', error);
  if (error.code === 'CALL_EXCEPTION') {
    throw new Error('Token not found or invalid input');
  }
  throw error;
};

export const getContractData = async (contractAddress) => {
  try {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return contract;
  } catch (error) {
    console.error('Error creating contract instance:', error);
    throw error;
  }
};

export const getMintInfo = async (contractAddress, tokenId) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getMintInfo(tokenId);
    
    return {
      value: result[0].toString(),
      referenceDay: result[1].toString(),
      referenceMonth: result[2].toString()
    };
  } catch (error) {
    console.error('getMintInfo error:', error);
    handleContractError(error);
  }
};

export const getTickets = async (contractAddress, tokenId, deviceId) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getTickets(tokenId, deviceId);
    
    return {
      ticketAzul: result.ticketAzul.toString(),
      ticketVerde: result.ticketVerde.toString()
    };
  } catch (error) {
    console.error('getTickets error:', error);
    handleContractError(error);
  }
};

export const getPagTpu = async (contractAddress, tokenId, deviceId) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getPagTpu(tokenId, deviceId);
    
    return {
      pagTpuAzul: result.pagTpuAzul || '0x00',
      pagTpuVerde: result.pagTpuVerde || '0x00'
    };
  } catch (error) {
    console.error('getPagTpu error:', error);
    handleContractError(error);
  }
};

export const getTotalPagTpu = async (contractAddress, tokenId) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getTotalPagTpu(tokenId);
    
    return {
      azulValues: result.azulValues.map(v => v || '0x00'),
      verdeValues: result.verdeValues.map(v => v || '0x00')
    };
  } catch (error) {
    console.error('getTotalPagTpu error:', error);
    handleContractError(error);
  }
}; 