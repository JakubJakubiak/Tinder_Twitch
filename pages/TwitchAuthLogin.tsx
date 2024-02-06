import React, { useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import ButoaddLogin from './ButoaddLogin';
import Paring from './Paring';
import Explore from './Explore';
import MessageList from './MessageList';
import Chat from './chat';
import MainContainer from './config/MainContainer';

import SaveData from './SaveData';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {  db  } from './config/firebase';
import { setDoc,doc} from 'firebase/firestore';


import { useUserData } from './UserDataContext';


import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { database } from './config/firebase';
const TwitchAuthLogin = ({ updateUser }) => {
  const initialURL = 'https://end-point-small.vercel.app/auth/twitch';
  const [webViewURL, setWebViewURL] = useState(initialURL);
  const [userDataUpdated, setUserDataUpdated] = useState(false); // Dodaj stan dla sprawdzania, czy dane użytkownika zostały już zaktualizowane

  const { userData, setUserData } = useUserData();

  const isJSON = (str: React.SetStateAction<string>) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onNavigationStateChange = async (navState: { url: React.SetStateAction<string>; loading: any; }) => {
    console.log(navState.url);
    setWebViewURL(navState.url);

    console.log('Redirected URL:', navState.url);
    await fetchPageContent(navState.url);

  };

  const fetchPageContent = async (url: React.SetStateAction<string> | URL | Request) => {
    try {
      const response = await fetch(url);
      const htmlContent = await response.text();

      if (isJSON(htmlContent)) setWebViewURL(htmlContent);

    } catch (error) { 
      console.error('Error fetching page content:', error);
    }
  };

  const handleLogout = () => {
    const clearDataScript = `
      document.cookie = '';
      window.localStorage.clear();
      window.sessionStorage.clear();
    `;

    setInjectedJavaScript(clearDataScript);
    setWebViewURL(initialURL);
  };

  const webViewURLObject = isJSON(webViewURL) ? JSON.parse(webViewURL): null;
  
  const userDataToUpdate = webViewURLObject 
    && webViewURLObject.userData 
    && Object.keys(webViewURLObject)
    ? webViewURLObject.userData : null;

  // Dodaj warunek, aby uniknąć zapętlenia aktualizacji danych użytkownika
  if (userDataToUpdate && !userDataUpdated) {
    updateUser(userDataToUpdate);
    setUserDataUpdated(true);
  }

  return (
    userDataToUpdate ? ( 
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 5 }}>
          <View>
            <Text>{userDataToUpdate.displayName}</Text>
            <Text>{userDataToUpdate.bio}</Text>
          </View>
          <Image
            source={{ uri: userDataToUpdate.image }}
            style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 10 }}
          />
        </View>
        <ButoaddLogin user={userDataToUpdate} />
      </View>
    ) : (
      <View style={{ width: "100%", height: "100%" }}>
        <WebView
          source={{ uri: webViewURL }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadEnd={() => fetchPageContent(webViewURL)}
        />
      </View>
    ) 
  );
};

export default TwitchAuthLogin;
