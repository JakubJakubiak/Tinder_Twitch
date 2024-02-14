import React, {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
  Fragment,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {db} from './config/firebase';
import {signOut} from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  GiftedChat,
  InputToolbar,
  SystemMessage,
  Bubble,
  IMessage,
  InputToolbarProps,
} from 'react-native-gifted-chat';
import {useUserData} from './UserDataContext';

const Chat = ({navigation, route}) => {
    const [messages, setMessages] = useState([]);
    const user = useUserData();

    const c_uid = user.userData?.userId ?? '';
    const t_uid = route.params.userId;
    const avatar_id = route.params.avatar;

const customtInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
        <InputToolbar
        {...props}
        containerStyle={{
            backgroundColor: '#E0E0E0',
            borderTopColor: '#E8E8E8',
            borderTopWidth: 1,
        }}
        textInputStyle={{
            color: '#000',
        }}
    />
    );
};

    useEffect(() => {
        getAllMessages();
    }, []); 

    const getAllMessages = async () => {
    const chatid = t_uid > c_uid ? c_uid + '-' + t_uid : t_uid + '-' + c_uid;

    const q = query(
        collection(db, 'Chats', chatid, 'messages'),
        orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(q, snapshot =>
        setMessages(
        snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
        })),
      ),
    );
  };

    const onSendMsg = async (msgArray: any[]) => {
    const msg = msgArray[0];
    const time = new Date();
    const userMsg = {
        ...msg,
        sentBy: c_uid,
        sentTo: t_uid,
        createdAt: time,
    };
    setMessages(previousMessages =>
        GiftedChat.append(previousMessages, userMsg),
    );
    const chatid = t_uid > c_uid ? c_uid + '-' + t_uid : t_uid + '-' + c_uid;
    //collection of React
    const docRef = collection(db, 'Chats', chatid, 'messages');
    await addDoc(docRef, {...userMsg, createdAt: time});
};
    return (
    // (messages.length === 0) ?
    // (
    // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //     <ActivityIndicator size="large" color="#841584" />
    // </View >):
    <GiftedChat
        style={{flex: 1, backgroundColor: '#001973'}}
        showAvatarForEveryMessage={true}
        messages={messages}
        onSend={text => onSendMsg(text)}
        user={{
        _id: c_uid,
        avatar: avatar_id,
        }}
        renderInputToolbar={props => customtInputToolbar(props)}
        renderBubble={props => {
        return (
        <Bubble
            {...props}
            textStyle={{
            right: {
                color: 'white',
                // fontFamily: "CerebriSans-Book"
            },
            left: {
                color: '#24204F',
                // fontFamily: "CerebriSans-Book"
            },
            }}
            wrapperStyle={{
            left: {
                backgroundColor: '#E6F5F3',
            },
            right: {
                backgroundColor: '#3A13C3',
            },
            }}
        />
        );
    }}
    />
);
};

export default Chat;
