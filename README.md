# Dynamic Demo Frontend

## Overview

Dynamic Demo Frontend is a React-based single-page application (SPA) designed for managing cryptocurrency wallets, using Dynamic.xyz for the authentication layer, and [Dynamic Demo Backend project](https://github.com/jekennedy/web3-wallet-backend) as the api server.

It provides functionalities for user authentication, wallet creation, wallet management, and executing blockchain transactions.

## Features

- **User Authentication**: Allows users to login or sign up via email and OTP verification.
- **Wallet Management**: Users can create new wallets, select existing wallets, and copy wallet addresses.
- **Balance Inquiry**: Enables users to fetch and display the balance of selected wallets.
- **Transaction Processing**: Supports sending cryptocurrency to other addresses and displays the transaction hash for tracking.
- **Message Signing**: Allows users to sign arbitrary messages using their wallet, which can be useful for proving ownership of a wallet address without exposing private keys.

## Technology Stack

- **React**: Used for building the user interface.
- **Bootstrap**: For styling components and layouts.
- **Node.js**: Expected backend technology for handling API requests (not included in this repository).

## Setup and Installation

1. **Clone the repository:**

   ```bash
   git clone https://your-repository-url.git
   cd dynamic-demo-frontend
   ```

2. **Install dependencies:**
   `npm install`

3. **Configure settings for Dynamic tenant:**
   Refer to: ./src/App.js

4. **Start The Application:**
   `npm start`

5. **Configure Dynamic Demo Backend project:**
   Refer to: https://github.com/jekennedy/web3-wallet-backend

This will run the app in the development mode. Open http://localhost:3000 to view it in the browser.

## Usage

- **Login/Signup**: Start by entering your email to receive an OTP.
- **Verify OTP**: Enter the OTP and click 'Verify'.
- **Creating a Wallet**: Once logged in, you can create a new wallet by clicking 'Create New Wallet'.
- **Managing Wallets**: Select from existing wallets using the dropdown menu to perform actions like checking balances, sending transactions, or signing messages.
- **Sending Transactions**: To send a transaction, choose a wallet, enter the recipient's address and the amount, and click 'Send'.
- **Signing Messages**: Select a wallet and enter a message in the textarea to sign messages.
