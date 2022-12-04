import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { Text } from 'react-native'

const auth = getAuth()

export default function MainNavigation() {
  const [name, setName] = useState('')

  useEffect(() => {
    console.log('useEffect navigation:')

    const GetData = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        if (item['user-email'] == auth.currentUser.email) {
          console.log('user: ', item)
          setName(item['user-name'])
        }
      })
    }
    GetData()
  }, [])

  return (
    <>
      <Text>
        user:{auth.currentUser.email}, {name}
      </Text>
    </>
  )
}
