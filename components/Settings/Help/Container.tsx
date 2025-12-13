import { Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Container() {
  return (
    <SafeAreaView style={{flex:1}}>
      <Text>Container</Text>
    </SafeAreaView>
  )
}
