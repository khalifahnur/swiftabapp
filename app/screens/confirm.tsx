import { StyleSheet } from 'react-native'
import React from 'react'
import ReviewSummary from '@/components/Reserve/ReserveScreen/Confirm/ReviewSummary'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ConfirmScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ReviewSummary />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'transparent'
    }
})