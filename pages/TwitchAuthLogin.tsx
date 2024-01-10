import React from 'react';
import { View, Button, Alert, Linking } from 'react-native';

const TwitchAuthLogin = () => {
  const handleTwitchLogin = async () => {
    try {
      const response = await fetch('http//127.0.0.1:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      });

      if (response.ok) {
        const url = await response.text();
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Error occurred: ${response.status}`);
      }
    } catch (error:any) {
      console.error('Login error:', error.message);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  return (
    <View>
      <Button title="Sign in with Twitch" onPress={handleTwitchLogin} />
    </View>
  );
};

export default TwitchAuthLogin;
