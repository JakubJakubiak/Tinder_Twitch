import React, { createContext, useState, useContext, useEffect } from 'react';

// Utwórz kontekst
export const UserDataContext = createContext();

export const SaveData = ({ children }) => {
  const [savedChildren, setSavedChildren] = useState(null);
  const { setUserData } = useContext(UserDataContext);

  useEffect(() => {
    // Zaktualizuj dane użytkownika po renderowaniu komponentu
    setUserData(savedChildren);
  }, [savedChildren, setUserData]); // Użyj efektu ubocznego, aby wywołać funkcję setUserData tylko gdy savedChildren się zmieni

  console.log("///////////////")
  console.log(children)

  // Zapisz children w stanie komponentu
  setSavedChildren(children);

  return null;
};

export default SaveData;
