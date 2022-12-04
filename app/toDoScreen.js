import { Button, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function toDoScreen() {
  const navigation = useNavigation()

  return (
    <>
      <Text>-----To Do Screen-----</Text>
      <TouchableOpacity onPress={() => navigation.navigate('User')}>
        <Text>To User</Text>
      </TouchableOpacity>
    </>
  )
}
