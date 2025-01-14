# Leitor e Mint de NFT

Uma aplicação React para interagir com smart contracts NFT na rede de teste Polygon Amoy. Este projeto permite aos usuários ler dados de NFTs e criar novos NFTs através de uma interface simples.

## Smart Contract
A aplicação interage com um smart contract implantado na rede de teste Polygon Amoy:
- **Endereço do Contrato**: [0x14915Be6fb5900B5D26CD356C4bB256ed708d097](https://amoy.polygonscan.com/address/0x14915Be6fb5900B5D26CD356C4bB256ed708d097#readContract)
- **Rede**: Polygon Amoy (Rede de Teste)
- **Chain ID**: 80002

## Funcionalidades

### 1. Leitura de Dados NFT
- **Informações de Mint**: Visualize detalhes do token incluindo valor, dia de referência e mês de referência
- **Dados PagTpu**: Acesse valores PagTpu para Zona Azul e Zona Verde
- **Tickets**: Visualize informações de tickets para diferentes dispositivos
- **PagTpu Total**: Obtenha dados agregados de PagTpu

### 2. Criação de NFT (Mint)
- Interface simples para mint
- Acompanhamento do status da transação
- Tratamento de erros e feedback

## Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn
- MetaMask ou carteira Web3 similar
- Acesso à rede de teste Polygon Amoy

### Instalação
1. Clone o repositório:

```bash
git clone [url-do-repositório]
cd [diretório-do-projeto]
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

```bash
REACT_APP_RPC_BLOCKCHAIN=https://polygon-amoy.g.alchemy.com/v2/SUA_CHAVE_ALCHEMY
REACT_APP_CONTRACT_ID=0x14915Be6fb5900B5D26CD356C4bB256ed708d097
REACT_APP_AUTH_TOKEN=seu_token_de_autenticação
```

4. Inicie a aplicação:

```bash
npm start
```


## Funções do Smart Contract

### Funções de Leitura
1. `getMintInfo(uint256 tokenId)`
   - Retorna: (uint256, uint256, uint256)
   - Obtém informações básicas sobre um token mintado

2. `getTotalPagTpu(uint256 tokenId)`
   - Retorna: (bytes[] azulValues, bytes[] verdeValues)
   - Recupera valores totais de PagTpu para ambas as zonas

3. `getTickets(uint256 tokenId, uint256 deviceId)`
   - Retorna: (uint256 ticketAzul, uint256 ticketVerde)
   - Obtém informações de tickets para dispositivo específico

4. `getPagTpu(uint256 tokenId, uint256 deviceId)`
   - Retorna: (bytes pagTpuAzul, bytes pagTpuVerde)
   - Recupera dados PagTpu para um dispositivo específico

### IDs dos Dispositivos
O sistema suporta vários dispositivos identificados pelos seguintes IDs:
- 1: Parquímetro
- 2: Monitor
- 3: PDV
- 4: App
- 5: WhatsApp
- 6: Site

## Informações da Rede

### Rede de Teste Polygon Amoy
- **Nome da Rede**: Polygon Amoy
- **URL RPC**: https://polygon-amoy.g.alchemy.com/v2/
- **Chain ID**: 80002
- **Símbolo da Moeda**: MATIC
- **Explorador de Blocos**: [Amoy PolygonScan](https://amoy.polygonscan.com)

## Estrutura do Projeto

