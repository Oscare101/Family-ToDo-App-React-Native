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

export default function ToDoScreen({ route }) {
  const navigation = useNavigation()
  // const [user, setUser] = useState([])
  // const [list, setList] = useState([])

  // useEffect(() => {
  //   let family = []
  //   const GetUser = async () => {
  //     const userCol = collection(db, 'users')
  //     const userSnapshot = await getDocs(userCol)
  //     const userList = userSnapshot.docs.map((doc) => doc.data())

  //     userList.map((item) => {
  //       // console.log('user map:', item['user-families'])
  //       if (item['user-email'] == auth.currentUser.email) {
  //         setUser(item['user-families'])
  //         family.push(item['user-families'])
  //         // console.log(item['user-families'])

  //         // console.log('+++', item['user-families'][0])
  //       }
  //     })
  //     GetData()
  //   }
  //   GetUser()
  //   console.log(family, user)

  //   console.log('family:', family)
  //   const GetData = async () => {
  //     const userCol = collection(db, 'families')
  //     const userSnapshot = await getDocs(userCol)
  //     const userList = userSnapshot.docs.map((doc) => doc.data())
  //     userList.map((item) => {
  //       console.log('map:', family[0], item['family-name'])
  //       if (family[0].includes(item['family-name'])) {
  //         setList(item.todoList)
  //         console.log('item:', item.todoList[0].item)
  //       } else {
  //       }
  //     })
  //   }
  //   GetData()
  // }, [])

  return (
    <>
      <Text>-----To Do Screen-----</Text>
      {route.params.list.map((item, index) => (
        <Text key={index}>
          {item.item}, {item.isActive.toString()}
        </Text>
      ))}
      <Text>{route.params.userFamilies}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>To User</Text>
      </TouchableOpacity>
      <Text></Text>
    </>
  )
}

const styles = StyleSheet.create({})
