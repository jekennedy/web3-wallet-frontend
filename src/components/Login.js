import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { useEnv } from "../EnvContext";

const Login = ({
  setJWT,
  setWallets,
  verifyingLogin,
  setVerifyingLogin,
  setSelectedWallet,
}) => {
  const { DYNAMIC_ENVIRONMENT_ID, API_SERVER } = useEnv();

  // acts similar to a nonce: used by Dynamic's API to ensure the OTP matches the initial request
  const [UUID, setUUID] = useState("");

  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  // Create a refs for setting focus
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  //TODO testing method to avoid hitting dynamic api
  const sendEmailVerificationTest = async () => {
    console.log("setting jwt");
    setJWT(
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNiMDAyYzM0LTVjMGEtNGFjNC04MDY3LTc3ZmMxYjcxMzg2MyJ9.eyJraWQiOiIzYjAwMmMzNC01YzBhLTRhYzQtODA2Ny03N2ZjMWI3MTM4NjMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJpc3MiOiJhcHAuZHluYW1pY2F1dGguY29tL2JhMGQwYTgyLTYwZDUtNGQ2My04ZjYxLTI5ZTMzMzFlZWJjOCIsInN1YiI6IjcxNzlhZGUwLTBhMTQtNDQyYi04ODViLTYyMTg2NThmN2Y0NCIsInNpZCI6IjYxOWFkZjI4LTc5NGMtNGRkYy04ZGQyLWQyNjBhZmE5MTkwOCIsImJsb2NrY2hhaW5fYWNjb3VudHMiOltdLCJlbWFpbCI6Imp1c3RpbisxMTFAanVzdGlua2VubmVkeS5jYSIsImVudmlyb25tZW50X2lkIjoiYmEwZDBhODItNjBkNS00ZDYzLThmNjEtMjllMzMzMWVlYmM4IiwibGlzdHMiOltdLCJtaXNzaW5nX2ZpZWxkcyI6W3sibmFtZSI6ImZpcnN0TmFtZSIsInJlcXVpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlLCJ1bmlxdWUiOmZhbHNlLCJ2ZXJpZnkiOmZhbHNlLCJ0eXBlIjoic3RhbmRhcmQiLCJsYWJlbCI6IkZpcnN0IE5hbWUifSx7Im5hbWUiOiJsYXN0TmFtZSIsInJlcXVpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlLCJ1bmlxdWUiOmZhbHNlLCJ2ZXJpZnkiOmZhbHNlLCJ0eXBlIjoic3RhbmRhcmQiLCJsYWJlbCI6Ikxhc3QgTmFtZSJ9XSwic2NvcGUiOiJ1c2VyRGF0YUZvcm0iLCJ2ZXJpZmllZF9jcmVkZW50aWFscyI6W3siZW1haWwiOiJqdXN0aW4rMTExQGp1c3Rpbmtlbm5lZHkuY2EiLCJpZCI6ImEwOGRiMzJhLWZjM2YtNDIzZC05MTFiLTdkMDY0MTBhZTJhNCIsInB1YmxpY19pZGVudGlmaWVyIjoianVzdGluKzExMUBqdXN0aW5rZW5uZWR5LmNhIiwiZm9ybWF0IjoiZW1haWwiLCJlbWJlZGRlZF93YWxsZXRfaWQiOm51bGx9XSwibGFzdF92ZXJpZmllZF9jcmVkZW50aWFsX2lkIjoiYTA4ZGIzMmEtZmMzZi00MjNkLTkxMWItN2QwNjQxMGFlMmE0IiwiZmlyc3RfdmlzaXQiOiIyMDI0LTA1LTEyVDE3OjIzOjA5Ljg2MloiLCJsYXN0X3Zpc2l0IjoiMjAyNC0wNS0xNVQxMjo0NTowMS44MTRaIiwibmV3X3VzZXIiOmZhbHNlLCJtZXRhZGF0YSI6e30sImlhdCI6MTcxNTc3NzEwMiwiZXhwIjoxNzE4MzY5MTAyfQ.JsRjsgHKxiapDCBYFW1Pzl9Fm4Fya5_fJjAb9dYemYr2IVrs9K0KsDB-Wu_8HZuvbbEnpCt4VbpFPwOD6BSVNkAYjvAGj71cab-5Ot6yaLx3tCT6TBjZoDOwSbpfJeS-8G3r6REuRlStbzsNP7E0FUM1coqMST_Um9u_vklvIi8zZVSB8NLk-9BtvvDbDbSqEiJIKo6tYbqZ7MjUTeUNv-bvK7RbaS2SNtd7BjGpMQ7FaZtKEbkhGw7tLhivh23DqjtNgRMOpIWkRKTkZwwUn4tHJG49xcGvwqzf7lwYZSqR_XyirKh_FLoCyEJ46I16QfZa9GfqA8hk1580uOGEmttEFYbxsdIErVCrTJrB-gzLRtDHeoyyF5ayRhCXErXtZMjNHyznV_BD_hn-O4iMB0m8SYYA24nCNFIK9GJyKBVW_FNfvgtLh7-FgLT_CtNQwCWlKls_0qE1WXkbmDOZKGlKSWAMtLnw6xsKDiraZVm8qefIFUu3Dn_NwzqrQb_GxXqbCeQQp9FtH3cyEN75qMKbnVMY65m4U71C4GdCwJJLzyOqqTjgEhnh2s23FEDASzQcC26QYtqlsA5lyf_Gsl4OKDMOB2NV5z0Xh0Nj7oJv_DeRlGTDPkY4Plg23Otb5uXrA6NfAaXOoZmCaKXIF6L33NPhDbTXPEeGYU5i8kg"
    );

    setWallets([
      "0x2B004B695C6de5815b528dfE8A16CfdE28EF1746",
      "0x772d50d6af16bE57F5AaF4d0266317b987ba168d",
    ]);
  };

  const sendEmailVerification = () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setVerifyingLogin(true);
    setSelectedWallet("");

    fetch(
      `https://app.dynamicauth.com/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/emailVerifications/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    )
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error || "Unknown error";
          throw new Error(errorMessage);
        }
      })
      .then((data) => {
        setUUID(data.verificationUUID);
        console.log("Verification email sent successfully");
      })
      .catch((err) => {
        setVerifyingLogin(false);
        toast.error(`Error logging in: ${err.message}`);
        console.error("Error:", err);
      });
  };

  const verify = () => {
    if (!OTP) {
      toast.error("OTP is required");
      return;
    }

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
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const errorResponse = await response.json();
          const errorMessage = errorResponse.error || "Unknown error";
          throw new Error(errorMessage);
        }
      })
      .then((data) => {
        setJWT(data.jwt);
        setVerifyingLogin(false);
        console.log("**** JWT is set to:", data.jwt);

        return fetch(`${API_SERVER}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.jwt}`,
            "Content-Type": "application/json",
          },
        });
      })
      .then(async (userResponse) => {
        if (userResponse.ok) {
          setVerifyingLogin(false);
          return userResponse.json();
        } else {
          const errorResponse = await userResponse.json();
          const errorMessage = errorResponse.error?.message || "Unknown error";
          throw new Error(errorMessage);
        }
      })
      .then((userData) => {
        if (
          userData.wallets &&
          Array.isArray(userData.wallets) &&
          userData.wallets.length > 0
        ) {
          const walletAddresses = userData.wallets.map(
            (wallet) => wallet.address
          );
          setWallets(walletAddresses);
        } else {
          toast.error("No wallets found or unexpected response format");
          console.log("Error", userData);
          setWallets([]);
        }
      })
      .catch((err) => {
        toast.error(`Error logging in: ${err.message}`);
        console.error("Error:", err);
      });
  };

  // Use useEffect to focus the OTP input when verifying is true
  useEffect(() => {
    if (verifyingLogin && otpInputRef.current) {
      setOTP("");
      otpInputRef.current.focus();
    } else if (!verifyingLogin && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [verifyingLogin]);

  return (
    <>
      <div className="mb-3 w-100">
        <div className="d-flex gap-3 w-100">
          <div className="form-group w-100">
            <input
              type="email"
              className="form-control primary-radius"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              ref={emailInputRef}
              placeholder="Enter your email"
              value={email}
              required
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={() => sendEmailVerification()}
              style={{ width: "130px" }}
              className="btn btn-primary primary-radius"
            >
              Login
            </button>
          </div>
        </div>
        {verifyingLogin && (
          <div id="wrapper-verify" className="d-flex gap-3">
            <div className="form-group w-100">
              <input
                type="text"
                onChange={(e) => setOTP(e.target.value)}
                ref={otpInputRef}
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
                onClick={() => verify()}
                style={{ width: "130px" }}
                className="btn btn-primary primary-radius"
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
