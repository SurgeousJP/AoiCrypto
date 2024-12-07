import {
  createDefaultCreateIDOInput,
  CreateIDOInput,
  sampleCreateIDOInput,
} from "@/contracts/types/IDO/CreateIDOInput";
import React, { useState, createContext, ReactNode, useEffect } from "react";

export type StateContextType = {
  createIDO: CreateIDOInput;
  updateCreateIDO: (key: any, value: any) => void;
  resetCreateIDO: () => void;
};

export const StateContext = createContext<StateContextType | null>({
  createIDO: createDefaultCreateIDOInput(),
  updateCreateIDO: (key, value) => {},
  resetCreateIDO: () => {}
});

const StateProvider = ({ children }) => {
  const [createIDO, setCreateIDO] = useState<CreateIDOInput>(createDefaultCreateIDOInput());
  // const [createIDO, setCreateIDO] =
  //   useState<CreateIDOInput>(sampleCreateIDOInput);

  const updateCreateIDO = (key: keyof CreateIDOInput, value: any) => {
    setCreateIDO((prev) => ({ ...prev, [key]: value }));
  };

  const resetCreateIDO = () => {
    setCreateIDO(createDefaultCreateIDOInput());
  }

  // useEffect(() => {
  //   console.log("Create IDO state: ", createIDO);
  // }, [createIDO]);

  return (
    <StateContext.Provider
      value={{ createIDO: createIDO, updateCreateIDO: updateCreateIDO, resetCreateIDO: resetCreateIDO }}
    >
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
