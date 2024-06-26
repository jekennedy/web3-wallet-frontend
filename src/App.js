import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import Login from "./components/Login";
import CreateWallet from "./components/CreateWallet";
import ChooseWallet from "./components/ChooseWallet";
import SendTransaction from "./components/SendTransaction";
import SignMessage from "./components/SignMessage";

// Define the main component
const Web3Wallet = () => {
  const [JWT, setJWT] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [verifyingLogin, setVerifyingLogin] = useState(false);

  const walletsRef = useRef("");

  return (
    <div className="App">
      <ToastContainer />

      <h1 className="text-center mb-3">Signup / Login</h1>
      <Login
        setJWT={setJWT}
        setWallets={setWallets}
        setSelectedWallet={setSelectedWallet}
        verifyingLogin={verifyingLogin}
        setVerifyingLogin={setVerifyingLogin}
      />

      {!verifyingLogin && JWT && (
        <CreateWallet
          JWT={JWT}
          setWallets={setWallets}
          walletsRef={walletsRef}
        />
      )}

      {!verifyingLogin && wallets.length > 0 && (
        <ChooseWallet
          JWT={JWT}
          wallets={wallets}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          walletsRef={walletsRef}
        />
      )}

      {!verifyingLogin && selectedWallet && (
        <SendTransaction JWT={JWT} selectedWallet={selectedWallet} />
      )}

      {/* Sign Message */}
      {!verifyingLogin && selectedWallet && (
        <SignMessage JWT={JWT} selectedWallet={selectedWallet} />
      )}

      {JWT && <div id="jwt">{JWT}</div>}
    </div>
    /* return App*/
  );
  /* return Web3Wallet */
};

// Define the root App component to include Web3Wallet
const App = () => {
  return (
    <div>
      <Web3Wallet />
    </div>
  );
};

export default App;
