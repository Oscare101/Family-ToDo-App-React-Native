import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'

const auth = getAuth()

export default function ToDoScreen() {
  const navigation = useNavigation()
  const [user, setUser] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    const GetUser = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        if (item['user-email'] == auth.currentUser.email) {
          setUser(item['user-families'])
        }
      })
    }
    GetUser()

    const GetData = async () => {
      const userCol = collection(db, 'families')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())
      userList.map((item) => {
        if (user.includes(item['family-name'])) {
          setList(item)
          console.log('item:', item)
        } else {
        }
      })
    }
    GetData()
  }, [])

  return (
    <>
      <Text>-----To Do Screen-----</Text>
      {list.map((item, index) => (
        <Text key={index}>
          {item.item}, {item.isActive}
        </Text>
      ))}
      <Text>{user}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Text>To User</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({})
