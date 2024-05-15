import { useEnv } from "../EnvContext";
import React, { useState, useEffect } from "react";

const SignMessage = ({ JWT, selectedWallet }) => {
  const { API_SERVER } = useEnv();

  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");

  useEffect(() => {
    // update state when wallet is changed
    setMessage("");
    setSignedMessage("");
  }, [selectedWallet]);

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

  const copySignedMessage = () => {
    navigator.clipboard.writeText(signedMessage);
    alert("Signed message copied to clipboard!");
  };

  return (
    <>
      <hr className="my-4" />
      <p class="section">Sign Message</p>
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
  );
};

export default SignMessage;
