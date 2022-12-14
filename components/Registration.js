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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { Ionicons } from '@expo/vector-icons'
const auth = getAuth()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default function Registration() {
  const navigation = useNavigation()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('man')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isSecure, setIsSecure] = useState(true)

  const SetUserName = async () => {
    await setDoc(doc(db, 'users', auth.currentUser.email), {
      'user-name': name,
      'user-email': auth.currentUser.email,
      'user-age': age,
      'user-gender': gender,
      'user-families': ['f2', 'f3'],
      'user-current-family': 'f2',
    })
  }

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((re) => {
        SetUserName()
        setEmail('')
        setPassword('')
        navigation.navigate('FirstPage')
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View>
        <Text style={styles.title}>Registration</Text>
        <View style={styles.input}>
          <TextInput
            placeholder="name"
            style={styles.inputLine}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder="age"
            style={styles.inputLine}
            value={age}
            onChangeText={(text) => setAge(text)}
          />
        </View>

        <TouchableOpacity
          onPress={() => setGender(gender == 'man' ? 'woman' : 'man')}
        >
          <View
            style={[
              styles.genderView,
              { backgroundColor: gender == 'man' ? 'blue' : 'red' },
            ]}
          >
            <Ionicons
              name={gender == 'man' ? 'man-outline' : 'woman-outline'}
              size={18}
              color="#000"
            />
            <Text>{gender}</Text>
          </View>
        </TouchableOpacity>

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
        <TouchableOpacity onPress={() => register(email, password)}>
          <View style={styles.buttonSubmit}>
            <Text style={styles.buttonText}>Regitraion</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.buttonChange}>
            <Text style={styles.buttonText}>to Login</Text>
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
    top: width * 0.2,
    right: width * -0.3,
  },
  circle2: {
    width: height * 0.7,
    height: height * 0.7,
    position: 'absolute',
    backgroundColor: '#ff6b81ee',
    borderRadius: 1000,
    right: width * 0.25,
    bottom: -50,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 1,
    alignSelf: 'center',
  },

  genderView: {
    padding: 3,
    borderRadius: 5,
    height: 30,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 5,
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
    elevation: 5,
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
    elevation: 5,
  },
  buttonText: {},
})
