import { useEnv } from "../EnvContext";
import React, { useState, useEffect } from "react";

const ChooseWallet = ({ JWT, wallets, selectedWallet, setSelectedWallet }) => {
  const { API_SERVER } = useEnv();

  const [balance, setBalance] = useState("");

  useEffect(() => {
    // update state when wallet is changed
    setBalance("");
  }, [selectedWallet]);

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

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(selectedWallet);
    alert("Wallet address copied to clipboard!");
  };

  return (
    <>
      {/* Divider */}
      <hr className="my-4" />

      <p className="section">Choose Wallet</p>
      <div className="d-flex gap-3">
        <select
          id="walletDropdown"
          value={selectedWallet}
          onChange={(e) => {
            setBalance("");
            setSelectedWallet(e.target.options[e.target.selectedIndex].value);
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
              Balance: {Math.trunc(balance * 10000) / 10000} ETH
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ChooseWallet;
