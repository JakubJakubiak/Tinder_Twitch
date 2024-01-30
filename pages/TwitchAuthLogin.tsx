import React, { useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { WebView } from 'react-native-webview';
// import CookieManager from 'react-native-cookies';

// https://tinder-twitch.firebaseapp.com/__/auth/handler

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
      console.log('Page Content:', htmlContent);
    } catch (error) { 
      console.error('Error fetching page content:', error);
    }
  };

  const handleLogout = () => {
    // Perform logout action here
    // For example, you can reset the webViewURL to initialURL
    // CookieManager.clearAll();

    const clearDataScript = `
      document.cookie = '';
      window.localStorage.clear();
      window.sessionStorage.clear();
    `;

    setInjectedJavaScript(clearDataScript);
    setWebViewURL(initialURL);
  };

  const webViewURLObject = webViewURL !== "" && isJSON(webViewURL)
    ? JSON.parse(webViewURL)
    : webViewURLObject;

  return (
    webViewURL && isJSON(webViewURL) ?(  
    <View>
      <Button title="Logout" onPress={handleLogout} /> 
      <Text>{webViewURLObject.accessToken}</Text>
      <Text>{webViewURLObject.refreshToken}</Text>
      <Text>{webViewURLObject.displayName}</Text>
      <Image source={{ uri: webViewURLObject.image }} style={{ width: 200, height: 200, borderRadius:50 }} />
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