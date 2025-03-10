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

// Updated ABI to match the new contract
const contractABI = [
  "function getTokenInfo(uint256 tokenId) external view returns (tuple(uint256 tokenId, string info, string value, uint8 referenceDay, uint8 referenceMonth, uint16 referenceYear, uint256 version))",
  "function getDadosByData(uint8 diaRef, uint8 mesRef) external view returns (tuple(uint256 tokenId, string info, string value, uint8 referenceDay, uint8 referenceMonth, uint16 referenceYear, uint256 version)[])",
  "function mintNFT(string info, string value, string _tokenURI, uint8 referenceDay, uint8 referenceMonth, uint16 referenceYear, uint256 version, uint256 ibge) public",
  "function getDadosIBGE(uint256 ibge, uint16 yearReference) external view returns (tuple(uint256 tokenId, string info, string value, uint8 referenceDay, uint8 referenceMonth, uint16 referenceYear, uint256 version)[])",
  "function getIBGE(address addr) external view returns (uint256)",
  "function getAddressByIBGE(uint256 ibge) external view returns (address)"
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

export const getTokenInfo = async (contractAddress, tokenId) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getTokenInfo(tokenId);
    
    return {
      tokenId: result.tokenId.toString(),
      info: result.info,
      value: result.value,
      referenceDay: result.referenceDay,
      referenceMonth: result.referenceMonth,
      referenceYear: result.referenceYear,
      version: result.version.toString()
    };
  } catch (error) {
    console.error('getTokenInfo error:', error);
    handleContractError(error);
  }
};

export const getDadosByData = async (contractAddress, day, month) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getDadosByData(day, month);
    
    return result.map(token => ({
      tokenId: token.tokenId.toString(),
      info: token.info,
      value: token.value,
      referenceDay: token.referenceDay,
      referenceMonth: token.referenceMonth,
      referenceYear: token.referenceYear,
      version: token.version.toString()
    }));
  } catch (error) {
    console.error('getDadosByData error:', error);
    handleContractError(error);
  }
};

export const getDadosIBGE = async (contractAddress, ibge, yearReference) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getDadosIBGE(ibge, yearReference);
    
    return result.map(token => ({
      tokenId: token.tokenId.toString(),
      info: token.info,
      value: token.value,
      referenceDay: token.referenceDay,
      referenceMonth: token.referenceMonth,
      referenceYear: token.referenceYear,
      version: token.version.toString()
    }));
  } catch (error) {
    console.error('getDadosIBGE error:', error);
    handleContractError(error);
  }
};

export const getIBGE = async (contractAddress, walletAddress) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getIBGE(walletAddress);
    return result.toString();
  } catch (error) {
    console.error('getIBGE error:', error);
    handleContractError(error);
  }
};

export const getAddressByIBGE = async (contractAddress, ibgeCode) => {
  try {
    const contract = await getContractData(contractAddress);
    const result = await contract.getAddressByIBGE(ibgeCode);
    return result;
  } catch (error) {
    console.error('getAddressByIBGE error:', error);
    handleContractError(error);
  }
}; 