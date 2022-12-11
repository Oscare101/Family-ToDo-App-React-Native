import { Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function SettingsScreen() {
  const navigation = useNavigation()

  return (
    <View>
      <Text>Settings Screen</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </TouchableOpacity>
    </View>
  )
}
