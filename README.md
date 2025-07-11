# Faucet dApp

A decentralized application (dApp) that provides a cryptocurrency faucet service, allowing users to request test tokens for development and testing purposes.

## Description

This project consists of two main components:

1. **Frontend (faucet-ui)**: A React-based web application that provides a user-friendly interface for requesting tokens
2. **Backend (faucet-server)**: An Express.js server that handles token distribution and rate limiting

The faucet allows users to request 10 ACC tokens per hour by simply entering their wallet address. It includes transaction tracking, rate limiting, and a clean, responsive user interface.

## Features

- **Token Distribution**: Automatically sends 10 ACC tokens to valid wallet addresses
- **Rate Limiting**: Prevents abuse by limiting requests to once per hour per wallet
- **Transaction Tracking**: Displays real-time transaction information including hash, status, gas used, and timestamp
- **Wallet Validation**: Ensures only valid Ethereum addresses can receive tokens
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Database Integration**: Uses MySQL to track claim history and enforce rate limits

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database
- Ethereum wallet with testnet tokens (for the faucet operator)

### Frontend Setup (faucet-ui)

1. Navigate to the frontend directory:
   ```bash
   cd faucet-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup (faucet-server)

1. Navigate to the backend directory:
   ```bash
   cd faucet-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   RPC_URL=https://testnet-rpc.acrypto.cloud
   PRIVATE_KEY=your_faucet_wallet_private_key
   PORT=3000
   ```

4. Set up the MySQL database with the required table:
   ```sql
   CREATE TABLE faucet_claims (
     wallet_address VARCHAR(42) PRIMARY KEY,
     last_claim_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );
   ```

5. Start the server:
   ```bash
   npm start
   ```

The backend will be available at `http://localhost:3000`

## Usage

1. Open the web application in your browser
2. Enter a valid Ethereum wallet address (0x...)
3. Click "GET TOKENS" to request 10 ACC tokens
4. Wait for the transaction to be processed
5. View transaction details in the Transaction Data panel

## Technology Stack

- **Frontend**: React, Bulma CSS, Ethers.js
- **Backend**: Node.js, Express.js, Ethers.js
- **Database**: MySQL
- **Blockchain**: Ethereum-compatible testnet

## Rate Limiting

- Users can claim tokens once per hour per wallet address
- Rate limiting is enforced server-side using database timestamps
- Attempts to claim before the cooldown period will result in an error message

## Security Features

- Input validation for wallet addresses
- Server-side rate limiting
- Environment variable protection for sensitive data
- Error handling for failed transactions

## Development

To run both frontend and backend in development mode:

1. Start the backend server first (port 3000)
2. Start the frontend development server (will use port 3001 if 3000 is occupied)
3. The frontend will proxy API requests to the backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.