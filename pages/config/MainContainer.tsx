import React, { useEffect, useState, useLayoutEffect, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { createStackNavigator } from '@react-navigation/stack'

import MessageScreen from '../MessageList';
import ButoaddLogin from '../ButoaddLogin';
import Paring from '../Paring';
import Chat from '../chat';
import TwitchAuthLogin from '../TwitchAuthLogin';

const home = "Paring";
const chat = "chat";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainContainer() {
  const [userData, setUserData] = useState(null);

  const updateUser = (userData) => {
    setUserData(userData);
  };

  return (
    <NavigationContainer>
    <TwitchAuthLogin updateUser={updateUser} />
    <Tab.Navigator
      initialRouteName={home}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === home) {
            iconName = 'home';
          } else if (rn === chat) {
            iconName = 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'white',
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10, color: 'white' },
        tabBarStyle: { backgroundColor: '#333333', padding: 10, height: 70 },
      })}
    >

      <Tab.Screen name={home} >
          {(props) => <Paring {...props} userData={userData} />}
      </Tab.Screen> 

      <Tab.Screen name={chat} options={{ headerShown: false }} >
        {(props) => <ChatStackScreen {...props} userData={userData} />}
      </Tab.Screen>
    </Tab.Navigator>
  </NavigationContainer>
  );
}

function ChatStackScreen({ navigation, userData }) {
  return (
    <Stack.Navigator  >
      <Stack.Screen name="Home" options={{
          headerStyle: {
          backgroundColor: '#CCCCCC', 
          },
        }} >
        {(props) => <HomeNoScreen {...props} userData={userData}  />}
      </Stack.Screen  >
      <Stack.Screen name="Chat" component={Chat}  options={{
          headerStyle: {
          backgroundColor: '#CCCCCC', 
          },
        }} />
    </Stack.Navigator>
  );
}

function HomeNoScreen({ navigation, userData }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#696969' }}>
      <MessageScreen navigation={navigation} route={userData} onPress={() => navigation.navigate('Chat', { route: userData })} />
    </View>
  );
}



export default MainContainer;
