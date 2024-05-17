import React from 'react';
import type { PropsWithChildren } from 'react';
import { UserDataProvider } from './pages/UserDataContext';
import MainContainer from './pages/config/MainContainer';
import {
  Platform,
  useColorScheme,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <UserDataProvider >
      <MainContainer />
    </UserDataProvider>
  );
}

export default App;
