import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useEnv } from "../EnvContext";

const ChooseWallet = ({
  JWT,
  wallets,
  selectedWallet,
  setSelectedWallet,
  walletsRef,
}) => {
  const { API_SERVER } = useEnv();

  const [balance, setBalance] = useState("");
  // used for disabing/enabling spinner on button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // update state when wallet is changed
    setBalance("");
  }, [selectedWallet]);

  const fetchBalance = () => {
    if (!selectedWallet) {
      toast.error("A wallet must first be selected");
      return;
    }
    setLoading(true);
    fetch(`${API_SERVER}/wallets/${selectedWallet}/balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error?.message || "Unknown error";
          throw new Error(errorMessage);
        }
      })
      .then((data) => {
        setBalance(data.balance);
        toast.success("Balance retrieved successfully!");
      })
      .catch((error) => {
        toast.error(`Failed to fetch balance: ${error.message}`);
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(selectedWallet);
    toast.info("Wallet address copied to clipboard!");
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
          ref={walletsRef}
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
            disabled={loading}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              "Get Balance"
            )}
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
