import { createDefaultCreateIDOInput, CreateIDOInput } from "@/contracts/types/IDO/CreateIDOInput";
import React, { useState, createContext, ReactNode, useEffect } from "react";

export type StateContextType = {
  createIDO: CreateIDOInput,
  updateCreateIDO: (key: any, value: any) => void;
}

export const StateContext = createContext<StateContextType | null>({
  createIDO: createDefaultCreateIDOInput(),
  updateCreateIDO: (key, value) => {}
});

const StateProvider = ({ children }) => {
  const [createIDO, setCreateIDO] = useState<CreateIDOInput>(createDefaultCreateIDOInput());

  const updateCreateIDO = (key: keyof CreateIDOInput, value: any) => {
    setCreateIDO((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    console.log("Create IDO state: ", createIDO);
  }, [createIDO]);

  return (
    <StateContext.Provider value={{ createIDO: createIDO, updateCreateIDO: updateCreateIDO }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
