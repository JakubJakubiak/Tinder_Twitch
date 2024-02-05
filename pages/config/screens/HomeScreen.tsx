import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Paring from '../../Paring';

export default function HomeScreen({ navigation, userData }) {

    console.log(navigation);

    return (
        <View style={styles.container}>
            <Paring />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#696969',
    },
});
