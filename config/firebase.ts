import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database";
import { getReactNativePersistence } from "firebase/auth/react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"


import Constants  from "expo-constants";
import  { APIKEY, AUTHDOMAIN, PROJECTID,STORAGEBUCKET, MESSAGINGSENDERID, APPID} from '@env'

const firebaseConfig = {
    apiKey: "AIzaSyD-hWECrkfiIb_5YUz7-hwjJPtj_oMDRas",
    authDomain: "presensa-6dc73.firebaseapp.com",
    databaseURL: "https://presensa-6dc73-default-rtdb.firebaseio.com",
    projectId: "presensa-6dc73",
    storageBucket: "presensa-6dc73.appspot.com",
    messagingSenderId: "647096322688",
    appId: "1:647096322688:web:605803f28ac75e454ab465",
    measurementId: "G-R35GLWWR6C"
  };

const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const auth = getAuth(app)

export const database = getDatabase(app);
export const db = getFirestore()

export default app