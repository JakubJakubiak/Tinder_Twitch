import {doc, onSnapshot} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {db} from './config/firebase';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

interface User {
  uid: string;
  displayName: string;
  image: string;
  userId: string;
}

interface Props {
  navigation: {
    navigate: (screen: string, params: any) => void;
  };
  route: {
    userId: string;
  };
  onPress: () => void;
}

const MessageScreen: React.FC<Props> = ({navigation, route}) => {
  const dimensions = Dimensions.get('window');

  const [notiUsers, setNotiUsers] = useState<User[]>([]);
  const [routeState, setRouteState] = useState<any>(route);

  useEffect(() => {
    const getUserContacts = () => {
      const q = doc(db, 'Users', route.userId);
      onSnapshot(q, async snapshot => {
        if (snapshot.exists()) {
          const contactsObject = snapshot.data()?.realFriend;
          if (contactsObject && contactsObject.length > 0) {
            const contactsDetails = contactsObject.map((friend: any) => ({
              uid: friend.uid,
              displayName: friend.displayName,
              image: friend.image,
              userId: friend.userId,
            }));
            // remove duplicates by id
            const uniqueContacts = Array.from(
              new Set(contactsDetails.map((a: {userId: any}) => a.userId)),
            ).map(userId => {
              return contactsDetails.find(
                (a: {userId: unknown}) => a.userId === userId,
              );
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

  return notiUsers.length === 0 ? (
    <View style={styles.Contain}>
      <ActivityIndicator size="large" color="#841584" />
    </View>
  ) : (
    <FlatList
      data={notiUsers}
      renderItem={({item}) => (
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
            <Image style={styles.userImageST} source={{uri: item.image}} />
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
    margin: 10,
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
    backgroundColor: '#6441a555',
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
});

export default MessageScreen;