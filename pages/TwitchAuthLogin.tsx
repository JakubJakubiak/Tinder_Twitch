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



import {
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { database } from './config/firebase';

const TwitchAuthLogin = () => {
  const initialURL = 'https://end-point-small.vercel.app/auth/twitch';
  const [webViewURL, setWebViewURL] = useState(initialURL);

  const isJSON = (str: React.SetStateAction<string>) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const Tab = createBottomTabNavigator();
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


  // const webViewURLObject = webViewURL !== "" && isJSON(webViewURL)
  //   ? JSON.parse(webViewURL)
  //   : webViewURLObject;



//////////////// Zresetować po zalogowaniu odświeżenie może nie zadziałać. ///////////////

    const webViewURLObject = isJSON(webViewURL) ? JSON.parse(webViewURL): null;

    // console.log(webViewURLObject.userData);

  return (
    webViewURL && isJSON(webViewURL) && webViewURLObject.userData ? ( 
      <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'black', paddingHorizontal: 10, paddingVertical: 5 }}>
      <View>
        {/* <Text>{webViewURLObject.userData.userId}</Text> */}
        <Text>{webViewURLObject.userData.displayName}</Text>
        <Text>{webViewURLObject.userData.bio}</Text>
      </View>
      <Image
        source={{ uri: webViewURLObject.userData.image }}
        style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 10 }}
      />
  
    </View>


    {/* <SaveData children={webViewURLObject.userData}  /> */}


    {/* <MainContainer/> */}
    

    {/* <ButoaddLogin user={webViewURLObject.userData} /> */}
    {/* <Paring userId={webViewURLObject.userData.userId}  /> */}
    {/* <Explore /> */}

    {/* <MessageList route={webViewURLObject.userData}  /> */}
    

    {/* <Chat user={webViewURLObject.userData}  /> */}

    
    

    
    
    </View>
    ):
    (
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