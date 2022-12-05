import React, { useState, useEffect } from 'react'

import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TextInput } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import auth from './firebase/firebase-config'

import Registration from './components/Registration'
import Login from './components/Login'
import Header from './components/Header'
import UserScreen from './components/MainNavigation'

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
          headerTitle: () => <Header name="login" />,
          headerStyle: { height: 150, backgroundColor: 'orange' },
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="Registration"
        component={Registration}
        options={{
          headerTitle: () => <Header name="registration" />,
          headerStyle: { height: 150, backgroundColor: '#00e4d0' },
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          headerShown: false,
          // headerTitle: () => <Header name="user" />,
          // headerStyle: { height: 150, backgroundColor: '#00e4d0' },
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
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
    </NavigationContainer>
  )
}
