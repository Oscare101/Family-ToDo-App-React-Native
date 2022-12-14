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

export default function ToDoScreen({ route }) {
  const navigation = useNavigation()
  const [userCurrentFamily, setUserCurrentFamily] = useState('')
  const [list, setList] = useState([])
  const [item, setItem] = useState('')

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
          setUserCurrentFamily(item['user-current-family'])
          family = item['user-current-family']
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
        console.log('map:', family, item['family-name'])
        if (family == item['family-name']) {
          setList(item.todoList)
          console.log('list is done')
        } else {
        }
      })
    }
    GetUser()
    console.log(family, userCurrentFamily)

    console.log('family:', family)

    // db.collection('families')
    //   .doc(userCurrentFamily)
    //   .onSnapshot((doc) => {
    //     console.log(doc.data())
    //   })

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
          // let letList = list

          setDBList(list)
          console.log(list)
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
          onPress={() => navigation.goBack()}
        >
          <Text>To User</Text>
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
