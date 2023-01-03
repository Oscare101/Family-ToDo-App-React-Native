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
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native'
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { getDocs, doc, setDoc, collection } from 'firebase/firestore/lite'
import { onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'
import colors from '../constants/colors'
import texts from '../constants/texts'

const auth = getAuth()

export default function SettingsScreen() {
  const [t, setT] = useState({})
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  async function getLanguage() {
    let c = await AsyncStorage.getItem('language')
    setT(texts[c])
  }

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (isFocused) {
      getLanguage()
    }
  }, [isFocused])

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
      <View style={styles.langBlock}>
        <Text style={styles.langTitle}>{t['language']}</Text>
        <View style={styles.langTouchBlock}>
          <TouchableOpacity
            style={styles.langTouchItem}
            onPress={async () => {
              await AsyncStorage.setItem('language', 'ua')
              setT(texts['ua'])
            }}
          >
            <Text style={styles.langTouchText}>Українська</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.langTouchItem}
            onPress={async () => {
              await AsyncStorage.setItem('language', 'en')
              setT(texts['en'])
            }}
          >
            <Text style={styles.langTouchText}>English</Text>
          </TouchableOpacity>
        </View>
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
  // language block
  langBlock: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  langTitle: {
    fontSize: 28,
    letterSpacing: 1,
    paddingVertical: 20,
  },
  langTouchBlock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  langTouchItem: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 20,
  },
  langTouchText: {
    fontSize: 20,
  },
})
