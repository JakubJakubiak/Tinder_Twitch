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

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Screen1 extends Component {
  position = new Animated.ValueXY();
  rotate;
  rotateAndTranslate;
  likeOpacity;
  dislikeOpacity;
  nextCardOpacity;
  nextCardScale;
  PanResponder;

  constructor(props) {
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
          }).start(() => this.nextImage());
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: false,
          }).start(() => this.nextImage());
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
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          this.setState((prevState) => ({
            dogImages: [...prevState.dogImages, ...data.message],
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

  renderUsers = () => {
    return this.state.dogImages.map((imageUrl, index) => {
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
            {/* <TouchableOpacity onPress={this.nextImage}>
              <View style={{ backgroundColor: 'transparent', position: 'absolute', bottom: 20, left: 20, zIndex: 1000 }} />
              <Text style={{ color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
            </TouchableOpacity> */}
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                UwU
              </Text>
            </Animated.View>
            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>
                ARA ARA
              </Text>
            </Animated.View>
            <Image style={styles.img} source={{ uri: imageUrl }} />
            <ScrollView>
              <Text style={styles.tex}>{/* Add your text here */}</Text>
            </ScrollView>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={index}
            style={[
              { opacity: this.nextCardOpacity, transform: [{ scale: this.nextCardScale }], height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' },
            ]}
          >
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                LIKE
              </Text>
            </Animated.View>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>
                NOPEee
              </Text>
            </Animated.View>
            <Image style={styles.img} source={{ uri: imageUrl }} />
            <Text style={styles.tex2} />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: 60 }}></View>
        <View style={{ flex: 1 }}>{this.renderUsers()}</View>
        <View style={{ height: 60 }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  tex: {
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
  tex2: {
    flex: 1,
    backgroundColor: '#ffffff00',
  },
});
