import React from "react";

const StateContext = React.createContext({});

export const StateProvider = ({ children }) => {
  const [formState, setFormState] = React.useState();
  return (
    <StateContext.Provider value={{formState, setFormState}}>
      {children}
    </StateContext.Provider>
  )
}

