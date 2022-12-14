import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import UserScreen from '../app/UserScreen'
import ToDoScreen from '../app/ToDoScreen'
import MainScreen from '../app/MainScreen'
import SettingsScreen from '../app/SettingsScreen'
import ChatScreen from '../app/ChatScreen'

import { createStackNavigator } from '@react-navigation/stack'
import FamilyScreen from '../app/FamilyScreen'

const Stack = createStackNavigator()

export default function MainNavigation() {
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  })
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="ToDoScreen"
        component={ToDoScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="FamilyScreen"
        component={FamilyScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}
