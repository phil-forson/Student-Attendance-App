import { View, Text } from './Themed'
import React from 'react'
import { styles } from '../styles/styles';
import { calculateDurationInHHMMSS, secondsToHHMMSS } from '../utils/utils';
import { Timestamp } from 'firebase/firestore';
import Colors from '../constants/Colors';
import { useColorScheme } from 'react-native';

export default function UserAttendanceCard({item}: any) {
    console.log('item from attendance card ', item)
    const theme = useColorScheme()
    return (
      <View
        style={[
          styles.flexRow,
          styles.itemsCenter,
          styles.justifyBetween, styles.rounded,{
            padding: 15,
            backgroundColor: theme === "dark" ? Colors.dark.primaryGrey : Colors.light.primaryGrey
          }
        ]}
        lightColor={Colors.light.primaryGrey}
      >
        <Text>
          {item?.userData.firstName}
          {"  "}
          {item?.userData.lastName}
        </Text>
        <Text>
          { secondsToHHMMSS(item?.totalDuration)}
        </Text>
      </View>
    );
}