import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { EvilIcons } from '@expo/vector-icons'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default function MainScreen() {
  const navigation = useNavigation()
  const [userFamilies, setUserFamilies] = useState([])
  const [name, setName] = useState('')
  const [list, setList] = useState([])
  const [isLoaded, seIsLoaded] = useState(false)

  const Data = [
    { id: 1, text: 'ToDo', icon: 'list', screen: 'ToDoScreen' },
    {
      id: 2,
      text: 'Chat',
      icon: 'chatbox-ellipses-outline',
      screen: 'ChatScreen',
    },
    { id: 3, text: 'Plans', icon: 'calendar-outline', screen: 'ToDoScreen' },
    { id: 4, text: 'Family', icon: 'people-outline', screen: 'FamilyScreen' },
  ]

  // useEffect(() => {
  //   let family = [] // const for user families list
  //   let nameConst = '' // const for user name
  //   let listConst = [] // const for user family list
  //   const GetUser = async () => {
  //     const userCol = collection(db, 'users')
  //     const userSnapshot = await getDocs(userCol)
  //     //   waitFor(() => {
  //     //   expect(getDocs(userCol)).toHaveBeenCalledWith()
  //     // }, 10000)

  //     const userList = userSnapshot.docs.map((doc) => doc.data())

  //     userList.map((item) => {
  //       // console.log('user map:', item['user-families'])
  //       if (item['user-email'] == auth.currentUser.email) {
  //         // setUserFamilies(item['user-families'])
  //         family = item['user-families']
  //       }
  //       if (item['user-email'] == auth.currentUser.email) {
  //         console.log('user: ', item)
  //         // setName(item['user-name'])
  //         nameConst = item['user-name']
  //       }
  //     })
  //     if ((family.length = 0)) {
  //       console.log('family length = 0')
  //       GetUser()
  //     }
  //   }
  //   GetUser()
  //   console.log(family, userFamilies)

  //   console.log('family:', family)
  //   const GetData = async () => {
  //     const userCol = collection(db, 'families')
  //     const userSnapshot = await getDocs(userCol)
  //     //   waitFor(() => {
  //     //   expect(getDocs(userCol)).toHaveBeenCalledWith()
  //     // }, 10000)
  //     const userList = userSnapshot.docs.map((doc) => doc.data())
  //     userList.map((item) => {
  //       console.log('map:', family, item['family-name'])
  //       if (family.includes(item['family-name'])) {
  //         // setList(item.todoList)
  //         listConst.push(item[item.todoList])
  //         // console.log('item:', item.todoList[0].item)
  //       } else {
  //       }
  //     })
  //   }
  //   GetData()
  //   console.log('list:', list)
  //   console.log(!!userFamilies, !!name, !!list)
  //   console.log(family, nameConst, listConst)
  // }, [])

  const renderFlatlist = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.flatlistBlock}
        // onPress={() =>
        //   navigation.navigate('ToDoScreen', {
        //     userFamilies: userFamilies,
        //     list: list,
        //   })
        // }
        onPress={() => navigation.navigate(item.screen)}
      >
        <Ionicons name={item.icon} size={40} color="red" />
        <Text>{item.text}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headerBlock}>
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.personalButtonView}>
            <View style={styles.personalButtonViewLeft} />
            <View style={styles.personalButtonViewBottom} />
            <View style={styles.personalButtonViewLittleBlock} />
            <View style={styles.personalButtonViewCorner} />
            <View style={styles.personalButtonViewCircle}>
              <EvilIcons name="pencil" size={24} color="black" />
              {/* <Ionicons
                name="person-circle-outline"
                size={width * 0.3 * 0.25 + 2}
                color="#000"
              /> */}
            </View>
            <View style={styles.personalButtonViewTextView}>
              <Text style={styles.personalButtonViewTitle}>21</Text>
              <Text style={styles.personalButtonViewText}>tasks left</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => navigation.navigate('UserScreen', { name: name })}
          onPress={() => navigation.navigate('UserScreen')}
        >
          <Ionicons name="person-circle-outline" size={35} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={35} color="red" />
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={2}
        data={Data}
        renderItem={renderFlatlist}
        keyExtractor={(item) => item.id}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE8C9',
    paddingTop: 20,
  },
  headerBlock: {
    width: '100%',
    height: height * 0.5,
    padding: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // inside header

  // button with person
  personalButtonView: {
    width: width * 0.3,
    height: width * 0.25,
    backgroundColor: '#FDE8C9',
  },
  personalButtonViewLeft: {
    height: '100%',
    width: width * 0.3 - width * 0.3 * 0.25,
    backgroundColor: '#000',
    borderRadius: 25,
    borderTopEndRadius: width * 0.3 * 0.25 * 0.5,
    position: 'absolute',
    left: 0,
  },
  personalButtonViewBottom: {
    height: width * 0.25 - width * 0.3 * 0.25,
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 25,
    borderTopEndRadius: width * 0.3 * 0.25 * 0.5,
    position: 'absolute',
    bottom: 0,
  },
  personalButtonViewLittleBlock: {
    width: width * 0.3 * 0.25 * 0.5,
    height: width * 0.3 * 0.25 * 0.5,
    position: 'absolute',
    top: width * 0.3 * 0.25 * 0.5,
    right: width * 0.3 * 0.25 * 0.5,
    backgroundColor: '#000',
  },
  personalButtonViewCorner: {
    width: width * 0.3 * 0.25,
    height: width * 0.3 * 0.25,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FDE8C9',
    borderRadius: width * 0.3 * 0.25 * 0.5,
  },
  personalButtonViewCircle: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: width * 0.3 * 0.25,
    height: width * 0.3 * 0.25,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalButtonViewTextView: {
    width: '100%',
    height: '100%',
    padding: 18,
    paddingTop: 10,
    paddingLeft: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  personalButtonViewTitle: {
    color: '#fffdfc',
    fontSize: 35,
  },
  personalButtonViewText: {
    color: '#fffdfc',
    fontSize: 16,
  },
  // body
  flatlistBlock: {
    width: '50%',
    height: 150,
    borderColor: '#f8f8f8',
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
})
