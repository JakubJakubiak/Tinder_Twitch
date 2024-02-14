import React, {useEffect} from 'react';
import {View} from 'react-native';
import {db} from './config/firebase';
import {collection, setDoc, doc, getDoc} from 'firebase/firestore';
import {UserData} from './UserDataContext';

interface Props {
  user: UserData;
}

const ButoaddLogin: React.FC<Props> = ({user}) => {
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
        avatar: user.image,
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

  return <View />;
};

export default ButoaddLogin;
