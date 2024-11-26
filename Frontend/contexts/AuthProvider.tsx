import React, { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const AuthContext = createContext({
  address: "",
  isConnected: false,
  status: "",
  isLoading: true,
});

const AuthProvider = ({ children }) => {
  const { address, status, isConnected } = useAccount();

  const [authInfo, setAuthInfo] = useState({
    address: address,
    status: status,
    isConnected: isConnected,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Update loading state based on account status
    if (status === "connected" || status === "disconnected") {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    console.log("Auth provider address: ", address);
    console.log("Auth provider connection status: ", isConnected);
    setAuthInfo({ address, status, isConnected });
  }, [address, isConnected, status]);

  return (
    <AuthContext.Provider
      value={{
        address: authInfo.address,
        isConnected: authInfo.isConnected,
        status: status,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
