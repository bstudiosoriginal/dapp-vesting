// context/MyContext.js
import { createContext, useContext, useState } from 'react';

const MyContext = createContext();

export function useMyContext() {
  return useContext(MyContext);
}

export function MyContextProvider({ children }) {
  const [provider, setProvider] = useState();

  const updateProvider = (newData) => {
    setProvider(newData);
  };

  return (
    <MyContext.Provider value={{ provider, updateProvider }}>
      {children}
    </MyContext.Provider>
  );
}
