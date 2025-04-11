import React, { createContext, useState, useContext } from "react";

const SelectedFileContext = createContext();

export const useSelectedFile = () => useContext(SelectedFileContext);

export const SelectedFileProvider = ({ children }) => {
  const [fileName, setFileName] = useState(null);

  return (
    <SelectedFileContext.Provider value={{ fileName, setFileName }}>
      {children}
    </SelectedFileContext.Provider>
  );
};