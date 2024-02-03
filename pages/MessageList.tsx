import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native'; // Importuj komponent View i Text z react-native
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { db } from './config/firebase';

const MessageList = ({ navigation }) => {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    const getUserContacts = async () => {
      try {
        // const userId = navigation.getParam('userId'); 
        const { userId } = this.props;
        const userRef = doc(db, 'Users', userId);
        const userSnapshot = await getDoc(userRef);
        const contacts = userSnapshot.data().realFriend || []; // Załóżmy, że lista znajomych jest przechowywana w polu 'realFriend'

        const contactsDetailsPromises = contacts.map(async (contactId) => {
          const contactRef = doc(db, 'users', contactId);
          const contactSnapshot = await getDoc(contactRef);
          return { id: contactSnapshot.id, ...contactSnapshot.data() };
        });

        const contactsDetails = await Promise.all(contactsDetailsPromises);
        setContactList(contactsDetails);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    // getUserContacts();

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      // Nasłuchuje zmian w kolekcji 'users', aby reagować na zmiany w czasie rzeczywistym
      getUserContacts(); // Aktualizuje listę kontaktów za każdym razem, gdy dane są aktualizowane
    });

    return () => unsubscribe(); // Czyszczenie nasłuchiwania podczas oczyszczania efektu
  }, [navigation]); // Uruchamia efekt ponownie przy zmianie nawigacji

  // Renderowanie kontaktów
  return (
    <View>
      {contactList.map((contact) => (
        <View key={contact.id}>
          <Text>{contact.displayName}</Text>
          {/* Dodaj inne dane kontaktu, takie jak zdjęcie itp. */}
        </View>
      ))}
    </View>
  );
};

export default MessageList;
