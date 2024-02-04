import React from 'react';
import type {PropsWithChildren} from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';



import Paring from './pages/Paring';
import TwitchAuthLogin from './pages/TwitchAuthLogin';
import SendMessageScreen from './pages/SendMessageScreen';

import ExploreScreen from './pages/Explore';
import Chat from './pages/chat';

import Register from './pages/Register';

import MessageList from './pages/MessageList';

// import analytics from '@react-native-firebase/analytics';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';



const Stack = createNativeStackNavigator();

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const Stack = createNativeStackNavigator();
  return (
    <View >
      <View style={styles.container}></View >
        {/* <Paring/>  */}
        <TwitchAuthLogin/> 
        {/* <MessageList /> */}
        {/* <SendMessageScreen /> */}
        {/* <MessageList  /> */}
        {/* <MessageList userId="inulive" /> */}
     </View>

//     <NavigationContainer>
//   <Stack.Navigator>
//     {/* Tutaj umieść swoje Stack.Screen */}
//     <Stack.Screen name='Login' component={Login} options={() => ({
//       headerBackVisible: false,
//       headerShown: false,
//     })}/>
//     {/* Pozostałe Stack.Screen */}
//   </Stack.Navigator>
// </NavigationContainer>



  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {

    width:1000,
    height:1000,
    top: -(930 / 2),
    position:'absolute',
    backgroundColor: '#f8552255',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius:500,
    borderBottomRightRadius:500
  },
});

export default App;