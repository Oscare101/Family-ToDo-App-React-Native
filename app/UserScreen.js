import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native'
import colors from '../constants/colors'

// import { useFonts } from 'expo-font'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { useNavigation } from '@react-navigation/native'
const auth = getAuth()

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

// const [fontsLoaded] = useFonts({
//   Inter_900Black: require('../assets/fonts/Roboto-BlackItalic.ttf'),
// })

export default function UserScreen() {
  const [user, setUser] = useState('')

  const navigation = useNavigation()

  // const [loaded] = useFonts({
  //   'Roboto-BlackItalic': require('../assets/Roboto-BlackItalic.ttf'),
  //   'Poppins-Regular': require('../assets/Poppins-Regular.ttf'),
  //   'Roboto-Regular': require('../assets/Roboto-Regular.ttf'),
  // })

  useEffect(() => {
    const GetData = async () => {
      const userSnapshot = await getDocs(collection(db, 'users'))
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((itemUser) => {
        if (itemUser['user-email'] == auth.currentUser.email) {
          setUser(itemUser)
        }
      })
    }
    GetData()
  }, [])

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={45} color={colors.black} />
        </TouchableOpacity>
        <View style={styles.dots}>
          <View style={styles.dot1} />
          <View style={styles.dot2} />
          <View style={styles.dot3} />
          <View style={styles.dot4} />
        </View>
      </View>
      {/* user info */}
      <View style={styles.userBlock}>
        <View style={styles.userTextBlock}>
          <Text style={styles.userBlockName}>{user['user-name']}</Text>
          <Text style={styles.userBlockEmail}>{auth.currentUser.email}</Text>
        </View>
        <View style={styles.userImageBlock}>
          <View style={styles.userImage} />
        </View>
      </View>
      {/* families */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: '5%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  // header
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  dots: {
    height: 30,
    width: 30,
  },
  dot1: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.mainorange,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dot2: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.black,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  dot3: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  dot4: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.black,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  // user info
  userBlock: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  userTextBlock: {
    width: width * 0.55,
    borderWidth: 1,
  },
  userBlockName: {
    color: colors.black,
    fontSize: 40,
  },
  userBlockEmail: {
    fontSize: 16,
    color: colors.darkbackground,
  },
  userImageBlock: {
    width: width * 0.3,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userImage: {
    width: width * 0.3 * 0.9,
    height: width * 0.3 * 0.9,
    borderRadius: 100,
    backgroundColor: colors.mainorange,
  },
})
