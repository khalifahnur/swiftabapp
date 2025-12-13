import { StyleSheet, View } from 'react-native'
import React from 'react'
import Container from '@/components/Details/Menu/Container'


export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Container />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})