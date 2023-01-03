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
import colors from '../constants/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
      'user-families': [],
      'user-current-family': '',
    })
  }

  function register() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (re) => {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
        await AsyncStorage.setItem('language', 'en')

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
      <View style={styles.inputBlock}>
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
          activeOpacity={1}
          onPress={() => setGender(gender == 'man' ? 'woman' : 'man')}
        >
          <View
            style={[
              styles.genderView,
              {
                backgroundColor:
                  gender == 'man' ? colors.mainblue : colors.mainpurple,
              },
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
            <Text style={styles.buttonSubmitText}>Regitraion</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.buttonChange}>
            <Text style={styles.buttonChangeText}>to Login</Text>
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

  genderView: {
    padding: 3,
    borderRadius: 5,
    height: 30,
    elevation: 5,
    borderWidth: 1,
    marginVertical: 5,
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
