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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

export default function Registration() {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((re) => {
        setEmail('')
        setPassword('')
        navigation.navigate('UserScreen')
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registration</Text>
      <TextInput
        placeholder="email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="password"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity onPress={() => register(email, password)}>
        <View style={styles.buttonSubmit}>
          <Text style={styles.buttonText}>regitraion</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <View style={styles.buttonChange}>
          <Text style={styles.buttonText}>to login</Text>
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
