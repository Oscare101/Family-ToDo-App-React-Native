import { Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function FirstPage() {
  const navigation = useNavigation()

  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate('MainNavigation')}>
        <Text>To Main Screen</Text>
      </TouchableOpacity>
    </>
  )
}
