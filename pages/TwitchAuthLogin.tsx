import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButoaddLogin from './ButoaddLogin';
import {UserData, useUserData} from './UserDataContext';

interface Props {
  updateUser: (userData: UserData) => void;
  // user: UserData;
}

const TwitchAuthLogin: React.FC<Props> = ({updateUser}) => {
  const initialURL = 'https://end-point-small.vercel.app/auth/twitch';
  const [webViewURL, setWebViewURL] = useState(initialURL);
  const {userData, setUserData} = useUserData();
  const [htmlContent, setHtmlContent] = useState('');

  const run = `
    window.ReactNativeWebView.postMessage(document.documentElement.outerHTML);
    true; 
  `;

  const saveTwitchAuthData = async () => {
    try {
      const userDataString = JSON.stringify(userData);
      await AsyncStorage.setItem('@TwitchAuthLoginSave', userDataString);
      console.log('Twitch authorization data has been saved.');
      console.log(userDataString);
      console.log(AsyncStorage);
    } catch (error) {
      console.log(
        'An error occurred while saving Twitch authorization data:',
        error,
      );
    }
  };

  const retrieveTwitchAuthData = async () => {
    try {
      const value = await AsyncStorage.getItem('@TwitchAuthLoginSave');
      if (value !== null) {
        console.log('Twitch authorization data read:', value);
        const userDataObject = JSON.parse(value);
        setUserData(userDataObject);
        updateUser(userDataObject);
      } else {
        console.log('No Twitch authorization data to read.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    retrieveTwitchAuthData();
  }, []);

  useEffect(() => {
    // console.log('htmlContent:', hmlContent);
    if (userData) return;
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
        updateUser(jsonContent.userData);
        setUserData(jsonContent.userData);
        saveTwitchAuthData();
      }
    }
  }, [htmlContent]);

  return userData ? (
    <View>
      <ButoaddLogin user={userData} />
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
          source={{uri: userData.image}}
          style={{width: 50, height: 50, borderRadius: 25, marginLeft: 10}}
        />
      </View>
    </View>
  ) : (
    <View style={{width: '100%', height: '100%'}}>
      <WebView
        source={{uri: webViewURL}}
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
