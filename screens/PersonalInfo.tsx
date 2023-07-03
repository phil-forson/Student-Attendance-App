import { View, Text, SafeAreaView } from '../components/Themed'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function PersonalInfo() {
  return (
    <SafeAreaView style={[styles.container]}>
      <Text>PersonalInfo</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})