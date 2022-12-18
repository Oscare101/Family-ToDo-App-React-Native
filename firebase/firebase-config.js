import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDGzxx6Hw_0s6PWUQ3uVkP3YvREEkYAh-A',
  authDomain: 'familytodo-8e013.firebaseapp.com',
  projectId: 'familytodo-8e013',
  storageBucket: 'familytodo-8e013.appspot.com',
  messagingSenderId: '582327765484',
  appId: '1:582327765484:web:de364df22ece7cc34ad8c9',
  // databaseURL:
  //   'https://familytodo-8e013-default-rtdb.europe-west1.firebasedatabase.app',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

//for realtime databas
export const database = getDatabase(app)
