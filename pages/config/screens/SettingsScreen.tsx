import * as React from 'react';
import { View, Text } from 'react-native';

import MessageList from '../../MessageList';

export default function SettingsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#696969' }}>
            <MessageList
                navigation={navigation} // Przekazanie navigation jako prop do MessageList
                route={{
                    "accessToken": "denu7h8opnxyot",
                    "bio": "",
                    "displayName": "inulive",
                    "image": "https://static-cdn.jtvnw.net/jtv_user_pictures/2a9fd65f-4ec6-409a-af68-9867746cb77a-profile_image-300x300.png",
                    "refreshToken": "91838xoeo4vj31zo34cmenjlkkp4k4k",
                    "userId": "417210681"
                }}
            />
        </View>
    );
}
