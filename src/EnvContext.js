import React, { createContext, useContext } from "react";

const EnvContext = createContext();

export const EnvProvider = ({ children }) => {
  const DYNAMIC_ENVIRONMENT_ID = process.env.REACT_APP_DYNAMIC_ENVIRONMENT_ID;
  const API_SERVER = process.env.REACT_APP_API_URL;

  return (
    <EnvContext.Provider value={{ DYNAMIC_ENVIRONMENT_ID, API_SERVER }}>
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => useContext(EnvContext);
