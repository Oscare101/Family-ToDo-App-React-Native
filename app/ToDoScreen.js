import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
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
  const [user, setUser] = useState([])
  const [list, setList] = useState([])

  useEffect(() => {
    let family = []

    const GetUser = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      // wait(1000)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        // console.log('user map:', item['user-families'])
        if (item['user-email'] == auth.currentUser.email) {
          setUser(item['user-families'])
          family.push(item['user-families'])
          console.log('family is done')

          // console.log(item['user-families'])

          // console.log('+++', item['user-families'][0])
        }
      })
      // GetData()
      const userColF = collection(db, 'families')
      const userSnapshotF = await getDocs(userColF)
      // wait(1000)
      const userListF = userSnapshotF.docs.map((doc) => doc.data())
      userListF.map((item) => {
        console.log('map:', family[0], item['family-name'])
        if (family[0].includes(item['family-name'])) {
          setList(item.todoList)
          console.log('list is done')
        } else {
        }
      })
    }
    GetUser()
    console.log(family, user)

    console.log('family:', family)
    // const GetData = async () => {
    //   const userCol = collection(db, 'families')
    //   const userSnapshot = await getDocs(userCol)
    //   wait(1000)
    //   const userList = userSnapshot.docs.map((doc) => doc.data())
    //   userList.map((item) => {
    //     console.log('map:', family[0], item['family-name'])
    //     if (family[0].includes(item['family-name'])) {
    //       setList(item.todoList)
    //       console.log('list is done')
    //     } else {
    //     }
    //   })
    // }
    // GetData()
  }, [])

  function ListRender({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.listView}
        onPress={() => {
          let letList = list
          letList[index].isActive = !letList[index].isActive
          setList(letList)
          console.log(list)
        }}
      >
        <Ionicons
          name="checkbox-outline"
          size={24}
          color={item.isActive ? '#eeeeee00' : '#333'}
        />
        <Text
          style={[
            styles.listText,
            { textDecorationLine: item.isActive ? 'none' : 'line-through' },
          ]}
        >
          {item.item}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>-----To Do Screen-----</Text>
      {list.map((item, index) => (
        <ListRender item={item} index={index} key={index} />
      ))}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>To User</Text>
      </TouchableOpacity>
      <Text></Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: '5%',
    flex: 1,
  },
  headerText: {
    alignSelf: 'center',
  },
  listView: {
    width: '100%',
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 1,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
  },
  listText: {
    fontSize: 20,
  },
})
