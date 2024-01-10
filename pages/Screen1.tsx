import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ScrollView } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Screen1 extends Component {
  position: Animated.ValueXY;
  rotate: any;
  rotateAndTranslate: { transform: any[]; };
  likeOpacity: any;
  dislikeOpacity: any;
  nextCardOpacity: any;
  nextCardScale: any;
  PanResponder: any;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      id: '',
      pageID: '',
      url: [],
      extract: [],
      like: [],
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
  }

  componentDidMount = () => {
    fetch(`https://pl.wikipedia.org/api/rest_v1/page/random/summary`)
      .then((res) => res.json())
      .then((wiki) =>
        this.setState({
          url: wiki.thumbnail.source,
          extract: wiki.extract,
          id: wiki.pageid,
        })
      )
      .catch((err) => console.log(err));
  };

  mount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (undefined) {
          this.setState({
            currentIndex: 0,
          });
          this.componentDidMount();
          console.log(this.state.currentIndex);
        }

        if (gestureState.dx > 50) {
          this.setState({ like: { uri: `${this.state.url}` } });
          Animated.spring(this.position, {
              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
              useNativeDriver: false
          }).start(() => {
            this.setState(
              { currentIndex: this.state.currentIndex + 1 },
              () => {
                this.position.setValue({ x: 0, y: 0 });
                console.log(this.state.currentIndex, SCREEN_WIDTH);
              }
            );
          });
        } else if (gestureState.dy >= 0 || gestureState.dy <= 0) {
          Animated.spring(this.position, {
              toValue: { x: SCREEN_WIDTH, y: gestureState.dy },
              useNativeDriver: false
          }).start(() => {
            this.setState({ currentIndex: '' }, () => {
              this.position.setValue({ x: 0, y: 0 });
              console.log(this.state.currentIndex);
            });
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
              useNativeDriver: false
          }).start(() => {
            this.setState(
              { currentIndex: this.state.currentIndex + 1 },
              () => {
                this.position.setValue({ x: 0, y: 0 });
                console.log(this.state.currentIndex);
              }
            );
          });
        }

        if (this.state.currentIndex >= 0) {
          this.setState({
            currentIndex: this.state.currentIndex - (this.state.currentIndex + 1),
            url: [],
          });
          this.componentDidMount();
        } else {
          Animated.spring(this.position, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false
          }).start();
        }
      },
    });
  }

  renderUsers = () => {
    let Users = [
      {
        id: `${this.state.id}`,
        uri: { uri: `${this.state.url}` },
        Text: `${this.state.extract}`,
      },
    ];
    console.log(Users, this.state.like, this.state.currentIndex);
    return Users.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null;
      } else if (i == this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id}
            style={[
              this.rotateAndTranslate,
              { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' },
            ]}
          >
            <Animated.View
              style={{
                opacity: this.likeOpacity,
                transform: [{ rotate: '-30deg' }],
                position: 'absolute',
                top: 50,
                left: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'green',
                  color: 'green',
                  fontSize: 32,
                  fontWeight: '800',
                  padding: 10,
                }}
              >
                LIKE
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: this.dislikeOpacity,
                transform: [{ rotate: '30deg' }],
                position: 'absolute',
                top: 50,
                right: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'red',
                  color: 'red',
                  fontSize: 32,
                  fontWeight: '800',
                  padding: 10,
                }}
              >
                NOPE
              </Text>
            </Animated.View>

            <Image style={styles.img} source={item.uri} />
            <ScrollView>
              <Text style={styles.tex}>{item.Text}</Text>
            </ScrollView>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.id}
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
            <Animated.View
              style={{
                opacity: 0,
                transform: [{ rotate: '-30deg' }],
                position: 'absolute',
                top: 50,
                left: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'green',
                  color: 'green',
                  fontSize: 32,
                  fontWeight: '800',
                  padding: 10,
                }}
              >
                LIKE
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: 0,
                transform: [{ rotate: '30deg' }],
                position: 'absolute',
                top: 50,
                right: 40,
                zIndex: 1000,
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: 'red',
                  color: 'red',
                  fontSize: 32,
                  fontWeight: '800',
                  padding: 10,
                }}
              >
                NOPE
              </Text>
            </Animated.View>

            <Image style={styles.img} source={item.uri} />
            <Text style={styles.tex2} />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    this.mount();
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
