import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
// import auth from '../firebase/firebase-config'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Ionicons } from '@expo/vector-icons'

const auth = getAuth()

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
        navigation.navigate('UserScreen')
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={{ width: '100', flexDirection: 'row' }}>
        <TextInput
          placeholder="password"
          style={styles.input}
          value={password}
          autoCorrect={false}
          secureTextEntry={isSecure}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
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
          <Text style={styles.buttonText}> to registration</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 50,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 2,
    marginVertical: 5,
    width: '100%',
  },
  buttonSubmit: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonChange: {
    marginVertical: 5,
    padding: 5,
    backgroundColor: '#0088ee',
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonText: {},
})
