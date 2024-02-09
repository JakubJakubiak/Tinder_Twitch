import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import ButoaddLogin from './ButoaddLogin';

import { useUserData } from './UserDataContext';

const TwitchAuthLogin = ({ updateUser }) => {
  const initialURL = 'https://end-point-small.vercel.app/auth/twitch';
  const [webViewURL, setWebViewURL] = useState(initialURL);
  const { userData, setUserData } = useUserData();
  const [htmlContent, setHtmlContent] = useState('');

  const run = `
    window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    true; 
  `;


  const isJSON = (str: React.SetStateAction<string>) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // htmlContent
    console.log('htmlContent:', htmlContent);
    const start =
      htmlContent.indexOf(
        '<pre style="word-wrap: break-word; white-space: pre-wrap;">',
      ) + '<pre style="word-wrap: break-word; white-space: pre-wrap;">'.length;
    // Find the ending position of the </pre> tag
    const end = htmlContent.indexOf('</pre>', start);
    // Extract the JSON string
    const jsonString = htmlContent.substring(start, end);

    const isJson = isJSON(jsonString);
    if (isJson) {
      const jsonContent = JSON.parse(jsonString);
      if (jsonContent?.userData) {
        console.log('updateUser:', jsonContent);
        updateUser(jsonContent.userData);
        setUserData(jsonContent.userData);
      }
    }
  }, [htmlContent]);

  const handleLogout = () => {
    const clearDataScript = `
      document.cookie = '';
      window.localStorage.clear();
      window.sessionStorage.clear();
    `;

    setInjectedJavaScript(clearDataScript);
    setWebViewURL(initialURL);
  };

  return userData ? (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: '#000',
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}>
        <View>
          <Text>{userData.displayName}</Text>
          <Text>{userData.bio}</Text>
        </View>
        <Image
          source={{ uri: userData.image }}
          style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 10 }}
        />
      </View>
      <ButoaddLogin user={userData} />
    </View>
  ) : (
    <View style={{ width: '100%', height: '100%' }}>
      <WebView
        source={{ uri: webViewURL }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={event => {
          setHtmlContent(event.nativeEvent.data);
        }}
        injectedJavaScript={run}
      />
    </View>
  );
};

export default TwitchAuthLogin;
