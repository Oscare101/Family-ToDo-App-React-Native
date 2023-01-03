import React, { useEffect, useState } from 'react'
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
import Login from '../components/Login'
import Registration from '../components/Registration'
import { useNavigation } from '@react-navigation/native'
import { EvilIcons, Ionicons } from '@expo/vector-icons'
import { useBackHandler } from '@react-native-community/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'

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
import texts from '../constants/texts'
import { auth } from '../firebase/firebase-config'
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export default function MainScreen() {
  const [listLength, setListLength] = useState()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [refreshing, setRefreshing] = useState(false)
  const [t, setT] = useState({})

  const Data = [
    {
      id: 1,
      title: 'Family',
      text: 'manage your family or even start a new one',
      icon: 'people-outline',
      screen: 'FamilyScreen',
      color: colors.blue,
    },
    {
      id: 2,
      title: 'Goals',
      text: 'set long-term and big goals',
      icon: 'bookmarks-outline',
      screen: 'FamilyScreen',
      color: colors.purple,
    },
    {
      id: 3,
      title: 'Finance',
      text: 'manage family expenses and income',
      icon: 'cash-outline',
      screen: 'FamilyScreen',
      color: colors.green,
    },
    {
      id: 4,
      title: 'Calendar',
      text: 'plan your events',
      icon: 'calendar',
      screen: 'FamilyScreen',
      color: colors.orange,
    },
  ]

  const GetUser = async () => {
    let family = []

    const userCol = collection(db, 'users')
    const userSnapshot = await getDocs(userCol)
    const userList = userSnapshot.docs.map((doc) => doc.data())
    userList.map((item) => {
      if (item['user-email'] == auth.currentUser.email) {
        // setUserCurrentFamily(item['user-current-family'])
        // setName(item['user-name'])
        family = item['user-current-family']
      }
    })
    const userColF = collection(db, 'families')
    const userSnapshotF = await getDocs(userColF)
    const userListF = userSnapshotF.docs.map((doc) => doc.data())
    userListF.map((item) => {
      if (family == item['family-name']) {
        setListLength(item.todoList.length)
      } else {
      }
    })
  }
  async function getLanguage() {
    let c = await AsyncStorage.getItem('language')
    setT(texts[c])
  }

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      GetUser()
      getLanguage()
    }
  }, [isFocused])

  // useBackHandler(() => {
  //   return true
  // })

  const renderFlatlist = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.flatlistBlock}
          onPress={() => navigation.navigate(item.screen)}
        >
          <View
            style={[styles.flatlistBlockIcon, { backgroundColor: item.color }]}
          >
            <Ionicons name={item.icon} size={40} color={colors.black} />
          </View>
          <View style={styles.flatlistBlockText}>
            <Text style={styles.flatlistTitle}>{item.title}</Text>
            <Text style={styles.flatlistText}>{item.text}</Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#D5D5D5',
            width: '80%',
            height: 1,
            alignSelf: 'center',
          }}
        />
      </>
    )
  }

  function ContentDate() {
    const date = new Date()
    let month = ''

    switch (date.getMonth() + 1) {
      case 1:
        month = t['January']
        break
      case 2:
        month = t['February']
        break
      case 3:
        month = t['March']
        break
      case 4:
        month = t['April']
        break
      case 5:
        month = t['May']
        break
      case 6:
        month = t['June']
        break
      case 7:
        month = t['July']
        break
      case 8:
        month = t['August']
        break
      case 9:
        month = t['September']
        break
      case 10:
        month = t['October']
        break
      case 11:
        month = t['November']
        break
      case 12:
        month = t['December']
        break
    }

    let day = ''
    switch (date.getDate() % 10) {
      case 1:
        day = 'st'
        break
      case 2:
        day = 'nd'
        break
      case 3:
        day = 'rd'
        break
      default:
        day = 'th'
        break
    }
    if (date.getDate() > 3 && date.getDate() < 21) day = 'th'

    return (
      <Text style={{ color: '#9D907E' }}>
        {month} {date.getDate()}
        {day} ,{date.getFullYear()}
      </Text>
    )
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    wait(100).then(() => {
      GetUser()
      setRefreshing(false)
    })
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.headerBlock}>
        {/* top header */}
        <View style={styles.headerTexts}>
          <Text style={styles.headerTextsTitle}>{t['yourTaskMahager']}</Text>
          <ContentDate />
        </View>
        {/* mid header */}
        <View style={styles.headerPersonalTodoBlock}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('ToDoScreen')}
          >
            <View style={styles.personalButtonView}>
              <View style={styles.personalButtonViewLeft} />
              <View style={styles.personalButtonViewBottom} />
              <View style={styles.personalButtonViewLittleBlock} />
              <View style={styles.personalButtonViewCorner} />
              <View style={styles.personalButtonViewCircle}>
                <EvilIcons name="pencil" size={24} color="black" />
              </View>
              <View style={styles.personalButtonViewTextView}>
                <Text style={styles.personalButtonViewTitle}>{listLength}</Text>
                <Text style={styles.personalButtonViewText}>
                  {t['tasksLeft']}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <View style={styles.toDoButtonView}>
              <View style={styles.toDoButtonViewWithText}>
                <Text style={styles.toDoButtonViewWithTextText}>
                  {t['discussYourGoalsWithOthers']}
                </Text>
              </View>
              <View style={styles.toDoButtonViewOpen}>
                <View style={styles.toDoButtonViewOpenIcon}>
                  <Ionicons
                    name="newspaper-outline"
                    size={24}
                    color={colors.white}
                  />
                </View>
                <Text style={styles.toDoButtonViewOpenText}>{t['chat']}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* bottom header */}
        <View style={styles.bottomHeaderBlock}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('UserScreen')}
          >
            <View style={styles.bottomHeaderAccountView}>
              <Text style={styles.bottomHeaderAccountTitle}>
                {t['Account']}
              </Text>
              <View style={styles.bottomHeaderAccountIcon}>
                <Ionicons
                  name="person-circle-outline"
                  size={40}
                  color={colors.black}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <View style={styles.bottomHeaderSettingsView}>
              <Text style={styles.bottomHeaderSettingsTitle}>
                {t['Settings']}
              </Text>
              {/* <Ionicons
                name="settings-outline"
                size={35}
                color={colors.white}
              /> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* flatlist */}
      <View style={styles.flatListView}>
        <FlatList
          numColumns={1}
          data={Data}
          renderItem={renderFlatlist}
          keyExtractor={(item) => item.id}
          onRefresh={() => onRefresh()}
          refreshing={refreshing}
        />
      </View>
    </View>
  )
}

