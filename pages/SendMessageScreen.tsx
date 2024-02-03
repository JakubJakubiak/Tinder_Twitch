import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button } from 'react-native';
// import { database } from '@react-native-firebase/database';


import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';

import { database } from './config/firebase';

const addDataToFirestore = async () => {
  try {
    const usersCollection = collection(database, 'users');

    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      age: 30,
    };


    const docRef = await addDoc(usersCollection, userData);
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};



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

      
        setMessageText('');
      } else {
        console.warn('Type your message');
      }
    } catch (error) {
      console.error('Error while sending a message:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Type your message"
        value={messageText}
        onChangeText={setMessageText}
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send a message</Text>
      </TouchableOpacity>

      <Button title="Logout" onPress={addDataToFirestore} /> 
    </View>
  );
};

export default SendMessageScreen;