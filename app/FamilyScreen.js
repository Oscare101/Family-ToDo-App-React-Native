import React, { useEffect, useState } from 'react'

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constants/colors'

import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { db } from '../firebase/firebase-config'
import { useNavigation } from '@react-navigation/native'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
const auth = getAuth()

export default function FamilyScreen() {
  const navigation = useNavigation()
  const [currentfamily, setCurrentFamily] = useState('')
  const [families, setFamilies] = useState([])
  const [familiesName, setFamiliesName] = useState([])

  const [familyName, setFamilyName] = useState('f2')
  const [familyPassword, setFamilyPassword] = useState('1')
  const [isSecure, setIsSecure] = useState(true)
  const [familyUsers, setFamilyUsers] = useState([])

  const [modalVisibla, setModalVisible] = useState(false)

  useEffect(() => {
    const GetData = async () => {
      let familiesList = []
      let currentFamily = ''
      const userSnapshot = await getDocs(collection(db, 'users'))
      const userList = userSnapshot.docs.map((doc) => doc.data())

      userList.map((itemUser) => {
        if (itemUser['user-email'] == auth.currentUser.email) {
          familiesList = itemUser['user-families']
          setCurrentFamily(itemUser['user-current-family'])
          currentFamily = itemUser['user-current-family']
        }
      })
      let myFamilies = []
      let myfamiliesName = []
      const userSnapshotF = await getDocs(collection(db, 'families'))
      const userListF = userSnapshotF.docs.map((doc) => doc.data())
      userListF.map((item) => {
        if (familiesList.includes(item['family-name'])) {
          myFamilies.push(item)
          myfamiliesName.push(item['family-name'])
          if (currentFamily == item['family-name']) {
            setFamilyUsers(item['family-users'])
          }
        } else {
        }
      })
      setFamilies(myFamilies)
      setFamiliesName(myfamiliesName)
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
        'user-families': [...familiesName, item],
        'user-current-family': item,
      },
      { merge: true }
    )
    setCurrentFamily(item)
    setFamilies([...families, item])
    let familyUsersOfNewFamily = []
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
        'family-users': [...familyUsersOfNewFamily, auth.currentUser.email],
      },
      { merge: true }
    )
    setFamilyUsers([...familyUsersOfNewFamily, auth.currentUser.email])
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

  const colorsForFlarList = [
    [colors.orange, colors.mainorange],
    [colors.green, colors.maingreen],
    [colors.blue, colors.mainblue],
    [colors.purple, colors.mainpurple],
  ]
  const lastFamilyItem = { text: 'add new family' }

  function RenderFlatListFamilies({ item, index }) {
    if (item['family-name']) {
      return (
        <View
          style={[
            styles.flatListView,
            { backgroundColor: colorsForFlarList[index % 4][0] },
          ]}
        >
          <Ionicons name="ios-people-circle" size={24} color={colors.black} />
          <Text style={styles.faltListTitle}>{item['family-name']}</Text>

          <TouchableOpacity
            style={[
              styles.changeButtonView,
              { backgroundColor: colorsForFlarList[index % 4][1] },
            ]}
            onPress={() => {
              setCurrentFamily(item['family-name'])
              setDBCurrentFamily(item['family-name'])
            }}
          >
            <Ionicons name="arrow-redo-outline" size={24} color="black" />
            <Text style={styles.changeButtonText}>Switch to this family</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      // add family block
      return (
        <View
          style={[
            styles.flatListAdd,
            { backgroundColor: colorsForFlarList[index % 4][0] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.flatListAddIcon,
              { backgroundColor: colorsForFlarList[index % 4][1] },
            ]}
          >
            <Text style={styles.faltListAddTitle}>Create a new family</Text>
            <Ionicons name="ios-add" size={30} color={colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              styles.flatListAddIcon,
              { backgroundColor: colorsForFlarList[index % 4][1] },
            ]}
          >
            <Text style={styles.faltListAddTitle}>Join an existing one</Text>
            <Ionicons
              name="person-add-outline"
              size={30}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }
  // console.log('*********',families)

  return (
    <View style={styles.container}>
      <ScrollView>
        <Modal visible={modalVisibla}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Close</Text>
          </TouchableOpacity>
          <InsideModalView />
        </Modal>
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
        {/* body */}
        <View>
          <Text style={styles.title}>Family</Text>
          <View style={styles.currentFamilyBlock}>
            <Text style={styles.currentFamilyText}>Your current family is</Text>
            <Text style={styles.currentFamilyTitle}> {currentfamily}</Text>
          </View>
          <Text>user:{auth.currentUser.email}</Text>

          <Text>List of available families:</Text>
          <View style={styles.flatListBlock}>
            <FlatList
              data={[...families, lastFamilyItem]}
              renderItem={(index) => RenderFlatListFamilies(index)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.usersBlock}>
            <View style={styles.usersBlockFlatListView}>
              {familyUsers.map((item, index) => (
                <Text key={index}>{item}</Text>
              ))}
            </View>
          </View>

          {/* {families.map((item, index) => (
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
        ))} */}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  // body
  title: {
    alignSelf: 'center',
    fontWeight: '900',
    fontSize: 20,
  },
  currentFamilyBlock: {
    backgroundColor: colors.background,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 25,
    padding: 15,
  },
  currentFamilyText: {
    color: colors.darkbackground,
  },
  currentFamilyTitle: {
    fontSize: 40,
    letterSpacing: 1,
    color: colors.black,
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

  // FlatList

  flatListBlock: {
    marginVertical: 30,
    width: '100%',
  },
  flatListView: {
    width: width * 0.6,
    height: width * 0.5,
    borderRadius: 25,
    padding: 25,
    marginLeft: 20,
  },
  faltListTitle: {
    fontSize: 24,
    letterSpacing: 1,
    color: colors.black,
  },
  changeButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 100,
    padding: 5,
    width: '80%',
  },
  changeButtonText: {},
  flatListAdd: {
    width: width * 0.6,
    height: width * 0.5,
    borderRadius: 25,
    padding: 15,
    marginLeft: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 20,
  },
  flatListAddIcon: {
    width: '100%',
    height: width * 0.6 * 0.33,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faltListAddTitle: {
    fontSize: 16,
    letterSpacing: 1,
    color: colors.black,
  },

  // users block

  usersBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  usersBlockFlatListView: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 3,
    borderColor: colors.darkbackground,
    borderRadius: 25,
    overflow: 'hidden',
    padding: 15,
  },
})
