import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View, Image, Animated } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MessageScreen from '../MessageList';
import Pairing from '../Pairing';
import Chat from '../chat';
import { UserData, useUserData } from '../UserDataContext';

import TwitchAuthLogin from '../TwitchAuthLogin';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const home: string = 'Pairing';
const chat: string = 'Chat';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

interface MainContainerProps { }

function MainContainer(props: MainContainerProps) {
  const { userData, setUserData } = useUserData();

  const retrieveTwitchAuthData = async () => {
    try {
      const value = await AsyncStorage.getItem('@TwitchAuthLoginSave');
      if (value !== null) {
        const userDataObject = JSON.parse(value);
        setUserData(userDataObject);
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

  useEffect(() => {
    retrieveTwitchAuthData();
  }, []);


  const [showDetails, setShowDetails] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const handleImagePress = () => {
    setShowDetails(!showDetails);
    Animated.timing(animatedValue, {
      toValue: showDetails ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };



  // if (!userData) {
  //   // Show Twitch login screen if no user data
  //   return (
  //     <NavigationContainer>
  //       <Stack.Navigator>
  //         <Stack.Screen name="TwitchAuthLogin" component={TwitchAuthLogin} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   );
  // }






  return (
    <NavigationContainer>
    {!userData ? (
      <Stack.Navigator>
        <Stack.Screen name="TwitchAuthLogin" component={TwitchAuthLogin} />
      </Stack.Navigator>
    ) : (
      <Tab.Navigator
        initialRouteName={home}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = '';
            if (route.name === home) {
              iconName = 'heart';
            } else if (route.name === 'Chat') {
              iconName = 'message';
            }
            return <Entypo name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'white',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 10, color: 'white' },
          tabBarStyle: { backgroundColor: '#6441a5', padding: 10, height: 70 },
        })}>
           {/* ikonka paring  */}
        <Tab.Screen
          name={home}
          options={{
            headerStyle: { backgroundColor: '#6441a5' },
            headerTintColor: '#fff',
            headerRight: () => (
              <View>
                <TouchableOpacity 
                  onPress={handleImagePress}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* ikonka paring  */}
                  <Image
                    source={{ uri: userData.image }}
                    style={{ width: 40, height: 40,  right: 20, borderRadius: 25 }}
                  />
                </TouchableOpacity>
                
                <Animated.View 
                  style={[
                    animatedStyle, 
                    { 
                      position: 'absolute', 
                      top: 50, 
                      right: 2,
                      display: showDetails ? 'flex' : 'none'
                    }
                  ]}
                >
                  <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: '#000', padding: 4 }}>{userData.displayName}</Text>
                    <TouchableOpacity
                      style={{ 
                        backgroundColor: '#6441A4', 
                        borderRadius: 5, 
                        padding: 5,
                        marginTop: 5
                      }}
                      onPress={removeTwitchAuthData}
                    >
                      <Text style={{ 
                        color: '#FFFFFF', 
                        fontSize: 16, 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase',
                        textAlign: 'center'
                      }}>
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            ),
          }}>
          {props =>
            userData ? <Pairing {...props} {...userData} /> : <View />
          }
        </Tab.Screen>

        <Tab.Screen name="Chat" options={{ headerShown: false }}>
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
  const [showDetails, setShowDetails] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  
  const handleImagePress = () => {
    setShowDetails(!showDetails);
    Animated.timing(animatedValue, {
      toValue: showDetails ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <Stack.Navigator>
      <Tab.Screen
        name={home}
        options={{
          headerStyle: { backgroundColor: '#6441a5' },
          headerTintColor: '#fff',
          headerRight: () => (
            <View>
              <TouchableOpacity 
                onPress={handleImagePress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
              <Image
                  source={{ uri: userData.image }}
                  style={{ width: 40, height: 40, borderRadius: 25   }}
                />
              </TouchableOpacity>
              
              <Animated.View 
                style={[
                  animatedStyle, 
                  showDetails ? null:
                  { 
                    position: 'absolute', 
                    top: 50, 
                    right: 2,
                    display: 'flex' 
                  }
                ]}
              >
                <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>
                  <Text style={{ color: '#000', padding: 4 }}>{userData.displayName}</Text>
                  <TouchableOpacity
                    style={{ 
                      backgroundColor: '#6441A4', 
                      borderRadius: 5, 
                      padding: 5,
                      marginTop: 5
                    }}
                    onPress={removeTwitchAuthData}
                  >
                    <Text style={{ 
                      color: '#FFFFFF', 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      textAlign: 'center'
                    }}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          ),
        }}>
        {props => <HomeNoScreen {...props} userData={userData} />}
      </Tab.Screen>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          headerStyle: { backgroundColor: '#6441a5' },
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

function HomeNoScreen({ navigation, userData }: HomeNoScreenProps) {
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
        route={{ userId: userData.userId }}
        onPress={() => navigation.navigate('Chat', { route: { ...userData } })}
      />
    </View>
  );
}

export default MainContainer;
