import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

const auth = getAuth()

export default function UserScreen() {
  return (
    <>
      <View>
        <Text>user:{auth.currentUser.email}</Text>
      </View>
    </>
  )
}
