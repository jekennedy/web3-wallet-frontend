import { toast } from "react-toastify";

import { useEnv } from "../EnvContext";

const CreateWallet = ({ JWT, setWallets, walletsRef }) => {
  const { API_SERVER } = useEnv();

  const createWallet = () => {
    fetch(`${API_SERVER}/wallets`, {
      method: "POST",
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
        setWallets((prevWallets) => [...prevWallets, data.address]);
        if (walletsRef.current) {
          walletsRef.current.classList.add("flash");
          setTimeout(() => {
            walletsRef.current.classList.remove("flash");
          }, 1000);
        }
        toast.success("Wallet created successfully!");
      })
      .catch((error) => {
        toast.error(`Failed to create wallet: ${error.message}`);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="text-center">
        <button
          type="button"
          onClick={createWallet}
          className="btn btn-primary primary-radius px-5 primary-radius"
        >
          Create New Wallet
        </button>
      </div>
    </>
  );
};

export default CreateWallet;
