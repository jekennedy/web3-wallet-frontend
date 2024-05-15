import React, { useState, useEffect, useRef } from "react";
import { useEnv } from "../EnvContext";

const Login = ({
  setJWT,
  setWallets,
  verifyingLogin,
  setVerifyingLogin,
  setSelectedWallet,
}) => {
  const { DYNAMIC_ENVIRONMENT_ID, API_SERVER } = useEnv();
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");
  const [UUID, setUUID] = useState("");

  // Create a refs for setting focus
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  const sendEmailVerification = async () => {
    //TODO testing
    /*
      console.log("setting jwt");
      setJWT(
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNiMDAyYzM0LTVjMGEtNGFjNC04MDY3LTc3ZmMxYjcxMzg2MyJ9.eyJraWQiOiIzYjAwMmMzNC01YzBhLTRhYzQtODA2Ny03N2ZjMWI3MTM4NjMiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJpc3MiOiJhcHAuZHluYW1pY2F1dGguY29tL2JhMGQwYTgyLTYwZDUtNGQ2My04ZjYxLTI5ZTMzMzFlZWJjOCIsInN1YiI6IjcxNzlhZGUwLTBhMTQtNDQyYi04ODViLTYyMTg2NThmN2Y0NCIsInNpZCI6ImVkODgxNzk3LTk5YWItNGEyNy1iOGYxLTMwZTVhZTViMjFiMSIsImJsb2NrY2hhaW5fYWNjb3VudHMiOltdLCJlbWFpbCI6Imp1c3RpbisxMTFAanVzdGlua2VubmVkeS5jYSIsImVudmlyb25tZW50X2lkIjoiYmEwZDBhODItNjBkNS00ZDYzLThmNjEtMjllMzMzMWVlYmM4IiwibGlzdHMiOltdLCJtaXNzaW5nX2ZpZWxkcyI6W3sibmFtZSI6ImZpcnN0TmFtZSIsInJlcXVpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlLCJ1bmlxdWUiOmZhbHNlLCJ2ZXJpZnkiOmZhbHNlLCJ0eXBlIjoic3RhbmRhcmQiLCJsYWJlbCI6IkZpcnN0IE5hbWUifSx7Im5hbWUiOiJsYXN0TmFtZSIsInJlcXVpcmVkIjp0cnVlLCJlbmFibGVkIjp0cnVlLCJ1bmlxdWUiOmZhbHNlLCJ2ZXJpZnkiOmZhbHNlLCJ0eXBlIjoic3RhbmRhcmQiLCJsYWJlbCI6Ikxhc3QgTmFtZSJ9XSwic2NvcGUiOiJ1c2VyRGF0YUZvcm0iLCJ2ZXJpZmllZF9jcmVkZW50aWFscyI6W3siZW1haWwiOiJqdXN0aW4rMTExQGp1c3Rpbmtlbm5lZHkuY2EiLCJpZCI6ImEwOGRiMzJhLWZjM2YtNDIzZC05MTFiLTdkMDY0MTBhZTJhNCIsInB1YmxpY19pZGVudGlmaWVyIjoianVzdGluKzExMUBqdXN0aW5rZW5uZWR5LmNhIiwiZm9ybWF0IjoiZW1haWwiLCJlbWJlZGRlZF93YWxsZXRfaWQiOm51bGx9XSwibGFzdF92ZXJpZmllZF9jcmVkZW50aWFsX2lkIjoiYTA4ZGIzMmEtZmMzZi00MjNkLTkxMWItN2QwNjQxMGFlMmE0IiwiZmlyc3RfdmlzaXQiOiIyMDI0LTA1LTEyVDE3OjIzOjA5Ljg2MloiLCJsYXN0X3Zpc2l0IjoiMjAyNC0wNS0xNVQwNTo1NDo0NC4xNzZaIiwibmV3X3VzZXIiOmZhbHNlLCJtZXRhZGF0YSI6e30sImlhdCI6MTcxNTc1MjQ4NCwiZXhwIjoxNzE4MzQ0NDg0fQ.diNPJ-ki21lcRzYajM9Nc93GJZoD1fcXyyhC-o5l6oxD-SdhFQV2sGsN4IJeg9XZBLodhXG04Pg6ypqBo2VH6Ui9Fdid3QNwN5l0IdjNwpFQcBhw0PDm_w1Fjv36pXhm0-LuGiaiRybOyImvf95bC7tlx8OiFRN8Gg517y1T5ktr0Ckpdr_bmXIxfUfuKppeUic9yQUXLo6DgWZA_xUmhdl3etzeHf1dXqQ52tmC2q9lzj933mBqrfpIOrv7ZG8Yxounz_0ikzipOpgy63niWgMK77qKB4DzANo2-6NkLEjdjvFaPJPNFNwTbj_Us9VA0aOV8lCq-mu7TshBGIX66_0KBW_e16K7QDKfIabnwUuLEcz_l-owz8kmk7zDterzmCty2W8_mP67FhuOp9uSD5JbFlUAvS2UPZ0nlx9jMjLyFh7ZZ_4rWOPiNEIp5GgyBV3lG7nuEOiHBj527C0cPFflCRl94aKCjPiDhJOSDIyg-Xr1lWuvdz4In7Z9XYb_XABcbs8pevc5wPYcepFwO5gNsydFgxy0WVgBAo4766SO7m-j0f2kYd7bV8l3T0NMFS1alsnxSKU0IyQyK9hIgdQwpsu7Jrjjpz458YVwvl4ppPWvwmeQyigBeSvHVI_fxUIPs8VdNVIvWJx1Yfvvt9vTYiG9b1lMfskgvUXdpew"
      );

      setWallets([
        "0x2B004B695C6de5815b528dfE8A16CfdE28EF1746",
        "0x772d50d6af16bE57F5AaF4d0266317b987ba168d",
      ]);
     */

    setVerifyingLogin(true);
    setSelectedWallet("");

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    };

    try {
      const response = await fetch(
        `https://app.dynamicauth.com/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/emailVerifications/create`,
        options
      );
      const data = await response.json();
      setUUID(data.verificationUUID);
    } catch (err) {
      console.error(err);
      setVerifyingLogin(false); // Reset verifying state in case of error
    }
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

    try {
      const response = await fetch(
        `https://app.dynamicauth.com/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/emailVerifications/signIn`,
        options
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVerifyingLogin(false);
      //TODO
      console.log("****  JWT is set to:", data.jwt);
      setJWT(data.jwt);

      // Optionally fetch existing wallets for the user
      const userResponse = await fetch(`${API_SERVER}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.jwt}`,
          "Content-Type": "application/json",
        },
      });
      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();
      if (
        userData.wallets &&
        Array.isArray(userData.wallets) &&
        userData.wallets.length > 0
      ) {
        const walletAddresses = userData.wallets.map(
          (wallet) => wallet.address
        );
        setWallets(walletAddresses); // Update wallets state with addresses
      } else {
        console.log(
          "No wallets found or unexpected response format:",
          userData
        );
        setWallets([]);
      }
    } catch (err) {
      console.error(err);
      setVerifyingLogin(false); // Ensure state is updated correctly on error
    }
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
  );
};

export default Login;
