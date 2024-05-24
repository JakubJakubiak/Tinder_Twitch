import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {db} from './config/firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';
import {UserData} from './UserDataContext';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface State {
  currentIndex: number;
  images: UserData[];
  likedImage: UserData | null;
}

export default class Pairing extends Component<UserData, State> {
  rotateAndTranslate: any;
  position: Animated.ValueXY;
  rotate: Animated.AnimatedInterpolation<number>;
  likeOpacity: Animated.AnimatedInterpolation<number>;
  dislikeOpacity: Animated.AnimatedInterpolation<number>;
  nextCardOpacity: Animated.AnimatedInterpolation<number>;
  nextCardScale: Animated.AnimatedInterpolation<number>;
  PanResponder: any;

  constructor(props: UserData) {
    super(props);
    this.state = {
      currentIndex: 0,
      images: [],
      likedImage: null,
    };

    this.position = new Animated.ValueXY();
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    this.rotateAndTranslate = {
      transform: [
        {rotate: this.rotate},
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
      outputRange: [1, 0.6, 1],
      extrapolate: 'clamp',
    });

    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy});
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 50) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy},
            useNativeDriver: false,
          }).start(() => {
            this.like();
            this.nextImage();
          });
        } else if (gestureState.dx < -50) {  // Changed threshold to -50 for better response
          Animated.spring(this.position, {
            toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy},
            useNativeDriver: false,
          }).start(() => {
            this.dislike();
            this.nextImage();
          });
        } else {
          Animated.spring(this.position, {
            toValue: {x: 0, y: 0},
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    });
  }

  componentDidMount() {
    this.fetchImages();
  }

  fetchImages = async () => {
    try {
      const usersCollection = collection(db, 'Users');
      const querySnapshot = await getDocs(usersCollection);
      const images: UserData[] = [];

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const image: string = data.avatar;
        const userId = this.props.userId;

        if (userId !== doc.id) {
          images.push({
            image: image,
            userId: doc.id,
            displayName: data.name,
            bio: undefined,
          });
        }
      });

      this.setState(prevState => ({
        images: [...prevState.images, ...images],
      }));
    } catch (error) {
      console.error('Error fetching documents: ', error);
    }
  };

  nextImage = () => {
    this.setState(
      prevState => ({currentIndex: prevState.currentIndex + 1}),
      () => {
        if (this.state.currentIndex >= this.state.images.length) {
          this.fetchImages();
        }
        this.position.setValue({x: 0, y: 0});
      },
    );
  };

  like = async () => {
    const current = this.state.images[this.state.currentIndex];
    this.setState({likedImage: current});

    const userId = this.props.userId;
    const usersCollection = collection(db, 'Users');
    const userDocRef = doc(usersCollection, userId);

    try {
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const realFriendArray = userData?.realFriend || [];
      const updatedRealFriendArray = [
        ...realFriendArray,
        {
          image: current.image,
          userId: current.userId,
          displayName: current.displayName,
        },
      ];
      await setDoc(
        userDocRef,
        {realFriend: updatedRealFriendArray},
        {merge: true},
      );
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  dislike = () => {
    console.log('Disliked:', this.state.images[this.state.currentIndex]);
  };

  renderUsers = () => {
    return this.state.images
      .map((user, index) => {
        if (index < this.state.currentIndex) {
          return null;
        } else if (index === this.state.currentIndex) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={index}
              style={[
                this.rotateAndTranslate,
                {
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: 'absolute',
                },
              ]}>
              <Animated.View
                style={{
                  opacity: this.likeOpacity,
                  transform: [{rotate: '-30deg'}],
                  position: 'absolute',
                  top: 50,
                  left: 40,
                  zIndex: 1000,
                }}>
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: 'green',
                    color: 'green',
                    fontSize: 32,
                    fontWeight: '800',
                    padding: 10,
                  }}>
                  UwU
                </Text>
              </Animated.View>
              <Animated.View
                style={{
                  opacity: this.dislikeOpacity,
                  transform: [{rotate: '30deg'}],
                  position: 'absolute',
                  top: 50,
                  right: 40,
                  zIndex: 1000,
                }}>
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: 'red',
                    color: 'red',
                    fontSize: 32,
                    fontWeight: '800',
                    padding: 10,
                  }}>
                  ARA ARA
                </Text>
              </Animated.View>
              <View style={styles.container}>
                <Image style={styles.img} source={{uri: user.image}} />
                <View style={styles.overlay}>
                  <ScrollView>
                    <Text style={styles.tex}>{user.displayName}</Text>
                  </ScrollView>
                </View>
              </View>
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              key={index}
              style={[
                {
                  opacity: this.nextCardOpacity,
                  transform: [{scale: this.nextCardScale}],
                  height: SCREEN_HEIGHT - 120,
                  width: SCREEN_WIDTH,
                  padding: 10,
                  position: 'absolute',
                },
              ]}>
              <View style={styles.container}>
                <Image style={styles.img} source={{uri: user.image}} />
                <View style={styles.overlay}>
                  <ScrollView>
                    <Text style={styles.tex}>{user.displayName}</Text>
                  </ScrollView>
                </View>
              </View>
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  render() {
    return this.state.images.length === 0 ? (
      this.fetchImages(),
      (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#841584" />
        </View>
      )
    ) : (
      <View style={styles.container}>
        <View style={{height: 60}}></View>
        <View style={styles.containerback}></View>
        <View style={{flex: 1}}>{this.renderUsers()}</View>
        <View style={{height: 60}}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 10,
    marginVertical: 10,
  },
  container: {
    flex: 1,
    // backgroundColor: '#f40f0f0',
  },

  containerback: {
    flex: 1,
    width: 1000,
    height: 1000,
    top: -(930 / 2),
    position: 'absolute',
    backgroundColor: '#6441a555',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
  },

  img: {
    width: 'auto',
    height: "80%",
    padding: 10,
    resizeMode: 'cover',
    borderRadius: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    // top: '48%',
    top: '65%',
    borderRadius: 20,
    width: 300,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tex: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 20,
    color: '#fff',
    fontSize: 37,
    width: 'auto',
    padding: 10,
    textAlign: 'center',
    marginRight: 'auto',
  },
});
