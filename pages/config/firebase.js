// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// // import Constants from "expo-constants";

// // Firebase config
// const firebaseConfig = {
//     apiKey: "AIzaSyDBc94eADZ57K-CoTaunVZrVyONDNgmdH4",
//     authDomain: "tinder-twitch.firebaseapp.com",
//     databaseURL: "https://tinder-twitch-default-rtdb.firebaseio.com",
//     projectId: "tinder-twitch",
//     storageBucket: "tinder-twitch.appspot.com",
//     messagingSenderId: "344126731835",
//     appId: "1:344126731835:web:5ebd37cbb5281e829c8e1e",
//     measurementId: "G-KPL6ZWB3F3"
//   //   @deprecated is deprecated Constants.manifest
// };
// // initialize firebase
// // initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
// // export const auth = getAuth(app);
// export const database = getFirestore(app);



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
      apiKey: "AIzaSyDBc94eADZ57K-CoTaunVZrVyONDNgmdH4",
      authDomain: "tinder-twitch.firebaseapp.com",
      databaseURL: "https://tinder-twitch-default-rtdb.firebaseio.com",
      projectId: "tinder-twitch",
      storageBucket: "tinder-twitch.appspot.com",
      messagingSenderId: "344126731835",
      appId: "1:344126731835:web:5ebd37cbb5281e829c8e1e",
      measurementId: "G-KPL6ZWB3F3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);


const database = getFirestore(app);

export { db , database };
