import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
// import { database } from '@react-native-firebase/database';

const SendMessageScreen = ({ route }) => {
  const recipientId = route?.params?.recipientId || '';
  const [messageText, setMessageText] = useState('');

  const sendMessage = async () => {
    try {
      if (messageText.trim() !== '') {
        // await database()
        //   .ref(`/messages/${recipientId}`)
        //   .push({
        //     type: 'text',
        //     text: messageText.trim(),
        //     senderId: 'currentUserId', // Zastąp ID aktualnie zalogowanego użytkownika
        //     timestamp: database.ServerValue.TIMESTAMP,
        //   });

        // Zresetowanie wartości pola tekstowego
        setMessageText('');
      } else {
        console.warn('Wpisz wiadomość');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Wpisz wiadomość"
        value={messageText}
        onChangeText={setMessageText}
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Wyślij wiadomość</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendMessageScreen;