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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);


const database = getFirestore(app);

export { db , database };
