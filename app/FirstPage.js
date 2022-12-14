import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from '../constants/colors'

export default function FirstPage() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('MainNavigation')}>
        <Text>To Main Screen</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: '5%',
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
