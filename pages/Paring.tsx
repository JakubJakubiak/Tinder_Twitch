import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { auth, db } from './config/firebase';
import { 
  collection,
  addDoc,
  query, 
  orderBy, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc} from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Paring extends Component {
  position = new Animated.ValueXY();
  rotate;
  rotateAndTranslate;
  likeOpacity;
  dislikeOpacity;
  nextCardOpacity;
  nextCardScale;
  PanResponder;

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {
      currentIndex: 0,
      dogImages: [],
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate,
        },
        ...this.position.getTranslateTransform(),
      ],
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp',
    });

    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
          this.nextImage();
          this.like();
        });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => {
            this.nextImage();
            this.Nolike();
          });
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }

  componentDidMount() {
    if (this.state.dogImages.length === 0) {
      this.fetchDogImages();
    }
  }

  fetchDogImages = () => {
    fetch('https://end-point-small.vercel.app/firbaselist')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const dogImages = data.map((dog) => ({
            image: dog.avatar, 
            userId: dog.uid, 
            displayName: dog.name
          }));
      
          this.setState((prevState) => ({
            dogImages: [...prevState.dogImages, ...dogImages], 
          }));
        } else {
          console.error('Failed to fetch dog images:', data.message);
        }
      })
      .catch((error) => console.error('Error fetching dog images:', error));
  };

  nextImage = () => {
    this.setState(
      (prevState) => ({ currentIndex: prevState.currentIndex + 1 }),
      () => {
        if (this.state.currentIndex >= this.state.dogImages.length - 1) {
          this.fetchDogImages();
        }
        this.position.setValue({ x: 0, y: 0 });
      }
    );
  };

  like = ()=> {
    console.log("like");
    

  }
  Nolike = ()=> {
    console.log("Nolike");
  }

  renderUsers = () => {
    return this.state.dogImages.map((dog, index) => {
    
    
      if (index < this.state.currentIndex) {
        return null;
      } else if (index === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={index}
            style={[
              this.rotateAndTranslate,
              { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' },
            ]}
          >

            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>UwU</Text>
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>ARA ARA</Text>
            </Animated.View>
            
            <Image style={styles.img} source={{ uri: dog.image }} />
            <ScrollView>
              <Text style={styles.tex2}>{dog.displayName}</Text>
            </ScrollView>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={index}
            style={[
              {
                opacity: this.nextCardOpacity,
                transform: [{ scale: this.nextCardScale }],
                height: SCREEN_HEIGHT - 120,
                width: SCREEN_WIDTH,
                padding: 10,
                position: 'absolute',
              },
            ]}
          >
            <Image style={styles.img} source={{ uri: dog.image }} />
            <ScrollView>
              <Text style={styles.tex2}>{dog.displayName}</Text>
            </ScrollView>
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 60 }}></View>
        <View style={{ flex: 1 }}>{this.renderUsers()}</View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#696969', 
  },
  img: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  tex: {
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
  tex2: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10 ,
  },
  
});
