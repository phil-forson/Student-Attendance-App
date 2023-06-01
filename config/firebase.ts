import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import Constants  from "expo-constants";
import  { APIKEY, AUTHDOMAIN, PROJECTID,STORAGEBUCKET, MESSAGINGSENDERID, APPID} from '@env'

const firebaseConfig = {
    apiKey: "AIzaSyBIeBEKx8P4gmBNfSxfb9kuDMJSjd1Vmkc",
    authDomain: "student-attendance-mobile-app.firebaseapp.com",
    projectId: "student-attendance-mobile-app",
    storageBucket: "student-attendance-mobile-app.appspot.com",
    messagingSenderId: "1032906779591",
    appId: "1:1032906779591:web:d752e9ebc3ca069b5647e2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const db = getFirestore()

export default app