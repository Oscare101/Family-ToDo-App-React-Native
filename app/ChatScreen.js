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
// import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

const auth = getAuth()

// const userColF = collection(db, 'chats')

// onSnapshot(userColF, (snapshot) => {
//   let books = []
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), text: doc.text })
//     console.log(books)
//   })
// })

export default function ToDoScreen() {
  const navigation = useNavigation()
  const [user, setUser] = useState('')
  const [chatList, setChatList] = useState([])
  const [text, setText] = useState('')

  const GetUser = async () => {
    let family = []

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
        setChatList(item.chat.reverse())
      } else {
      }
    })
  }

  //   useEffect(() => {
  //     const unsuscribe = onSnapshot(doc(db, 'chats', 'f2'), (querySnapshot) => {
  //       console.log(querySnapshot)
  //       setChatList(querySnapshot)
  //     })
  //     return () => {
  //       unsuscribe()
  //     }
  //   }, [chatList])

  //   const unsub = onSnapshot(doc(db, 'chats', 'f2'), (doc) => {
  //     console.log('Current data: ', doc.data())
  //     unsub()
  //   })

  useEffect(() => {
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

  const RenderText = ({ item, index }) => {
    if (!item.text) {
      return (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text>{item['author-name']} deleted the message</Text>
        </View>
      )
    }
    if (item['author-email'] == auth.currentUser.email) {
      return (
        <TouchableOpacity
          onLongPress={() => {
            console.log(index)
            chatList[index].text = ''
            let buffer = chatList
            setChatList([...buffer])
            setDBChat(buffer)
          }}
          style={{
            width: '100%',
            alignItems: 'flex-end',
          }}
        >
          <View style={styles.myTextView}>
            <Text style={styles.myText}>{item.text}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={styles.otherTextView}>
          <Text>{item['author-name']}</Text>
          <Text style={styles.otherText}>{item.text}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={{ flex: 1 }}>
        <FlatList
          data={chatList}
          inverted={true}
          renderItem={(item, index) => RenderText(item, index)}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
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
              let buffer = {
                text: text,
                'author-email': auth.currentUser.email,
                'author-name': user['user-name'],
              }
              let bufferChat = [...chatList.reverse(), buffer]
              setDBChat(bufferChat)
              setChatList(bufferChat.reverse())
              //   setChatList(setChatList)
              setText('')
            }
          }}
        >
          <FontAwesome name="send-o" size={34} color="black" />
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
  circle1: {
    width: height * 0.4,
    height: height * 0.4,
    position: 'absolute',
    backgroundColor: '#816bff55',
    borderRadius: 1000,
    top: width * 0.2,
    right: width * -0.3,
  },
  circle2: {
    width: height * 0.7,
    height: height * 0.7,
    position: 'absolute',
    backgroundColor: '#ff6b8155',
    borderRadius: 1000,
    right: width * 0.25,
    bottom: -50,
  },
  headerText: {
    alignSelf: 'center',
  },
  chatScrollView: {
    flex: 1,
    flexDirection: 'column',
  },
  chatView: {
    flex: 1,
    bottom: 0,
  },
  myTextView: {
    width: '80%',
    padding: 5,
    borderRadius: 10,
    borderBottomEndRadius: 0,
    backgroundColor: '#ff6b81ee',
    margin: 5,
  },
  myText: {
    fontSize: 24,
  },
  otherTextView: {
    width: '80%',
    padding: 5,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: '#816bffee',
    margin: 5,
  },
  otherText: {
    fontSize: 24,
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
    width: '90%',
    height: 40,
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
    height: 40,
  },
})
