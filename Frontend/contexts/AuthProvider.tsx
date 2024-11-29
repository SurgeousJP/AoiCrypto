import React, { createContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const AuthContext = createContext({
  address: "",
  isConnected: false,
  status: "",
  isLoading: true,
  chainId: 0 
});

const AuthProvider = ({ children }) => {
  const { chainId, address, status, isConnected } = useAccount();

  const [authInfo, setAuthInfo] = useState({
    address: address,
    status: status,
    isConnected: isConnected,
    chainId: chainId,
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
    setAuthInfo({ address, status, isConnected, chainId });
  }, [address, isConnected, status, chainId]);

  return (
    <AuthContext.Provider
      value={{
        address: authInfo.address ?? "Address not available",
        isConnected: authInfo.isConnected,
        status: status,
        isLoading: isLoading,
        chainId: chainId ?? 0 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
