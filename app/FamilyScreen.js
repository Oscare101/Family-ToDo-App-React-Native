import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'

const auth = getAuth()

export default function FamilyScreen() {
  const navigation = useNavigation()
  const [currentfamily, setCurrentFamily] = useState('')
  const [families, setFamilies] = useState([])
  const [familyName, setFamilyName] = useState('f2')
  const [familyPassword, setFamilyPassword] = useState('1')
  const [isSecure, setIsSecure] = useState(true)
  const [familyUsers, setFamilyUsers] = useState([])
  const [modalVisibla, setModalVisible] = useState(false)

  useEffect(() => {
    const GetData = async () => {
      let curFam
      const userCol = collection(db, 'users')
      const userSnapshot = await getDocs(userCol)
      // wait(1000)
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((item) => {
        // console.log('user map:', item['user-families'])
        if (item['user-email'] == auth.currentUser.email) {
          setCurrentFamily(item['user-current-family'])
          curFam = item['user-current-family']
          setFamilies(item['user-families'])
        }
      })
      const userColF = collection(db, 'families')
      const userSnapshotF = await getDocs(userColF)
      const userListF = userSnapshotF.docs.map((doc) => doc.data())
      console.log(curFam, userListF)
      userListF.map((item) => {
        if (curFam == item['family-name']) {
          setFamilyUsers(item['family-users'])
        } else {
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
      { merge: true } /////// change family -> chabge users
    )
  }

  const setDBUserFamilies = async (item) => {
    await setDoc(
      doc(db, 'users', auth.currentUser.email),
      {
        'user-families': [...families, item],
        'user-current-family': item,
      },
      { merge: true }
    )
    setCurrentFamily(item)
    const familyUsersOfNewFamily = []
    const userColF = collection(db, 'families')
    const userSnapshotF = await getDocs(userColF)
    const userListF = userSnapshotF.docs.map((doc) => doc.data())
    userListF.map((i) => {
      if (item == i['family-name']) {
        familyUsersOfNewFamily = i['family-users']
      } else {
      }
    })
    console.log('//////', familyUsersOfNewFamily)

    await setDoc(
      doc(db, 'families', item),
      {
        'family-users': [...familyUsersOfNewFamily, auth.currentUser.email], ///////////////////
      },
      { merge: true }
    )
    setFamilyUsers([...familyUsers, auth.currentUser.email])
    setFamilies([...families, item])
  }

  const JoinFamily = async () => {
    const userColF = collection(db, 'families')
    const userSnapshotF = await getDocs(userColF)
    const userListF = userSnapshotF.docs.map((doc) => doc.data())
    userListF.map((item) => {
      if (
        familyName == item['family-name'] &&
        familyPassword == item['family-password']
      ) {
        setDBUserFamilies(familyName)
      } else {
      }
    })
  }

  function InsideModalView() {
    return (
      <>
        <View style={styles.input}>
          <TextInput
            placeholder="Family name"
            style={styles.inputLine}
            value={familyName}
            onChangeText={(text) => setFamilyName(text)}
          />
        </View>
        <View style={styles.input}>
          <TextInput
            placeholder="Family password"
            style={styles.inputLine}
            value={familyPassword}
            autoCorrect={false}
            secureTextEntry={isSecure}
            onChangeText={(text) => setFamilyPassword(text)}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 5 }}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => JoinFamily()}>
          <Text>Join</Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Modal visible={modalVisibla}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text>Close</Text>
        </TouchableOpacity>
        <InsideModalView />
      </Modal>
      <View>
        <Text style={styles.title}>Family</Text>

        <Text>user:{auth.currentUser.email}</Text>
        <Text>your family is</Text>
        <Text style={styles.familyTitle}> {currentfamily}</Text>
        {familyUsers.map((user, index) => (
          <View key={index}>
            <Text>{user}</Text>
          </View>
        ))}
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
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.buttonAdd}
        >
          <Text>Join family</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAdd}>
          <Text>Add a new family</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBack}
          onPress={() => navigation.goBack()}
        >
          <Text>Back</Text>
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

  // Modal

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
})
