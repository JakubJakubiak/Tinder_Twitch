import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import MessageScreen from '../MessageList';
import Paring from '../Paring';
import Chat from '../chat';
import TwitchAuthLogin from '../TwitchAuthLogin';
import {UserData} from '../UserDataContext';

const home: string = 'Pairing';
const chat: string = 'Chat';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MainContainerProps {}

function MainContainer(props: MainContainerProps) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const updateUser = (userData: UserData | null) => {
    setUserData(userData);
  };

  return (
    <NavigationContainer>
      <TwitchAuthLogin updateUser={updateUser} />
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName: string = '';
            if (route.name === home) {
              iconName = 'heart';
            } else if (route.name === chat) {
              iconName = 'message';
            }
            return <Entypo name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'white',
          tabBarLabelStyle: {paddingBottom: 10, fontSize: 10, color: 'white'},
          tabBarStyle: {backgroundColor: '#6441a5', padding: 10, height: 70},
        })}>
        <Tab.Screen name={home}   options={{
          headerStyle: {
            backgroundColor: '#ccc',
          },
        }}>
          {props => (userData ? <Paring {...props} {...userData}  /> : <View />)}
        </Tab.Screen>

        <Tab.Screen name={chat} options={{headerShown: false}}>
          {props =>
            userData ? (
              <ChatStackScreen {...props} userData={userData} />
            ) : (
              <View />
            )
          }
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

interface ChatStackScreenProps {
  navigation: any;
  userData: UserData;
}

function ChatStackScreen({navigation, userData}: ChatStackScreenProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{
          headerStyle: {
            backgroundColor: '#CCCCCC',
          },
        }}>
        {props => <HomeNoScreen {...props} userData={userData} />}
      </Stack.Screen>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerStyle: {
            backgroundColor: '#CCCCCC',
          },
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
        onPress={() =>
          navigation.navigate('Chat', {route: {...userData}})
        }
      />
    </View>
  );
}

export default MainContainer;
