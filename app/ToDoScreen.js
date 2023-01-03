import React, { useEffect, useState } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import colors from '../constants/colors'
import { useIsFocused } from '@react-navigation/native'
import texts from '../constants/texts'
const auth = getAuth()

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

const icons = [
  'fast-food-outline',
  'home-outline',
  'car-outline',
  'cart-outline',
  'airplane-outline',
  'newspaper-outline',
  'phone-portrait-outline',
  'calendar-sharp',
]

export default function ToDoScreen() {
  const navigation = useNavigation()
  const [userCurrentFamily, setUserCurrentFamily] = useState('')
  const [name, setName] = useState('')
  const [list, setList] = useState([])
  const [item, setItem] = useState('')
  // const [icon, setIcon] = useState('')
  const [curIcon, setCurIcon] = useState('')
  const [t, setT] = useState({})

  const isFocused = useIsFocused()

  const [refreshing, setRefreshing] = React.useState(false)

  const GetUser = async () => {
    let family = []

    const userCol = collection(db, 'users')
    const userSnapshot = await getDocs(userCol)
    const userList = userSnapshot.docs.map((doc) => doc.data())
    userList.map((item) => {
      if (item['user-email'] == auth.currentUser.email) {
        setUserCurrentFamily(item['user-current-family'])
        setName(item['user-name'])
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
  async function getLanguage() {
    let c = await AsyncStorage.getItem('language')
    setT(texts[c])
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(100).then(() => {
      GetUser()
      setRefreshing(false)
    })
  }, [])

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      GetUser()
      getLanguage()
    }
  }, [isFocused])

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
        activeOpacity={0.8}
        style={styles.listView}
        onPress={() => {
          list[index].isActive = !list[index].isActive
          list[index].doneBy = list[index].doneBy == '' ? name : ''

          setDBList(list)
        }}
        onLongPress={() => {
          list.splice(index, 1)
          setDBList(list)
        }}
      >
        <Ionicons name={item.icon} size={24} />
        <Text
          style={[
            styles.listText,
            { textDecorationLine: item.isActive ? 'none' : 'line-through' },
          ]}
        >
          {item.item}
        </Text>
        <Text style={styles.listName}>
          {t['writtenBy']} {item.author}
        </Text>
        <Text style={styles.listDoneName}>
          {item.doneBy ? `${t['doneBy']} ${item.doneBy}` : ''}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack({ length: list.length })}
        >
          <Ionicons name="arrow-back" size={35} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.dots}>
          <Text style={styles.headerText}>{t['YourTaskList']}</Text>
        </View>
      </View>
      <ScrollView
        style={{ paddingHorizontal: '5%' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {list.map((item, index) => (
          <ListRender item={item} index={index} key={index} />
        ))}
      </ScrollView>
      <View style={styles.inputView}>
        <View style={styles.iconsView}>
          {icons.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (item == curIcon) setCurIcon('')
                else setCurIcon(item)
              }}
              style={[
                styles.iconBlock,
                {
                  backgroundColor:
                    item == curIcon ? colors.maingreen : '#00000000',
                },
              ]}
              key={index}
            >
              <Ionicons name={item} size={24} color="black" />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder={t['placeholder']}
            style={styles.inputLine}
            value={item}
            onChangeText={(text) => setItem(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={() => {
            if (item.trim()) {
              setDBList([
                ...list,
                {
                  item: item,
                  isActive: true,
                  author: name,
                  icon: curIcon,
                  doneBy: '',
                },
              ])
              setItem('')
            }
          }}
        >
          <Text>{t['AddNewTask']}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,

    flex: 1,
    paddingTop: 20,
    justifyContent: 'space-between',
  },
  // header
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    letterSpacing: 1,
  },
  listView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    // backgroundColor: colors,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.black,
  },
  listText: {
    fontSize: 20,
    marginLeft: 8,
  },
  listName: {
    position: 'absolute',
    right: 5,
    top: 3,
    color: '#444',
    fontSize: 12,
  },
  listDoneName: {
    position: 'absolute',
    right: 5,
    bottom: 3,
    color: '#444',
    fontSize: 12,
  },
  inputView: {
    backgroundColor: colors.white,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: 20,
  },
  iconsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBlock: {
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
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
    backgroundColor: colors.mainpurple,
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
