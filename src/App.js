import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Define the EmailSignup component
const EmailSignup = () => {
  const DYNAMIC_ENVIRONMENT_ID = process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID;
  const API_SERVER = process.env.REACT_APP_API_URL;

  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [OTP, setOTP] = useState("");
  const [UUID, setUUID] = useState("");
  const [JWT, setJWT] = useState("");
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const resetForm = () => {
    setVerifying(false);
    setOTP("");
    setUUID("");
    setJWT("");
    setWallets([]);
    setSelectedWallet("");
    setBalance("");
    setMessage("");
    setSignedMessage("");
  };

  const copyTransaction = () => {
    navigator.clipboard.writeText(transactionHash);
    alert("Transaction hash copied to clipboard!");
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(selectedWallet);
    alert("Wallet address copied to clipboard!");
  };

  const copySignedMessage = () => {
    navigator.clipboard.writeText(signedMessage);
    alert("Signed message copied to clipboard!");
  };

  const sendEmailVerification = async () => {
    resetForm();
    setVerifying(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    };

    fetch(
      `https://app.dynamicauth.com/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/emailVerifications/create`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setUUID(response.verificationUUID);
      })
      .catch((err) => {
        console.error(err);
        setVerifying(false); // Reset verifying state in case of error
      });
  };

  const verify = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verificationToken: OTP,
        verificationUUID: UUID,
      }),
    };
    fetch(
      `https://app.dynamicauth.com/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/emailVerifications/signIn`,
      options
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        setVerifying(false);
        setJWT(response.jwt);

        // Optionally fetch existing wallets for the user
        return fetch(`${API_SERVER}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.jwt}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // If there are wallets, update the Wallets select
        if (
          data.wallets &&
          Array.isArray(data.wallets) &&
          data.wallets.length > 0
        ) {
          const walletAddresses = data.wallets.map((wallet) => wallet.address);
          setWallets(walletAddresses); // Update wallets state with addresses
        } else {
          console.log("No wallets found or unexpected response format:", data);
          setWallets([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setVerifying(false); // Ensure state is updated correctly on error
      });
  };

  const createWallet = async () => {
    fetch(`${API_SERVER}/wallets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to create wallet: ${response.statusText}`);
        }
      })
      .then((data) => {
        console.log("Create wallet successful: Address %s", data.address);
        setWallets((prevWallets) => [...prevWallets, data.address]);
      })
      .catch((error) => {
        console.error("Error creating wallet:", error);
      });
  };

  const fetchBalance = () => {
    if (!selectedWallet) {
      alert("Please select a wallet first.");
      return;
    }
    fetch(`${API_SERVER}/wallets/${selectedWallet}/balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch balance");
        }
      })
      .then((data) => {
        console.log("Get balance successful: Balance %s", data.balance);
        setBalance(data.balance);
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
  };

  const signMessage = () => {
    if (!selectedWallet) {
      alert("Please select a wallet first.");
      return;
    }
    if (!message.trim()) {
      alert("Please enter a message to sign.");
      return;
    }
    fetch(`${API_SERVER}/wallets/${selectedWallet}/sign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to sign message: Status ${response.status}`);
        }
      })
      .then((data) => {
        console.log("Sign message successful: Signed message %s", data.message);
        setSignedMessage(data.message);
      })
      .catch((error) => {
        console.error("Error signing message:", error);
      });
  };

  const sendTransaction = () => {
    if (!selectedWallet) {
      alert("Please select a wallet first.");
      return;
    }
    if (!toAddress.trim()) {
      alert("Please enter a recipient address.");
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      alert("Please enter a valid amount.");
      return;
    }

    fetch(`${API_SERVER}/wallets/${selectedWallet}/sendTransaction`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toAddress, amount }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            `Failed to send transaction: Status ${response.status}`
          );
        }
      })
      .then((data) => {
        console.log("Transaction successful: Hash %s", data.transactionHash);
        setTransactionHash(data.transactionHash);
      })
      .catch((error) => {
        console.error("Error sending transaction:", error);
      });
  };

  return (
    <div className="App">
      <h1 className="text-center mb-3">Signup / Login</h1>
      <div className=" mb-3 w-100">
        {/* Email Form */}
        <div className="d-flex gap-3 w-100">
          <div className="form-group w-100">
            <input
              type="email"
              className="form-control primary-radius"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              value={email}
              required
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={sendEmailVerification}
              style={{ width: "130px" }}
              className="btn btn-primary primary-radius"
            >
              Login
            </button>
          </div>
        </div>
        {verifying && (
          <div id="wrapper-verify" className="d-flex gap-3">
            <div className="form-group w-100">
              <input
                type="text"
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter your OTP"
                value={OTP}
                name="otp"
                className="form-control primary-radius"
                required
              />
            </div>
            <div className="form-group">
              <button
                type="button"
                onClick={verify}
                style={{ width: "130px" }}
                className="btn btn-primary primary-radius"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </div>
      {/* New Wallet Button */}
      {JWT && (
        <div className="text-center">
          <button
            type="button"
            onClick={createWallet}
            className="btn btn-primary primary-radius px-5 primary-radius"
          >
            Create New Wallet
          </button>
        </div>
      )}
      {/* Choose Wallet */}
      {wallets.length > 0 && (
        <>
          {/* Divider */}
          <hr className="my-4" />

          <p>Choose Wallet:</p>
          <div className="d-flex gap-3">
            <select
              id="walletDropdown"
              value={selectedWallet}
              onChange={(e) => {
                setSelectedWallet(
                  e.target.options[e.target.selectedIndex].value
                );
                setBalance("");
                setSignedMessage("");
                setMessage("");
              }}
              className="form-control primary-radius "
            >
              <option value="">Select a wallet</option>
              {wallets.map((wallet, index) => (
                <option key={index} value={wallet}>
                  {wallet}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={copyWalletAddress}
              className="btn btn-primary primary-radius"
            >
              Copy
            </button>
          </div>

          {/* Get Balance */}

          {selectedWallet && (
            <div className="d-flex gap-3 mt-3 align-items-center justify-content-between ">
              <button
                type="button"
                className="btn px-4 btn-primary primary-radius"
                onClick={fetchBalance}
              >
                Get Balance
              </button>
              {balance && (
                <p className="mb-0">
                  Balance: {Math.trunc(balance * 10000) / 10000}
                </p>
              )}
            </div>
          )}
        </>
      )}
      {/* Send Transaction */}
      {selectedWallet && (
        <>
          {/* Divider */}
          <hr className="my-4" />
          <p>Send Transaction:</p>
          <div className=" mb-3">
            <div className="">
              <p>Destination:</p>
              <input
                type="text"
                onChange={(e) => setToAddress(e.target.value)}
                value={toAddress}
                className="w-100 form-control primary-radius mb-3"
                name="toAddress"
                placeholder="Enter recipient's address"
              />
            </div>
          </div>
          <div className="d-flex gap-3 align-items-center mb-3">
            <p className="mb-0">Amount:</p>
            <input
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              id="amount"
              name="amount"
              className="form-control primary-radius "
              placeholder="Enter amount to send"
            />
            <button
              type="button"
              onClick={sendTransaction}
              className="btn px-2 btn-primary primary-radius "
            >
              Send
            </button>
          </div>

          {transactionHash && (
            <div className="mb-3">
              <p>Transaction hash:</p>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control primary-radius"
                  value={transactionHash}
                  readOnly
                />
                <button
                  className="btn btn-primary primary-radius"
                  onClick={copyTransaction}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {/* Sign Message */}
      {selectedWallet && (
        <>
          {/* Divider */}
          <hr className="my-4" />
          <p>Sign Message:</p>
          <div className=" mb-3">
            <div className="">
              <textarea
                id="message"
                name="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-control primary-radius"
                rows={4}
                placeholder="Message to sign"
              ></textarea>
            </div>
          </div>
          <button
            type="button"
            onClick={signMessage}
            className="btn px-5 mb-3 btn-primary primary-radius"
          >
            Sign
          </button>

          {signedMessage && (
            <div className="mb-3">
              <p>Signed Message:</p>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control primary-radius mr-3"
                  value={signedMessage}
                  readOnly
                />
                <button
                  className="btn btn-primary primary-radius"
                  onClick={copySignedMessage}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {JWT && <div id="jwt">{JWT}</div>}
    </div>
    /* return App*/
  );
  /* return EmailSignup*/
};

// Define the root App component to include EmailSignup
const App = () => {
  return (
    <div>
      <EmailSignup />
    </div>
  );
};

export default App;
