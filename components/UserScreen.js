import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

import MainNavigation from '../app/mainNavigation'
import toDoScreen from '../app/toDoScreen'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default function UserScreen() {
  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  })
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ToDo"
        component={toDoScreen}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="User"
        component={MainNavigation}
        options={{
          headerShown: false,
          headerLeft: () => null,
          cardStyleInterpolator: forFade,
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}
