import React, { useEffect } from 'react';
import { View } from 'react-native';
import { db } from './config/firebase';
import { 
    collection, 
    setDoc, 
    doc, 
    updateDoc,
    addDoc,
    query, 
    orderBy, 
    onSnapshot,
    getDoc, 
} from 'firebase/firestore';

const ButoaddLogin = ({ user }) => { 
  useEffect(() => {
    addDataToFirestore();
  }, []); 

  const addDataToFirestore = async () => {
    const usersCollection = collection(db, 'Users');
    const userDocRef = doc(usersCollection, user.userId); 

    try {
        const userData = {
            uid: user.userId,
            name: user.displayName,
            req: [],
            realFriend: [],
            avatar: user.image
        };

        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
            // await updateDoc(userDocRef, userData);
            console.log('Document updated successfully');
        } else {
            await setDoc(userDocRef, userData);
            console.log('Document created successfully');
        }
    } catch (error) {
        console.error('Error adding/updating document: ', error);
    }
  };

  return (
    <View/>
  );
};

export default ButoaddLogin;