const widthForSmallButtons = width * 0.55 * 0.5
const widthForSmallIcon = width * 0.25 * 0.5
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  headerBlock: {
    width: '100%',
    height: height * 0.45,
    padding: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  // mid header block
  headerPersonalTodoBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  headerTexts: {
    width: '100%',
    padding: 20,
    alignItems: 'flex-start',
  },
  headerTextsTitle: {
    fontSize: 40,
    color: colors.black,
  },

  // button with person
  personalButtonView: {
    width: width * 0.35,
    height: width * 0.25,
    backgroundColor: '#FDE8C9',
  },
  personalButtonViewLeft: {
    height: '100%',
    width: width * 0.35 - width * 0.35 * 0.25,
    backgroundColor: colors.black,
    borderRadius: 25,
    borderTopEndRadius: width * 0.35 * 0.25 * 0.5,
    position: 'absolute',
    left: 0,
  },
  personalButtonViewBottom: {
    height: width * 0.25 - width * 0.35 * 0.25,
    width: '100%',
    backgroundColor: colors.black,
    borderRadius: 25,
    borderTopEndRadius: width * 0.35 * 0.25 * 0.5,
    position: 'absolute',
    bottom: 0,
  },
  personalButtonViewLittleBlock: {
    width: width * 0.35 * 0.25,
    height: width * 0.35 * 0.25,
    position: 'absolute',
    top: width * 0.35 * 0.25 * 0.5,
    right: width * 0.35 * 0.25 * 0.5,
    backgroundColor: colors.black,
  },
  personalButtonViewCorner: {
    width: width * 0.35 * 0.25,
    height: width * 0.35 * 0.25,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FDE8C9',
    borderRadius: width * 0.35 * 0.25 * 0.5,
  },
  personalButtonViewCircle: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: width * 0.35 * 0.25,
    height: width * 0.35 * 0.25,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.black,
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
    letterSpacing: 2,
  },
  // ToDo Button View

  toDoButtonView: {
    width: width * 0.55,
    height: width * 0.25,
    borderWidth: 2,
    borderColor: '#B5A691',
    borderRadius: 25,
  },
  toDoButtonViewWithText: {
    width: '50%',
    height: '100%',
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  toDoButtonViewWithTextText: {
    fontSize: 14,
  },
  toDoButtonViewOpen: {
    height: width * 0.25,
    width: widthForSmallButtons,
    position: 'absolute',
    right: -2,
    top: -2,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toDoButtonViewOpenIcon: {
    width: widthForSmallIcon,
    height: widthForSmallIcon,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  toDoButtonViewOpenText: {
    fontSize: 16,
    letterSpacing: 2,
  },

  // bottom header

  bottomHeaderBlock: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  bottomHeaderAccountView: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 100,
    width: width * 0.55 * 0.5 + width * 0.35,
    height: 40,
    borderWidth: 2,
    borderColor: colors.darkbackground,
    alignItems: 'center',
  },
  bottomHeaderAccountTitle: {
    color: colors.black,
    fontSize: 18,
    letterSpacing: 2,
  },
  bottomHeaderAccountIcon: {
    position: 'absolute',
    right: -2,
  },

  bottomHeaderSettingsView: {
    height: 40,
    width: widthForSmallButtons,
    backgroundColor: colors.black,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  bottomHeaderSettingsTitle: {
    color: colors.white,
    fontSize: 14,
    letterSpacing: 1,
  },

  //////////////////
  flatListView: {
    flex: 1,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  flatlistBlock: {
    width: '100%',
    height: 130,

    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  flatlistBlockIcon: {
    height: 70,
    width: 70,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  flatlistBlockText: {
    width: '100%',
    paddingLeft: 20,
  },
  flatlistTitle: {
    fontSize: 40,
    color: colors.black,
  },
  flatlistText: { color: '#9E9E9E' },
})
