import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const auth = getAuth()

export default function FamilyScreen() {
  const navigation = useNavigation()
  const [family, setFamily] = useState([])

  useEffect(() => {
    const GetData = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      // wait(1000)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        // console.log('user map:', item['user-families'])
        if (item['user-email'] == auth.currentUser.email) {
          setFamily(item['user-families'])
        }
      })
    }
    GetData()
  }, [])

  return (
    <View>
      <Text>
        user:{auth.currentUser.email}, {family}
      </Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>back</Text>
      </TouchableOpacity>
    </View>
  )
}
