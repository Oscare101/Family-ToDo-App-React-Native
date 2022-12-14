import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { useNavigation } from '@react-navigation/native'

const auth = getAuth()

export default function UserScreen({ route }) {
  const [user, setUser] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    const GetData = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        if (item['user-email'] == auth.currentUser.email) {
          setUser(item)
        }
      })
    }
    GetData()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="person-outline" size={40} color="black" />
          <Text>
            {auth.currentUser.email}, {user['user-name']}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons name="people-outline" size={40} color="black" />
          <Text>
            {auth.currentUser.email}, {user['user-families']}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.goBack()}
      >
        <Text>back</Text>
      </TouchableOpacity>
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
