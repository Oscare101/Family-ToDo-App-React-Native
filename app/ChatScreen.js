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
  const [user, setUser] = useState('')
  const [chatList, setChatList] = useState([])
  const [text, setText] = useState('')
  useEffect(() => {
    let family = []

    const GetUser = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())
      userList.map((item) => {
        if (item['user-email'] == auth.currentUser.email) {
          setUser(item)
          family = item['user-current-family']
        }
      })
      const userColF = collection(db, 'chats')
      const userSnapshotF = await getDocs(userColF)
      const chatListF = userSnapshotF.docs.map((doc) => doc.data())
      chatListF.map((item) => {
        if (family == item['family-name']) {
          setChatList(item.chat)
        } else {
        }
      })
    }
    GetUser()
  }, [])

  const setDBChat = async (chatArr) => {
    await setDoc(
      doc(db, 'chats', user['user-current-family']),
      {
        chat: chatArr,
      },
      { merge: true }
    )
  }

  const RenderText = ({ item }) => {
    if (item['author-email'] == auth.currentUser.email) {
      return (
        <View style={styles.myTextView}>
          <Text style={styles.myText}>{item.text}</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.otherTextView}>
          <Text style={styles.otherText}>{item.text}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.chatView}>
        {chatList.map((item, index) => (
          <RenderText key={index} item={item} />
        ))}
      </View>
      <View>
        <View style={styles.input}>
          <TextInput
            placeholder="item"
            style={styles.inputLine}
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            if (text) {
              setDBChat([
                ...chatList,
                {
                  text: text,
                  'author-email': auth.currentUser.email,
                  'author-name': user['user-name'],
                },
              ])
              setText('')
            }
          }}
        >
          <Text>Add new task</Text>
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
  chatView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  myTextView: {
    width: '80%',
    padding: 5,
    borderRadius: 5,
    left: '20%',
    backgroundColor: '#cce2e6',
    margin: 5,
  },
  myText: {
    fontSize: 20,
  },
  otherTextView: {
    width: '80%',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#e2cce6',
    margin: 5,
  },
  otherText: {
    fontSize: 20,
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
})
