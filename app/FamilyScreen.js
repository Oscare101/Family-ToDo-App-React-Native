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
    [colors.sky, colors.mainsky],

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
          {/* switch to button */}
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
          {/* amount of members */}
          <View
            style={[
              styles.membersView,
              { borderColor: colorsForFlarList[index % 4][1] },
            ]}
          >
            <Text style={styles.membersText}>
              {item['family-users'].length}{' '}
              {item['family-users'].length == 1 ? 'member' : 'members'}
            </Text>
          </View>
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
        {/* Modal */}
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
            <View style={styles.currentFamilyNameBlock}>
              <Text style={styles.currentFamilyText}>
                Your current family is
              </Text>
              <Text style={styles.currentFamilyTitle}> {currentfamily}</Text>
            </View>
            <View style={styles.currentFamilyIcon}>
              <Ionicons name="people-outline" size={44} color={colors.black} />
            </View>
          </View>
          <View style={styles.moreInfoView}>
            <Text style={styles.moreInfoText}>
              More information about the family
            </Text>
            <View style={styles.moreInfoIcon}>
              <Ionicons
                name="information-circle-outline"
                size={32}
                color={colors.white}
              />
            </View>
          </View>

          <Text style={styles.memberOfTitle}>
            Families groups you are a member of:
          </Text>
          <View style={styles.flatListBlock}>
            <FlatList
              data={[...families, lastFamilyItem]}
              renderItem={(index) => RenderFlatListFamilies(index)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={styles.usersBlock}>
          <View style={styles.usersBlockFlatListView}>
            {familyUsers.map((item, index) => (
              <Text key={index}>{item}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
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
    backgroundColor: colors.white,
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
    width: width * 0.9,
    height: width * 0.2,
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.darkbackground,
    borderRadius: 25,
  },
  currentFamilyNameBlock: {
    width: width * 0.9 * 0.8,
    height: width * 0.2,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 25,
    padding: 5,
    left: -2,
    top: -2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentFamilyText: {
    color: colors.darkbackground,
  },
  currentFamilyTitle: {
    fontSize: 40,
    letterSpacing: 1,
    color: colors.black,
  },
  currentFamilyIcon: {
    width: width * 0.9 * 0.2,
    height: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  moreInfoView: {
    width: '90%',
    height: 34,
    marginVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 100,
    backgroundColor: colors.black,
  },
  moreInfoText: {
    color: colors.white,
    fontSize: 16,
  },
  moreInfoIcon: {
    position: 'absolute',
    right: 0,
  },

  listFamilies: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 1,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
  },

  memberOfTitle: {
    alignSelf: 'center',
    fontSize: 20,
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
    marginTop: 10,
    marginBottom: 30,
    width: '100%',
  },
  flatListView: {
    width: width * 0.6,
    height: width * 0.5,
    borderRadius: 25,
    padding: 25,
    marginLeft: 20,
    borderWidth: 1,
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

  membersView: {
    position: 'absolute',
    left: 15,
    bottom: 15,
    width: '50%',
    padding: 5,
    alignItems: 'center',
    borderRadius: 100,

    borderTopWidth: 1,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 3,
  },
  membersText: {},

  // users block

  usersBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.white,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  usersBlockFlatListView: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 3,
    borderColor: colors.darkbackground,
    backgroundColor: colors.white,
    borderRadius: 25,
    overflow: 'hidden',
    padding: 15,
  },
})
