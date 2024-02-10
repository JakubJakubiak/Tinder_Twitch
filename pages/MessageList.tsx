import { query, onSnapshot, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from './config/firebase';
// import { collection, query, where } from "firebase/firestore";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  View,
  Dimensions,
} from 'react-native';

const MessageScreen = ({ navigation, route }) => {
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width;

  const [notiUsers, setNotiUsers] = useState([]);
  const [Users, setUsers] = useState([]);
  const [routeState, setRouteState] = useState(route);

  useEffect(() => {
    const getUserContacts = () => {
      const q = query(doc(db, 'Users', route.userId));
      const unsubscribe = onSnapshot(q, async snapshot => {
        if (snapshot.exists()) {
          const contactsObject = snapshot.data().realFriend;
          if (contactsObject && contactsObject.length > 0) {
            const contactsDetails = contactsObject.map(friend => ({
              uid: friend.uid,
              displayName: friend.displayName,
              image: friend.image,
              userId: friend.userId,
            }));
            // remove duplicates by id
            const uniqueContacts = Array.from(
              new Set(contactsDetails.map(a => a.userId)),
            ).map(userId => {
              return contactsDetails.find(a => a.userId === userId);
            });

            setNotiUsers(uniqueContacts);
          } else {
            console.log('No realFriend data found.');
            setNotiUsers([]);
          }
        } else {
          console.log('Snapshot does not exist.');
          setNotiUsers([]);
        }
      });
    };

    getUserContacts();
  }, [route.userId]);

  return (
    <FlatList
      data={notiUsers}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Chat', {
              name: item.displayName,
              uid: item.uid,
              avatar: item.image,
              userId: item.userId,
              routeState: routeState,
            })
          }>
          <View style={styles.card}>
            <Image style={styles.userImageST} source={{ uri: item.image }} />
            <View style={styles.textArea}>
              <Text style={styles.nameText}>{item.displayName}</Text>
              <Text style={styles.msgContent}>{item.userId}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};


const styles = StyleSheet.create({
    Contain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
  Container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    height: 'auto',
    marginHorizontal: 4,
    // marginVertical: 6,
    marginVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#444',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  userImage: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  userImageST: {
    margin: (10, 10),
    width: 80,
    height: 80,
    borderRadius: 25,
  }, 
  textArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 280,
  },
  userText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    height: null,
    width: null,
    borderRadius: 5,
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    backgroundColor: '#ffffff69', 
    
  },
  msgTime: {
    textAlign: 'right',
    fontSize: 11,
    marginTop: -20,
  },
  msgContent: {
    paddingTop: 5,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

})

export default MessageScreen;