import { useEnv } from "../EnvContext";
import React, { useState, useEffect } from "react";

const SendTransaction = ({ JWT, selectedWallet }) => {
  const { API_SERVER } = useEnv();

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    // update state when wallet is changed

    setAmount("");
    setTransactionHash("");
  }, [selectedWallet]);

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

  const copyTransaction = () => {
    navigator.clipboard.writeText(transactionHash);
    alert("Transaction hash copied to clipboard!");
  };

  return (
    <>
      {/* Divider */}
      <hr className="my-4" />
      <p class="section">Send Transaction</p>
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
  );
};

export default SendTransaction;
