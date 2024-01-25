import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const TwitchAuthLogin = () => {
  const initialURL = 'https://end-point-small.vercel.app/auth/twitch';

  const [webViewURL, setWebViewURL] = useState(initialURL);

  const onNavigationStateChange = (navState: { url: React.SetStateAction<string>; loading: any; }) => {
    console.log(navState.url);
    setWebViewURL(navState.url);

    if (!navState.loading && Platform.OS === 'android') {
      console.log('Redirected URL:', navState.url);
      fetchPageContent(navState.url);
    }
  };

  const fetchPageContent = async (url) => {
    try {
      const response = await fetch(url);
      const htmlContent = await response.text();
      console.log('Page Content:', htmlContent);
    } catch (error) { 
      console.error('Error fetching page content:', error);
    }
  };

  return (
    <View style={{  width: "100%", height:"100%" }}>
      <WebView
        source={{ uri: webViewURL }}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoadEnd={() => fetchPageContent(webViewURL)} 
      />
    </View>
  );
};

export default TwitchAuthLogin;
