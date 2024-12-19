import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';

import AsyncStorage from '@react-native-async-storage/async-storage';
// import ButoaddLogin from './ButoaddLogin';
import {UserData, useUserData} from './UserDataContext';
import * as Linking from 'expo-linking';
import {authorize, revoke} from 'react-native-app-auth';
import {auth} from './config/firebase';
import {signInWithCustomToken, signOut} from 'firebase/auth';

import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

interface Props {
  updateUser: (userData: UserData) => void;
}

const TwitchAuthLogin = () => {
  const {setUserData} = useUserData();
  const [isTwitchClicked, setIsTwitchClicked] = useState(false);

  const config = {
    issuer: 'https://id.twitch.tv/oauth2',
    clientId: 'jewvzg4d0egw796dfbn01tnxp6kdd1',
    redirectUrl: 'https://end-point-small.vercel.app/oauth-callback',
    scopes: ['user:read:email'],
    response_type: 'code',
    skipCodeExchange: true,
    // revocationEndpoint: 'https://id.twitch.tv/oauth2/revoke',
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
          bio: tokenDetails.newUser.bio ?? "",
          broadcasterType: tokenDetails.newUser.broadcaster_type,
          createdAt: tokenDetails.newUser.created_at,
          image:
            tokenDetails.newUser.avatar ??
            'https://static-cdn.jtvnw.net/jtv_user_pictures/8db977af-eb77-445b-a494-ab385a03655f-profile_image-70x70.png',
          tokenDetailsAuth: tokenDetails.customToken,
        },
      };

      // console.log(`////////sss/////////${JSON.stringify(tokenDetails)}`);


      saveTwitchAuthData(dateRel.userData);
      setUserData(dateRel.userData);

      if (tokenDetails) {
        const userCredential = await signInWithCustomToken(
          auth,
          tokenDetails.customToken,
        );
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
          await signInWithCustomToken(auth, userDataObject.tokenDetailsAuth);
        }
        console.log('Twitch authorization data retrieved successfully.');
      } else {
        console.log('No Twitch authorization data to read.');
      }
    } catch (error) {
      await removeTwitchAuthData();
      console.log(error);
    }
  };

  const removeTwitchAuthData = async () => {
    try {
      // const value = await AsyncStorage.getItem('@TwitchAuthLoginSave');
      // if (value !== null) {
      //   const accessToken = JSON.parse(value);
      //   console.log(`Access token: ${accessToken.tokenDetailsAuth}`);
      //   await revoke(config, {
      //     tokenToRevoke: accessToken.tokenDetailsAuth,
      //   });
      // }

      await signOut(auth);
      await AsyncStorage.removeItem('@TwitchAuthLoginSave');
      setUserData(null);

      console.log('Twitch authorization data removed successfully.');
    } catch (error) {
      console.log(
        'An error occurred while removing Twitch authorization data:',
        error,
      );
    }
  };

  useEffect(() => {
    retrieveTwitchAuthData();
  }, []);

  const handleDeepLink = (event: any) => {
    const {url} = event;
    if (url) {
      console.log('Dane przekazane z przeglądarki:', url);
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
  });



  return (
    <>
      <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{
            uri: 'https://pngimg.com/uploads/twitch/twitch_PNG46.png',
          }}
          style={styles.logo}
        />
      </View>

      {/* <Text style={styles.welcomeText}>Log in with Twitch</Text> */}

      {/* Button or Loading */}
      {!isTwitchClicked ? (
        <TouchableOpacity
          style={styles.twitchButton}
          onPress={authorizeWithTwitch}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Log in with Twitch</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6441A4" />
          <Text style={styles.loadingText}>Connecting to Twitch...</Text>
        </View>
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E10', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  twitchButton: {
    backgroundColor: '#6441A4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6441A4',
    marginTop: 10,
    fontSize: 16,
  },
});


export default TwitchAuthLogin;

function async(customToken: any) {
  throw new Error('Function not implemented.');
}
