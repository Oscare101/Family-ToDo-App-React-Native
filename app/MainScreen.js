import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'

const auth = getAuth()
const Data = [
  { id: 1, text: 'ToDo', icon: 'list', screen: 'ToDoScreen' },
  {
    id: 2,
    text: 'Chat',
    icon: 'chatbox-ellipses-outline',
    screen: 'ToDoScreen',
  },
  { id: 3, text: 'Plans', icon: 'calendar-outline', screen: 'ToDoScreen' },
  { id: 4, text: 'Family', icon: 'people-outline', screen: 'UserScreen' },
]

export default function MainScreen() {
  const navigation = useNavigation()

  const renderFlatlist = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.flatlistBlock}
        onPress={() => navigation.navigate('ToDoScreen')}
      >
        <Ionicons name={item.icon} size={40} color="red" />
        <Text>{item.text}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Main</Text>
      <View style={styles.headerBlock}>
        <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
          <Ionicons name="person-circle-outline" size={35} color="red" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={35} color="red" />
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={2}
        data={Data}
        renderItem={renderFlatlist}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity>
        <Text>Create a new family</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerBlock: {
    width: '100%',
    padding: 10,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
