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
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'

const auth = getAuth()

export default function Registration() {
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('man')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const SetUserName = async () => {
    await setDoc(doc(db, 'users', auth.currentUser.email), {
      'user-name': name,
      'user-email': auth.currentUser.email,
      'user-age': age,
      'user-gender': gender,
      'user-families': [],
    })
  }

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((re) => {
        SetUserName()
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
        placeholder="name"
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="age"
        style={styles.input}
        value={age}
        onChangeText={(text) => setAge(text)}
      />
      <TouchableOpacity
        onPress={() => setGender(gender == 'man' ? 'woman' : 'man')}
      >
        <View
          style={[
            styles.genderView,
            { backgroundColor: gender == 'man' ? 'blue' : 'red' },
          ]}
        >
          <Text>{gender}</Text>
        </View>
      </TouchableOpacity>
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
  genderView: {
    padding: 3,
    borderRadius: 5,
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
