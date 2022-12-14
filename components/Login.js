import React, { useState } from 'react'
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

const auth = getAuth()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function Login() {
  const navigation = useNavigation()

  const [email, setEmail] = useState('123@gmail.com')
  const [password, setPassword] = useState('123456')
  const [isSecure, setIsSecure] = useState(true)

  const loginUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((re) => {
        setEmail('')
        setPassword('')
        navigation.navigate('MainNavigation')
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View>
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
            <Text style={styles.buttonText}>Log in</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <View style={styles.buttonChange}>
            <Text style={styles.buttonText}> to Registration</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 50,
    flex: 1,
    paddingTop: height * 0.1,
  },
  circle1: {
    width: height * 0.4,
    height: height * 0.4,
    position: 'absolute',
    backgroundColor: '#816bffee',
    borderRadius: 1000,
    bottom: width * -0.2,
    right: width * -0.3,
  },
  circle2: {
    width: height * 0.7,
    height: height * 0.7,
    position: 'absolute',
    backgroundColor: '#ff6b81ee',
    borderRadius: 1000,
    right: width * 0.25,
    top: -50,
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
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '100%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonChange: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: '#0088ee',
    borderRadius: 5,
    width: '100%',
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {},
})
