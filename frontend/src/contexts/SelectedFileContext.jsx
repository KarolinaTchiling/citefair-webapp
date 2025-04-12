import React, { createContext, useState, useEffect, useContext } from "react";

const SelectedFileContext = createContext();
export const useSelectedFile = () => useContext(SelectedFileContext);

export const SelectedFileProvider = ({ children }) => {
  const [fileName, setFileNameState] = useState(null);
  
  useEffect(() => {
    const storedFileName = localStorage.getItem("selectedFileName");
    if (storedFileName) {
      setFileNameState(storedFileName);
    }
  }, []);

  const setFileName = (name) => {
    setFileNameState(name);
    localStorage.setItem("selectedFileName", name);
  };

  return (
    <SelectedFileContext.Provider value={{ fileName, setFileName }}>
      {children}
    </SelectedFileContext.Provider>
  );
};