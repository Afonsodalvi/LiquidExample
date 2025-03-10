# NFT Minting and Reading Application

A React application for interacting with a simple NFT smart contract on the Polygon Amoy testnet. This project allows users to mint new NFTs and read NFT data through a clean interface.

## Smart Contract

The application interacts with a smart contract deployed on the Polygon Amoy testnet:

- **Contract Address**: [0x87d563dD62092222D61b6F85a88A6f774F051596](https://amoy.polygonscan.com/address/0x87d563dD62092222D61b6F85a88A6f774F051596)
- **Network**: Polygon Amoy (Testnet)
- **Chain ID**: 80002

## Features

### 1. NFT Data Reading

- **Token Information**: View token details including info, value, reference day, and reference month
- **Date-based Search**: Search for tokens by reference day and month

### 2. NFT Minting

- Simple interface for minting new NFTs
- Transaction status tracking
- Error handling and feedback
- Explorer link for successful transactions

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Access to Polygon Amoy testnet

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Add the following to your .env file:

```bash
REACT_APP_RPC_BLOCKCHAIN=https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
REACT_APP_CONTRACT_ID=0x74D6C808995Cdc81299A4C0228e3A8ed8a9caf17
REACT_APP_AUTH_TOKEN=your_authentication_token
```

4. Start the application:

```bash
npm start
```

## Smart Contract Functions

### Read Functions

1. `getTokenInfo(uint256 tokenId)`

   - Returns: TokenInfo struct (tokenId, info, value, referenceDay, referenceMonth)
   - Gets detailed information about a specific token

2. `getDadosByData(uint8 diaRef, uint8 mesRef)`

   - Returns: Array of TokenInfo structs
   - Retrieves all tokens for a specific reference date

3. `getIBGE(address addr)`
   - Returns: uint256 (IBGE code)
   - Gets the IBGE code associated with a specific wallet address

### Write Functions

1. `mintNFT(string info, string value, string _tokenURI, uint8 referenceDay, uint8 referenceMonth)`
   - Mints a new NFT with the specified parameters
   - Validates day (1-31) and month (1-12)
   - Requires non-empty value

## Network Information

### Polygon Amoy Testnet

- **Network Name**: Polygon Amoy
- **RPC URL**: https://polygon-amoy.g.alchemy.com/v2/
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: [Amoy PolygonScan](https://amoy.polygonscan.com)

## Project Structure

```
src/
├── components/
│   ├── CreateWallet.js
│   ├── MintNFTSimple.js
│   ├── NFTDataViewer.js
│   └── NFTReaders/
│       ├── TokenInfoReader.js
│       ├── DadosByDataReader.js
│       ├── DadosByIBGEReader.js
│       └── GetIBGE.js
├── utils/
│   └── contractReads.js
├── App.js
└── index.js
```

## Example payloads for API interactions

### 1. Minting NFT

```bash
curl --location 'https://protocol-sandbox.lumx.io/v2/transactions/custom' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_auth_token>' \
--data '{
    "walletId": "2eebf08a-faf6-4bef-ad43-6461021114ef",
    "contractAddress": "0x74D6C808995Cdc81299A4C0228e3A8ed8a9caf17",
    "operations": [{
        "functionSignature": "mintNFT(string,string,string,uint8,uint8,uint16,uint256)",
        "argumentsValues": [
            "Test Info",
            "Test Value",
            "https://example.com/metadata",
            1,
            1,
            2024,
            1
        ]
    }]
}'
```

### Como que esta a ordem de referencia do dia, mes e ano e tambem a versao:

```javascript
function mintNFT(
        string memory info,
        string memory value,
        string memory _tokenURI,
        uint8 referenceDay,
        uint8 referenceMonth,
        uint16 referenceYear,
        uint256 version
    ) public {
```

### 2. Setting IBGE Code

- Obs: Tem que ser a walletId: `0added59-15a1-48cf-8a06-96269ab69e5c` ela esta como Admin e tem permissao para setar o IBGE

```bash
curl --location 'https://protocol-sandbox.lumx.io/v2/transactions/custom' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_auth_token>' \
--data '{
    "walletId": "0added59-15a1-48cf-8a06-96269ab69e5c",
    "contractAddress": "0x74D6C808995Cdc81299A4C0228e3A8ed8a9caf17",
    "operations": [{
        "functionSignature": "setIBGE(address,uint256)",
        "argumentsValues": [
            "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            123456
        ]
    }]
}'
```

### 3. Getting Wallet Address by Wallet ID

```bash
curl --location 'https://protocol-sandbox.lumx.io/v2/wallets/<wallet_id>?includeTokens=false' \
--header 'Authorization: Bearer <your_auth_token>'
```

Example response for wallet lookup:

```json
{
  "id": "2eebf08a-faf6-4bef-ad43-6461021114ef",
  "address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "blockchain": "polygon-amoy",
  "createdAt": "2024-03-20T10:00:00.000Z"
}
```

### 4. Getting IBGE Code for an Address

```javascript
// Using ethers.js
const contract = new ethers.Contract(contractAddress, contractABI, provider);
const ibgeCode = await contract.getIBGE(
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
);
console.log("IBGE Code:", ibgeCode.toString());

// Using the provided utility function
import { getIBGE } from "./utils/contractReads";
const ibgeCode = await getIBGE(
  contractAddress,
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
);
console.log("IBGE Code:", ibgeCode);
```

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License.
