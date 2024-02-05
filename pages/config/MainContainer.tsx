import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';

import MessageScreen from '../MessageList';



//Screen names
const Paring = "Paring";
const chat = "chat";

import TwitchAuthLogin from '.././TwitchAuthLogin';
const Tab = createBottomTabNavigator();

function MainContainer() {
    return (
      <NavigationContainer>
        <TwitchAuthLogin />
        <Tab.Navigator
          initialRouteName={Paring}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;
  
              if (rn === Paring) {
                iconName = 'home'; 
              } else if (rn === chat) {
                iconName = 'settings-outline';
              }  
              
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato', 
            tabBarInactiveTintColor: 'white', 
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 10, color: 'white' }, 
            tabBarStyle: { backgroundColor: '#333333', padding: 10, height: 70 } 
          })}>
  
          {/* <Tab.Screen name={Paring} component={HomeScreen} />
          <Tab.Screen name={chat} component={SettingsScreen} /> */}

  {/* <Stack.Screen name='Chat' component={Chat} options={
            ({ route }) => ({ title: route.params.name, headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
  })
            }/> */}

{/* <Tab.Screen name="MessageScreen" component={MessageScreen} initialParams={{user_id: user}}
      options={() => ({
        headerBackVisible: false,
        headerShown: false,
        tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-sharp" color={color} size={size} />
          ),
      })}/> */}


          <Tab.Screen name={Paring} component={() => <HomeScreen navigation={"webViewURLObject.userData"} />} />
          {/* <Tab.Screen name={chat} component={SettingsScreen} />  */}

          <Tab.Screen name={chat} component={() => <SettingsScreen route={{ "userId": "417210681"}} />} /> 

          {/* <Tab.Screen name={Paring} component={() => <HomeScreen userData={webViewURLObject.userData} />} />
          <Tab.Screen name={chat} component={() => <SettingsScreen userData={webViewURLObject.userData} />} /> */}
  
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  
export default MainContainer;
