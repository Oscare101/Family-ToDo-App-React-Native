import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import auth from '../firebase/firebase-config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDatabase, ref, set, onValue, get, child } from 'firebase/database'
import { database } from '../firebase/firebase-config'
const auth = getAuth()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function Login() {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSecure, setIsSecure] = useState(true)

  const [list, setList] = useState([])

  // function writeUserData(email, password) {
  //   set(ref(database, 'ppp/' + '1'), {
  //     email: email,
  //   })

  //   const starCountRef = ref(database, 'ppp/1/')
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val()
  //     console.log('list:', snapshot)
  //     setList([...list, snapshot])
  //   })
  //   console.log(list)
  // }

  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (re) => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
        setEmail('')
        setPassword('')
        navigation.navigate('MainNavigation')
      })
      .catch((err) => console.log(err))
  }

  useEffect(async () => {
    setEmail(await AsyncStorage.getItem('email'))
    setPassword(await AsyncStorage.getItem('password'))
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.inputBlock}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.input}>
          <TextInput
            placeholder="email"
            style={styles.inputLine}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder="password"
            style={styles.inputLine}
            value={password}
            autoCorrect={false}
            secureTextEntry={isSecure}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 5 }}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => loginUser(email, password)}>
          <View style={styles.buttonSubmit}>
            <Text style={styles.buttonSubmitText}>Log in</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <View style={styles.buttonChange}>
            <Text style={styles.buttonChangeText}> to Registration</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 50,
    flex: 1,
    paddingTop: height * 0.1 + 50,
    backgroundColor: colors.white,
  },
  circle1: {
    width: height * 0.4,
    height: height * 0.4,
    position: 'absolute',
    backgroundColor: colors.mainpurple,
    borderRadius: 1000,
    bottom: width * -0.2,
    right: width * -0.3,
  },
  circle2: {
    width: height * 0.7,
    height: height * 0.7,
    position: 'absolute',
    backgroundColor: colors.mainblue,
    borderRadius: 1000,
    right: width * 0.25,
    top: -50,
  },
  inputBlock: {
    backgroundColor: colors.background,
    borderRadius: 25,
    padding: 25,
    borderWidth: 2,
    borderColor: colors.darkbackground,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  inputLine: {
    width: '100%',
    height: 30,
  },
  buttonSubmit: {
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.black,
    width: '100%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonChange: {
    marginVertical: 5,
    backgroundColor: colors.black,
    borderRadius: 5,
    width: '100%',
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSubmitText: {
    color: colors.black,
  },
  buttonChangeText: {
    color: colors.white,
  },
})
