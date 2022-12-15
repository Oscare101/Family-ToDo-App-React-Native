import React, { useEffect, useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { getDocs, doc, setDoc, collection } from 'firebase/firestore/lite'
import { onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

const auth = getAuth()

export default function SettingsScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <View>
        <Text>Settings Screen</Text>
      </View>
      <View>
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text>Go back</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: '5%',
    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  buttonAdd: {
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
  buttonBack: {
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
})
