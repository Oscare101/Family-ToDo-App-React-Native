import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'

const auth = getAuth()

export default function ToDoScreen() {
  const navigation = useNavigation()

  return (
    <>
      <Text>-----To Do Screen-----</Text>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Text>To User</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({})
