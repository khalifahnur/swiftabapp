import Container from '@/components/Reserve/ReserveScreen/Container'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ReserveScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Container />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    }
})