import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TouchableOpacity, Text, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MessageScreen from '../MessageList';
import Pairing from '../Pairing';
import Chat from '../chat';
import {UserData, useUserData} from '../UserDataContext';

import TwitchAuthLogin from '../TwitchAuthLogin';
import {auth} from './firebase';
import {signOut} from 'firebase/auth';

const home: string = 'Pairing';
const chat: string = 'Chat';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MainContainerProps {}

function MainContainer(props: MainContainerProps) {
  const {userData, setUserData} = useUserData();

  const retrieveTwitchAuthData = async () => {
    try {
      const value = await AsyncStorage.getItem('@TwitchAuthLoginSave');
      if (value !== null) {
        const userDataObject = JSON.parse(value);
        console.log(userDataObject);
        // setUserData(userDataObject);
      }
    } catch (error) {
      console.error('Authorization error:', error);
    }
  };

  const removeTwitchAuthData = async () => {
    try {
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

  return (
    <NavigationContainer>
      {!userData ? (
        <Stack.Navigator>
          <Stack.Screen name="TwitchAuthLogin" component={TwitchAuthLogin}/>
          
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName={home}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName: string = '';
              if (route.name === home) {
                iconName = 'heart';
              } else if (route.name === 'chat') {
                iconName = 'message';
              }
              return <Entypo name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'white',
            tabBarLabelStyle: {paddingBottom: 10, fontSize: 10, color: 'white'},
            tabBarStyle: {backgroundColor: '#6441a5', padding: 10, height: 70},
          })}>
          <Tab.Screen
            name={home}
            options={{
              headerStyle: {
                backgroundColor: '#6441a5',
              },
              headerTintColor: '#fff',
            }}>
            {props =>
              userData ? <Pairing {...props} {...userData} /> : <View />
            }
          </Tab.Screen>

          <Tab.Screen name="chat" options={{headerShown: false}}>
            {props =>
              userData ? (
                <ChatStackScreen
                  {...props}
                  userData={userData}
                  removeTwitchAuthData={removeTwitchAuthData}
                />
              ) : (
                <View />
              )
            }
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}

interface ChatStackScreenProps {
  navigation: any;
  userData: UserData;
  removeTwitchAuthData: () => void;
}
function ChatStackScreen({
  navigation,
  userData,
  removeTwitchAuthData,
}: ChatStackScreenProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{
          headerStyle: {
            backgroundColor: '#6441a5',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: '#6441A4',
                padding: 10,
                borderRadius: 5,
                marginRight: 10,
              }}
              onPress={removeTwitchAuthData} // Pass the function reference here
            >
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
          ),
        }}>
        {props => <HomeNoScreen {...props} userData={userData} />}
      </Stack.Screen>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerStyle: {
            backgroundColor: '#6441a5',
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}

interface HomeNoScreenProps {
  navigation: any;
  userData: UserData;
}

function HomeNoScreen({navigation, userData}: HomeNoScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
      }}>
      <MessageScreen
        navigation={navigation}
        route={{userId: userData.userId}}
        onPress={() => navigation.navigate('Chat', {route: {...userData}})}
      />
    </View>
  );
}

export default MainContainer;
