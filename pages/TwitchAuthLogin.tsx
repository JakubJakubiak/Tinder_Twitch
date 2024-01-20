import React from 'react';
import { View, Button, Alert, Linking } from 'react-native';

const TwitchAuthLogin = () => {
  const handleTwitchLogin = async () => {
    try {
        const response = await fetch('https://nodejs-api-example.vercel.app/api/hello', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: 'value' }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            // Handle the URL or further processing as needed
        } else {
            console.error(`Error occurred: ${response.status}`);
            // Handle error accordingly
        }
    } catch (error:any) {
        console.error(`Login error: ${error.message}`);
        // Handle the exception and display an appropriate error message
    }
};



  // const handleTwitchLogin = async () => {
  //   try {
  //     const response = await fetch('https://nodejs-api-example.vercel.app/api/hello', {
  //       method: 'POST', 
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ key: 'value' }),
  //     });
    
  //     if (response.ok) {
  //       console.log(response);
  //       const url = await response.text();
  //       Linking.openURL(url);
  //     } else {
  //       Alert.alert('Error', `Error occurred: ${response.status}`);
  //     }
  //   } catch (error:any) {
  //     console.error('Login error:', error.message);
  //     Alert.alert('Error', 'An error occurred during login.');
  //   }
  // };

  return (
    <View>
      <Button title="Sign in with Twitch" onPress={handleTwitchLogin} />
    </View>
  );
};

export default TwitchAuthLogin;
