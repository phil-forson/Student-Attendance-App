import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Constants  from "expo-constants";
import  { APIKEY, AUTHDOMAIN, PROJECTID,STORAGEBUCKET, MESSAGINGSENDERID, APPID} from '@env'

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export default app