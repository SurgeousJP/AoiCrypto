import { setAddressToLS, setConnectedStateToLS } from '@/utils/auth';
import React, { createContext, useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

export const AuthContext = createContext({address: "", isConnected: false});

const AuthProvider = ({children}) => {

  const { address, isConnected } = useAccount();
  const [authInfo, setAuthInfo] = useState({address, isConnected});

  useEffect(() => {
    // console.log("Address: ", address);
    // console.log("Is connected: ", isConnected);
    setAuthInfo({address, isConnected});
    setAddressToLS(address);
    setConnectedStateToLS(isConnected);

  }, [address, isConnected]);

  return (
    <AuthContext.Provider value={{address, isConnected}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider