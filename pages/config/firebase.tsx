// import { initializeApp } from "firebase/app";
// import { getFirestore} from 'firebase/firestore';
// import { getAuth } from "firebase/auth";
// // import 'firebase/analytics'; 

// const firebaseConfig = {
//       apiKey: "AIzaSyDBc94eADZ57K-CoTaunVZrVyONDNgmdH4",
//       authDomain: "tinder-twitch.firebaseapp.com",
//       databaseURL: "https://tinder-twitch-default-rtdb.firebaseio.com",
//       projectId: "tinder-twitch",
//       storageBucket: "tinder-twitch.appspot.com",
//       messagingSenderId: "344126731835",
//       appId: "1:344126731835:web:5ebd37cbb5281e829c8e1e",
//       measurementId: "G-KPL6ZWB3F3"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth  = getAuth(app);
// // const analytics = firebase.analytics(app); 


// export { db , auth};


// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";


const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  databaseURL:string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
} = {
      apiKey: "AIzaSyDBc94eADZ57K-CoTaunVZrVyONDNgmdH4",
      authDomain: "tinder-twitch.firebaseapp.com",
      databaseURL: "https://tinder-twitch-default-rtdb.firebaseio.com",
      projectId: "tinder-twitch",
      storageBucket: "tinder-twitch.appspot.com",
      messagingSenderId: "344126731835",
      appId: "1:344126731835:web:5ebd37cbb5281e829c8e1e",
      measurementId: "G-KPL6ZWB3F3"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app); 
const auth: Auth = getAuth(app);

export { app, db, auth };
