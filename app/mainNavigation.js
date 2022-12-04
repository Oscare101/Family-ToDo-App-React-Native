import React, { useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

import { Text } from 'react-native'

const auth = getAuth()

export default function MainNavigation() {
  return (
    <>
      <Text>qwertyuiop[</Text>
      <Text>user:{auth.currentUser.email}</Text>
    </>
  )
}
