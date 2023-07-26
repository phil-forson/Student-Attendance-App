import { View, Text } from './Themed'
import React from 'react'
import { styles } from '../styles/styles'
import Colors from '../constants/Colors'
import { ActivityIndicator } from 'react-native'
import { StretchOutY } from 'react-native-reanimated'

export default function Loading() {
  return (
    <View style={[styles.flexOne, styles.justifyCenter, styles.itemsCenter]}>
      <View lightColor={Colors.light.secondaryGrey} darkColor={Colors.dark.secondaryGrey} style={[styles.rounded, styles.justifyCenter, styles.itemsCenter, {width: 120, height: 120}]}>
        <ActivityIndicator size={"large"}/>
      </View>
    </View>
  )
}