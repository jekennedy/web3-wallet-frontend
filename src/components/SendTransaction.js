import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";

import { useEnv } from "../EnvContext";

const SendTransaction = ({ JWT, selectedWallet }) => {
  const { API_SERVER } = useEnv();

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  // used for disabing/enabling spinner on button
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // update state when wallet is changed

    setAmount("");
    setTransactionHash("");
  }, [selectedWallet]);

  const sendTransaction = () => {
    if (!selectedWallet) {
      toast.error("A wallet must be selected first");
      return;
    }
    if (!toAddress.trim()) {
      toast.error("Recipient address is required");
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      toast.error("Amount is required");
      return;
    }

    setLoading(true);

    fetch(`${API_SERVER}/wallets/${selectedWallet}/sendTransaction`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toAddress, amount }),
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
        setTransactionHash(data.transactionHash);
        toast.success("Transaction sent successfully!");
      })
      .catch((error) => {
        toast.error(`Failed to send transaction: ${error.message}`);
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copyTransaction = () => {
    navigator.clipboard.writeText(transactionHash);
    toast.info("Transaction hash copied to clipboard!");
  };

  return (
    <>
      {/* Divider */}
      <hr className="my-4" />
      <p className="section">Send Transaction</p>
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
          disabled={loading}
          className="btn px-2 btn-primary primary-radius "
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : "Send"}
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
