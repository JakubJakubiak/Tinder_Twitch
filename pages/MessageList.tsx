import { collection, addDoc, query, orderBy, onSnapshot,where,getDoc,doc,updateDoc,arrayUnion,arrayRemove} from 'firebase/firestore';
import React, { useEffect, useState,useLayoutEffect,Fragment} from 'react';
import { auth, db } from './config/firebase';
// import { collection, query, where } from "firebase/firestore";
import {
  SafeAreaView,
  StatusBar,

  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ScrollView,
  Button,
  useColorScheme,
  View,
  Dimensions,

  
} from 'react-native';


const MessageScreen = ({navigation,route})=>{
    const dimensions = Dimensions.get('window');
    const imageWidth = dimensions.width;
    // const [users, setUsers] = useState(null)

    // const getUsers = async ()=> {
    //     var userList = []
    //     console.log(route.params.user_id)
    //     const q = query(collection(db, 'users'), where('uid','!=',route.params.user_id));
    //     console.log(q);
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((doc) => {
    //         userList.push(doc.data())
    //     console.log(doc.id, " => ", doc.data());
    //     });
    //     console.log(userList);
    //     setUsers(userList)
    // }

    // useEffect(()=>{
    //     getUsers()
    //   },[])



      const [notiUsers, setNotiUsers] = useState([])
      const [Users, setUsers] = useState([])
  
      // const getNotiUser = async ()=> {
      //     const q = query(doc(db, "users", route.params.user_id));
      //     const unsubscribe = onSnapshot(q, (snapshot) => {
      //       var userList1 = []
      //       console.log(snapshot.data());
      //       if (snapshot.data().realFriend.length > 0){
      //         snapshot.data().realFriend.forEach(
      //           (uid) =>
      //           {
      //             const docRef1 = doc(db, "users", uid);
      //             const _unsubscribe = onSnapshot(docRef1, (snapshot) => {
      //               userList1.push(snapshot.data())
      //             console.log(snapshot.data());
      //             }) })}
      //       setNotiUsers(userList1)
            
      //     })
  
      //   }
  
      // useEffect(()=>{
      //     getNotiUser();
      //   },[navigation])
  
      useEffect(() => {
        const getUserContacts = () => {
          const q = query(doc(db, "Users", route.userId));
          const unsubscribe = onSnapshot(q, async(snapshot) => {
            if (snapshot.exists()) {
              const contactsObject = snapshot.data().realFriend;
              if (contactsObject && contactsObject.length > 0) { 
                const contactsSnap = await Promise.all(contactsObject.map((c) => getDoc(doc(db, "users", c))))
                const contactDetails = contactsSnap.map((d) => ({
                  uid: d.id, 
                  ...d.data()
                }))
                console.log(contactDetails);
                setNotiUsers(contactDetails);
              } else {
                console.log("No realFriend data found.");
                setNotiUsers([]);
              }
            } else {
              console.log("Snapshot does not exist.");
              setNotiUsers([]);
            }
          });
        }
      
        getUserContacts();
      }, [route.userId]);

    return(
      <FlatList
      data={notiUsers}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { name: item.displayName, uid: item.userId, avatar: item.image })}>
          {console.log(item.uid)}
          <View style={styles.card}>
            {/* <Image style={styles.userImageST} source={{ uri: item.image }} /> */}
            <Image style={styles.userImageST} source={{  }} />
            <View style={styles.textArea}>
              <Text style={styles.nameText}>{item.uid}</Text>
              <Text style={styles.msgContent}>{item.userId}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
     
    )
}

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
    marginVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width: 50,
    height: 50,
    borderRadius: 25,
  }, 
  textArea: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 10,
    width: 300,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
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
    resizeMode: 'cover',
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
