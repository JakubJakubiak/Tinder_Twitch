import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { db } from './config/firebase';
import { collection, setDoc, doc, updateDoc } from 'firebase/firestore';

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
            req: ["22", "l44l"],
            realFriend: ["przyjaciel1","przyjaciel2","przyjaciel3"],
            avatar: user.image
        };


        // await updateDoc(userDocRef, userData);
        await setDoc(userDocRef, userData);
        console.log('Document written successfully');
    } catch (error) {
        console.error('Error adding document: ', error);
        if (error.code === 'not-found') {
            try {
                await setDoc(userDocRef, userData);
                console.log('Document created successfully');
            } catch (error) {
                console.error('Error creating document: ', error);
            }
        } else {
            console.error('Error updating document: ', error);
        }
    }
  };

  return (
    <View>
      {/* <Button title="Add data" onPress={addDataToFirestore} /> */}
    </View>
  );
};

export default ButoaddLogin;