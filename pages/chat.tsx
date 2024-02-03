import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from './config/firebase';

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const collectionRef = collection(database, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsubscribe');
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.id, // Use doc.id as message _id
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  const onSend = useCallback(async (messages = []) => {
    try {
      await addDoc(collection(database, 'chats'), {
        createdAt: new Date(), // Use current date
        text: messages[0].text,
        user: messages[0].user
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log('Signed out successfully'))
      .catch(error => console.error('Error signing out:', error));
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={onSend}
      messagesContainerStyle={{
        backgroundColor: '#fff'
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.uid, // Use uid as user _id
        avatar: 'https://i.pravatar.cc/300' // Example avatar URL
      }}
      renderActions={() => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={handleSignOut}
        >
          <Text>Sign Out</Text>
        </TouchableOpacity>
      )}
    />
  );
}
