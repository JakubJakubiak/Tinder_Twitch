import React, { useState } from 'react';
import { View, Platform, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';

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
  const webViewURLObject = JSON.parse(webViewURL);
  return (
    webViewURL && isJSON(webViewURL) ?(  
    <View>
      <Text>{webViewURLObject.accessToken}</Text>
      <Text>{webViewURLObject.refreshToken}</Text>
      <Image source={{ uri: webViewURLObject.image }} style={{ width: 100, height: 100 }} />
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
