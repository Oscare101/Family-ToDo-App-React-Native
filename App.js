import React from 'react'

import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Registration from './components/Registration'
import Login from './components/Login'
import MainNavigation from './components/MainNavigation'
import FirstPage from './app/FirstPage'

const Stack = createStackNavigator()

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          cardStyleInterpolator: forFade,
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="MainNavigation"
        component={MainNavigation}
        options={{
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
          headerShown: false,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="FirstPage"
        component={FirstPage}
        options={{
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <App />
      {/* <MainNavigation /> */}
    </NavigationContainer>
  )
}
