import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const auth = getAuth()

export default function FamilyScreen() {
  const navigation = useNavigation()
  const [currentfamily, setCurrentFamily] = useState('')
  const [families, setFamilies] = useState([])
  useEffect(() => {
    const GetData = async () => {
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      // wait(1000)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        // console.log('user map:', item['user-families'])
        if (item['user-email'] == auth.currentUser.email) {
          setCurrentFamily(item['user-current-family'])
          setFamilies(item['user-families'])
        }
      })
    }
    GetData()
  }, [])

  const setDBCurrentFamily = async (item) => {
    await setDoc(
      doc(db, 'users', auth.currentUser.email),
      {
        'user-current-family': item,
      },
      { merge: true }
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Family</Text>
        <Text>user:{auth.currentUser.email}</Text>
        <Text>your family is</Text>
        <Text style={styles.familyTitle}> {currentfamily}</Text>
        <Text>List of available families:</Text>
        {families.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listFamilies}
            onPress={() => {
              setCurrentFamily(item)
              setDBCurrentFamily(item)
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <TouchableOpacity style={styles.buttonAdd}>
          <Text>Add a new family</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text>back</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  title: {
    alignSelf: 'center',
    fontWeight: '900',
    fontSize: 20,
  },
  familyTitle: {
    fontWeight: '900',
    fontSize: 20,
  },
  listFamilies: {
    width: '100%',
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 1,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
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
