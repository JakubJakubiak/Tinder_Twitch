import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface UserData {
  userId: string;
  image: string | undefined;
  bio: string | undefined;
  displayName: ReactNode;
}

interface ContextType {
  userData: UserData | null;
  
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const UserDataContext = createContext<ContextType | undefined>(undefined);


export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const UserDataProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;
