import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Button } from 'react-native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';


import MessageScreen from '../MessageList';
import ButoaddLogin from '../ButoaddLogin';
import Paring from '../Paring';
import Chat from '../chat';

import TwitchAuthLogin from '../TwitchAuthLogin';


const home = "Paring";
const chat = "chat";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainContainer({ user }) {

    return (
        <NavigationContainer>
          <TwitchAuthLogin />
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
              <Tab.Screen name={home} component={Paring}   />
              <Tab.Screen name={chat} component={ChatStackScreen}  /> 
          </Tab.Navigator>
        </NavigationContainer>
    );
}


function ChatStackScreen({ navigation }) {
  return (
      <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeNoScreen}  />
          <Stack.Screen name="Details" component={DetailsScreen}  options={{ headerTitle: null }} /> 
          <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
  );
}

        function HomeNoScreen({ navigation }) {
          return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor: '#696969' }}>
                <MessageScreen
                navigation={navigation} 
                route={{
                    "accessToken": "denu7h8opnxyot",
                    "bio": "",
                    "displayName": "inulive",
                    "image": "https://static-cdn.jtvnw.net/jtv_user_pictures/2a9fd65f-4ec6-409a-af68-9867746cb77a-profile_image-300x300.png",
                    "refreshToken": "91838xoeo4vj31zo34cmenjlkkp4k4k",
                    "userId": "417210681"
                } }    onPress={() => navigation.navigate('Chat', { user: {
                  "accessToken": "denu7h8opnxyot",
                  "bio": "",
                  "displayName": "inulive",
                  "image": "https://static-cdn.jtvnw.net/jtv_user_pictures/2a9fd65f-4ec6-409a-af68-9867746cb77a-profile_image-300x300.png",
                  "refreshToken": "91838xoeo4vj31zo34cmenjlkkp4k4k",
                  "userId": "417210681"
              } })} />
        {/* <ButoaddLogin /> */}
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
    </View>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        // onPress={() => navigation.push('Details')}
      />
    </View>
  );
}

export default MainContainer;
