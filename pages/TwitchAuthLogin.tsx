import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput} from 'react-native';
import {WebView} from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import ButoaddLogin from './ButoaddLogin';
import {UserData, useUserData} from './UserDataContext';
import * as Linking from 'expo-linking';
import { authorize } from 'react-native-app-auth';
import { auth } from "./config/firebase";
import { signInWithCustomToken, signOut } from "firebase/auth";


import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



interface Props {
  updateUser: (userData: UserData) => void;
}


const TwitchAuthLogin: React.FC<Props> = ({updateUser}) => {
  const {userData, setUserData} = useUserData();
  const [isTwitchClicked, setIsTwitchClicked] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator(); 





const config = {
  issuer: 'https://id.twitch.tv/oauth2',
  clientId: 'jewvzg4d0egw796dfbn01tnxp6kdd1', 
  redirectUrl: 'https://end-point-small.vercel.app/oauth-callback',
  scopes: ['user:read:email'], 
  response_type: 'code',
  skipCodeExchange: true,
};

async function authorizeWithTwitch() {
  try {
    const authResult = await authorize(config);
    // console.log('Authorization successful:', authResult);
    
    const codeResponse = await fetch(
      `https://end-point-small.vercel.app/code?authorizationCode=${authResult.authorizationCode}`,
      {
        method: 'GET',
      },
    );

    const tokenDetails = await codeResponse.json();


  const dateRel = {
    userData: {
        userId: tokenDetails.newUser.uid,
        displayName: tokenDetails.newUser.name,
        bio: "",
        broadcaster_type: tokenDetails.newUser.broadcaster_type,
        created_at: tokenDetails.newUser.created_at,
        image: tokenDetails.newUser.avatar  ?? "https://static-cdn.jtvnw.net/jtv_user_pictures/bf561d2d-8287-4b10-8a60-45f8770317b2-profile_image-70x70.png",
        tokenDetailsAuth: tokenDetails.customToken,
    }
};

    saveTwitchAuthData(dateRel.userData);
    setUserData(dateRel.userData);
    setTokenDetails(tokenDetails.customToken);

    if (tokenDetails) {
    const userCredential = await signInWithCustomToken(auth, tokenDetails.customToken);
    const user = userCredential.user;
    // console.log('User signed in: ', user);
    console.log('User signed in');
    // updateUser();

    }

  } catch (error) {
    console.error('Authorization error:', error);
  }
}


  const saveTwitchAuthData = async (date: Record<string, any>) => {
    try {
      const userDataString = JSON.stringify(date);
      await AsyncStorage.setItem('@TwitchAuthLoginSave', userDataString);
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
        const userDataObject = JSON.parse(value);
        setUserData(userDataObject); 
        if (userDataObject) {
          const userCredential = await signInWithCustomToken(auth, userDataObject.tokenDetailsAuth);
          if(!userCredential) await removeTwitchAuthData();
        }
        updateUser(userDataObject);
        
      } else {
        console.log('No Twitch authorization data to read.');
      }
    } catch (error) {
      await removeTwitchAuthData()
      console.log(error);
    }
  };

  const removeTwitchAuthData = async () => {
    try {
      await AsyncStorage.removeItem('@TwitchAuthLoginSave');
      await signOut(auth);
      setUserData(null);

      console.log('Twitch authorization data removed successfully.');
    } catch (error) {
      console.log('An error occurred while removing Twitch authorization data:', error);
    }
  };
  


  useEffect(() => {
    retrieveTwitchAuthData();
  }, []);



const handleDeepLink = (event:any) => {
  const { url } = event;
  if (url) {
    console.log('Dane przekazane z przeglądarki:', url);
  }
}

useEffect(() => {
Linking.addEventListener('url', handleDeepLink);
});


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
            <TouchableOpacity
            style={{
              backgroundColor: '#6441A4',
              padding: 10,
              borderRadius: 5,
              margin: 10,
            }}
            onPress={removeTwitchAuthData}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
                Logout    
            </Text>
          </TouchableOpacity>
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
      {!isTwitchClicked ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}>

          <TouchableOpacity
            style={{
              backgroundColor: '#6441A4',
              padding: 10,
              borderRadius: 5,
              margin: 10,
            }}
            onPress={authorizeWithTwitch}>

            <Text
              style={{
                color: '#444',
                fontSize: 16,
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}>
              Twitch
            </Text>
          </TouchableOpacity>

        </View>

      ) : (

      <View>
      <ActivityIndicator size="large" color="#841584" />
      </View>
      )}
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    backgroundColor: "#302298",
    borderRadius: 20,
    padding: 10,
    margin: 14,
    width: "78%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loginText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  downText: {
    color: "#331ece",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  signup: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
    color: "#331ece",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginTop: 10,
  },
});

export default TwitchAuthLogin;

function async(customToken: any) {
  throw new Error('Function not implemented.');
}

