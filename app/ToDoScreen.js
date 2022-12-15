import React, { useEffect, useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
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

export default function ToDoScreen() {
  const navigation = useNavigation()
  const [userCurrentFamily, setUserCurrentFamily] = useState('')
  const [list, setList] = useState([])
  const [item, setItem] = useState('')
  useEffect(() => {
    let family = []

    const GetUser = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())
      userList.map((item) => {
        if (item['user-email'] == auth.currentUser.email) {
          setUserCurrentFamily(item['user-current-family'])
          family = item['user-current-family']
        }
      })
      const userColF = collection(db, 'families')
      const userSnapshotF = await getDocs(userColF)
      const userListF = userSnapshotF.docs.map((doc) => doc.data())
      userListF.map((item) => {
        if (family == item['family-name']) {
          setList(item.todoList)
        } else {
        }
      })
    }
    GetUser()
  }, [])

  const setDBList = async (item) => {
    setList([])
    setList([...item])
    await setDoc(
      doc(db, 'families', userCurrentFamily),
      {
        'family-name': userCurrentFamily,
        todoList: item,
      },
      { merge: true }
    )
  }

  function ListRender({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.listView}
        onPress={() => {
          list[index].isActive = !list[index].isActive
          setDBList(list)
        }}
        onLongPress={() => {
          list.splice(index, 1)
          setDBList(list)
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
      <View>
        <Text style={styles.headerText}>-----To Do Screen-----</Text>
        {list.map((item, index) => (
          <ListRender item={item} index={index} key={index} />
        ))}
      </View>
      <View>
        <View style={styles.input}>
          <TextInput
            placeholder="item"
            style={styles.inputLine}
            value={item}
            onChangeText={(text) => setItem(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={() => {
            if (item) {
              setDBList([...list, { item: item, isActive: true }])
              setItem('')
            }
          }}
        >
          <Text>Add new task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.navigate('MainScreen')}
        >
          <Text>Back</Text>
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
