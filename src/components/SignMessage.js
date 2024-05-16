import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useEnv } from "../EnvContext";

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
      toast.error("A wallet must be selected first");
      return;
    }
    if (!message.trim()) {
      toast.error("Message is required");
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
        setSignedMessage(data.message);
        toast.success("Message signed successfully!");
      })
      .catch((error) => {
        toast.error(`Failed to sign message: ${error.message}`);
        console.error("Error:", error);
      });
  };

  const copySignedMessage = () => {
    navigator.clipboard.writeText(signedMessage);
    toast.info("Signed message copied to clipboard!");
  };

  return (
    <>
      <hr className="my-4" />
      <p className="section">Sign Message</p>
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
