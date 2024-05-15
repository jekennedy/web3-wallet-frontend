import { useEnv } from "../EnvContext";

const CreateWallet = ({ JWT, setWallets }) => {
  const { API_SERVER } = useEnv();

  const createWallet = () => {
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

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={createWallet}
        className="btn btn-primary primary-radius px-5 primary-radius"
      >
        Create New Wallet
      </button>
    </div>
  );
};

export default CreateWallet;
